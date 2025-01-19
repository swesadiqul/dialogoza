import ollama

def generate_response(prompt):
    # Initialize the Ollama client
    client = ollama.Client()

    # Send the query to the model
    response = client.generate(model="llama2", prompt=prompt)

    return response.response