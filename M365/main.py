import vertexai
from vertexai.generative_models import GenerativeModel

# TODO(developer): Update and un-comment below line
project_id = "migrant365dev"

vertexai.init(project=project_id, location="us-central1")

model = GenerativeModel(model_name="gemini-1.5-flash-001")

# msg = """
# Растов саратив самара дан водий га одам почта оламиз 22 душанба куни битта кам машина кобилт шафир узим Тлф 944665666 /+79052100805 телигирам.бор
# """

# response = model.generate_content(
#     msg + 
#     " " + 
#     "extract the phone number and city names and car model from the text. Only car model without the brand name." +
#     " " +
#     "results should as json format. City and car model should be translated to English." +
#     " " +
#     "also make sure the cities referes only Russian and Uzbekistan cities. The same applies to the car models and phone numbers."
# )


# response = model.generate_content("How much vertexai costs? For example if I send request about 1000 times per day.")

response = model.generate_content("Give review of this place on google map 41.4681286,69.3550982 by python code")


print(response.text)