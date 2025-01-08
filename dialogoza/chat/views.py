from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
import openai
from .serializers import ChatMessageSerializer
from rest_framework.permissions import AllowAny

openai.api_key = settings.OPENAI_API_KEY

class ChatView(APIView):
    permission_classes = [AllowAny]

    @csrf_exempt
    def post(self, request):
        serializer = ChatMessageSerializer(data=request.data)
        if serializer.is_valid():
            user_message = serializer.validated_data['message']

            try:
                # Query OpenAI GPT-3
                response = openai.Completion.create(
                    model="text-davinci-003",  # Or other available models
                    prompt=user_message,
                    max_tokens=150
                )

                ai_reply = response.choices[0].text.strip()
                return Response({"reply": ai_reply}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
