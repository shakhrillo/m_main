from openai import OpenAI

client = OpenAI(api_key='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')
json_format = """
{
    startPoint: {
        city: "",
        country: "",
        lat: "",
        lng: ""
    },
    endPoint: {
        city: "",
        country: "",
        lat: "",
        lng: ""
    },
    "phoneNumbers": [""],
    "carNames": [""],
    "category": [""],
    "departureTime": [""] // date time format
}
"""
def extract_message(message):
    translated_message = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            # {"role": "user", "content": message + "Convert it to english."}
            {"role": "user", "content": message + "response in uzbek langugae with more human way"}
        ],
        # temperature=.0,
    )

    # response = client.chat.completions.create(
    #     model="gpt-3.5-turbo",
    #     messages=[
    #         {
    #             "role": "user",
    #             "content": message +
    #             # "The above text language can be Uzbek or Russian only" +
    #             "Convert it to english." +
    #             # "Provice lat and lng of the cities." +
    #             "return as this format" +
    #             json_format
    #         }
    #     ],
    #     # temperature=.0,
    # )

    # print(len(response.choices))

    # return response.choices[0].message.content
    return translated_message.choices[0].message.content