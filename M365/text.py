from google.cloud import language_v2
import os

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "/Users/mukhammad/Downloads/migrant365dev-eecc12c5ecbd.json"

# AnalyzeSentimentRequest
def analyze_sentiment(text_content):
    client = language_v2.LanguageServiceClient()

    type_ = language_v2.Document.Type.PLAIN_TEXT
    document = {
        "content": text_content,
        "type": type_,
        "language_code": "uz"
    }

    response = client.analyze_sentiment(request={'document': document})

    return {
        "score": response.document_sentiment.score,
        "magnitude": response.document_sentiment.magnitude
    }

# def analyze_entities(text_content):
#     client = language_v2.LanguageServiceClient()

#     type_ = language_v2.Document.Type.PLAIN_TEXT
#     document = {
#         "content": text_content,
#         "type": type_,
#         "language_code": "uz"
#     }

#     response = client.analyze_entities(request={'document': document})

#     # save response as json locally
#     with open('response.json', 'w') as f:
#         f.write(str(response))

        

    # car_models = []
    # city_names = []
    # phone_numbers = []

    # for entity in response.entities:
    #     if entity.type == language_v1.Entity.Type.OTHER:
    #         continue  # Skip entities that are not clearly identified types

    #     entity_type = language_v1.Entity.Type(entity.type).name
    #     entity_name = entity.name

    #     if entity_type == "CONSUMER_GOOD":
    #         car_models.append(entity_name)
    #     elif entity_type == "LOCATION":
    #         city_names.append(entity_name)
    #     elif entity_type == "PHONE_NUMBER":
    #         phone_numbers.append(entity_name)

    # return {
    #     "car": ", ".join(car_models),
    #     "city": ", ".join(city_names),
    #     "phone": ", ".join(phone_numbers)
    # }

# AnnotateTextRequest
def analyze_text(text_content):
    client = language_v2.LanguageServiceClient()

    type_ = language_v2.Document.Type.PLAIN_TEXT
    document = {
        "content": text_content,
        "type": type_,
        # "language": "uz"
    }

    response = client.annotate_text(request={'document': document})

    return response

text_content = "Растов саратив самара дан водий га одам почта оламиз 22 душанба куни битта кам машина кобилт шафир узим Тлф 944665666 /+79052100805 телигирам.бор"
# print(analyze_entities(text_content))
# print(analyze_sentiment(text_content))
print(analyze_text(text_content))
