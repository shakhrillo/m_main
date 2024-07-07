import json
from openai import OpenAI

# Initialize OpenAI client
client = OpenAI(api_key='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')

response = client.chat.completions.create(
  model="gpt-4o",
#   model="gpt-3.5-turbo",
  response_format={ "type": "json_object" },
  messages=[
    {"role": "system", "content": "You are a helpful assistant designed to output JSON."},
    {"role": "user", "content": "Get all land border crossing points for Uzbekistan territories with lat lng"}
  ]
)
print(response.choices[0].message.content)

# Parse the message content as JSON
border_points = json.loads(response.choices[0].message.content)

# Save the border points to a JSON file
with open('border_crossing/data/uz_border_points.json', 'w') as f:
    json.dump(border_points, f, indent=4)
