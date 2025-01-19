from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.shortcuts import get_object_or_404
from chat.models import *
from chat.serializers import *
from chat.utils import generate_response
from rest_framework.authentication import TokenAuthentication



class ChatWithAI(APIView):
    """
    Starts a new chat session. Does not require a `conversation_id` in the request.
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    @swagger_auto_schema(
        operation_id="new_chat_with_ai",
        operation_description="Start a new chat session with a provided AI model.",
        request_body=ChatRequestSerializer,
        responses={
            201: ChatContentSerializer,
            400: openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    "error": openapi.Schema(type=openapi.TYPE_STRING)
                }
            ),
        },
        tags=["Chat"],
    )
    def post(self, request):
        user = request.user  # This automatically gets the authenticated user

        # Step 1: Validate input
        serializer = ChatRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        content = serializer.validated_data['content']

        # Step 3: Create a new chat
        chat = Chat.objects.create(
            user=user,
            title=content,
        )

        # Step 4: Create ChatContent for the user's message
        ChatContent.objects.create(
            chat=chat,
            role='user',
            content=content
        )

        # Step 5: Generate AI response
        response = generate_response(content)

        # Step 6: Create ChatContent for the AI's response
        chat_content = ChatContent.objects.create(
            chat=chat,
            role='ai',
            content=response
        )

        # Step 7: Serialize and return the new chat content
        chat_serializer = ChatContentSerializer(chat_content)
        return Response(chat_serializer.data, status=status.HTTP_201_CREATED)


class ChatWithAIContinue(APIView):
    """
    Continues an existing chat session based on the provided `conversation_id` in the URL.
    """
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_id="continue_chat_with_ai",
        operation_description=(
            "Continue a conversation by providing an existing `conversation_id` in the URL."
        ),
        request_body=ChatRequestSerializer,
        responses={
            200: ChatContentSerializer,
            400: openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    "error": openapi.Schema(type=openapi.TYPE_STRING)
                }
            ),
            404: openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    "detail": openapi.Schema(type=openapi.TYPE_STRING)
                }
            ),
        },
        tags=["Chat"],
    )
    def post(self, request, conversation_id):
        user = request.user

        # Step 1: Validate input for message and model_id
        serializer = ChatRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        content = serializer.validated_data['content']


        # Step 3: Check if the conversation exists and belongs to the user
        chat = get_object_or_404(Chat, id=conversation_id, user=user)

        # Step 4: Create ChatContent for the user's message
        ChatContent.objects.create(
            chat=chat,
            role='user',
            content=content
        )

        # Step 5: Generate AI response
        response = generate_response(content)

        # Step 6: Create ChatContent for the AI's response
        ChatContent.objects.create(
            chat=chat,
            role='ai',
            content=response
        )

        # Step 7: Serialize and return the updated chat content
        chat_serializer = ChatSerializer(chat)
        return Response(chat_serializer.data, status=status.HTTP_200_OK)


class ChatHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(tags=["Chat"], operation_id="chat_history")
    def get(self, request):
        # Fetch the chats of the authenticated user
        chats = Chat.objects.filter(user=request.user).order_by('-timestamp')
        
        # Serialize the chat history
        serializer = ChatSerializer(chats, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class ChatLiveSearchView(APIView):
    """
    API to perform live search on chat titles.
    """
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_id="chat_live_search",
        operation_description="Search chats by title dynamically.",
        manual_parameters=[
            openapi.Parameter(
                "q",
                openapi.IN_QUERY,
                description="Search query string for the chat title",
                type=openapi.TYPE_STRING,
                required=False,
            )
        ],
        responses={
            200: openapi.Response(
                description="List of chats matching the search query",
                schema=openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            "id": openapi.Schema(type=openapi.TYPE_INTEGER, description="Chat ID"),
                            "title": openapi.Schema(type=openapi.TYPE_STRING, description="Chat title"),
                            "created_at": openapi.Schema(type=openapi.TYPE_STRING, format="date-time", description="Chat creation timestamp"),
                        },
                    ),
                ),
            ),
            400: openapi.Response(
                description="Bad Request",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "error": openapi.Schema(type=openapi.TYPE_STRING),
                    },
                ),
            ),
        },
        tags=["Chat"],
    )
    def get(self, request):
        query = request.query_params.get('q', '').strip()  # Get the search query
        if not query:
            return Response([], status=status.HTTP_200_OK)  # Return an empty list if no query

        # Filter chats by title containing the query for the authenticated user
        chats = Chat.objects.filter(user=request.user, title__icontains=query).order_by('-timestamp')

        # Serialize the filtered results
        serializer = ChatSerializer(chats, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)