from openai import OpenAI

# Initialize OpenAI client
client = OpenAI(api_key='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')

def send_ai_message(
    model: str, # gpt-4o, gpt-3.5-turbo, etc.
    response_format: dict,
    sys_message: str,
    user_messages: list,
):
    if model is None:
        model = 'gpt-3.5-turbo'

    if response_format is None:
        response_format = { "type": "json_object" }

    messages = []

    messages.append({
        "role": "system",
        "content": sys_message
    })

    for message in user_messages:
        messages.append({
            "role": "user",
            "content": message
        })
    
    response = client.chat.completions.create(
        model=model,
        response_format=response_format,
        messages=messages
    )

    return response.choices[0].message.content