import asyncio
from selenium_scrap.google_map_reviews_data import google_map_reviews_data
from selenium_scrap.helper.change_language_in_url import change_language_in_url
from selenium_scrap.google_map_review_link import google_map_review_link
from selenium_scrap.google_map_search import google_map_search
from selenium_scrap.google_map_reviews import google_map_reviews
# from telegram.send_message import send_telegram_message
from open_ai.send_message import send_ai_message
import mysql.connector

# conn = mysql.connector.connect(
#     host="localhost",
#     user="root",
#     password="12345678",
#     database="borders"
# )

# cursor = conn.cursor()

# openairesponse = send_ai_message(
#     model='gpt-3.5-turbo',
#     response_format={ "type": "json_object" },
#     sys_message='Border crossing points',
#     user_messages=[
#         "all land border points Russia Kazakhstan as json",
#     ]
# )

# print(openairesponse)
# Save as csv
# with open('border_crossing_points.csv', 'w') as f:
#   f.write(openairesponse)
    # for point in openairesponse:
        # f.write(point + '\n')

loop = asyncio.get_event_loop()
# review_data = loop.run_until_complete(google_map_search("Kulata and Promachonas"))
# review_data = loop.run_until_complete(google_map_search("Qafë Botë"))
review_data = loop.run_until_complete(google_map_search("Tazhen"))

print(len(review_data))

# save as csv
with open('google_reviews.csv', 'w') as f:
    # name, address, phone, reviews
    # f.write('User, User info, Review\n')
    # for review in review_data:
    #     f.write(review['user_name'] + ', ' + review['user_info'] + ', ' + review['review'] + '\n')

    f.write('User, User info, Review\n')
    for review in review_data:
        user_name = review.get('user_name', 'N/A')
        user_info = review.get('user_info', 'N/A')
        review_text = review.get('content', 'N/A')
        review_date = review.get('date', 'N/A')
        f.write(f'{user_name},"{user_info}","{review_text}",{review_date}\n')

print('Done')

# print("Links: ")
# print(google_search)

# time.sleep(2)

# review_links = []

# for async
# for url in google_search:

# for url in google_search:
#     print(url)
#     review_link = google_map_review_link(url)
    # review_link = change_language_in_url(review_link, 'en')
    # review_links.append(review_link)

# print(review_links)

# print(google_search)

# print(
#     google_map_review_link(
#         "https://www.google.com/maps/place/Puerto+Fronterizo+Ciudad+Hidalgo/@14.6779017,-92.1487923,17z/data=!4m16!1m9!3m8!1s0x858e15dae76eaa67:0xd396d9ea52cf0343!2sPuerto+Fronterizo+Ciudad+Hidalgo!8m2!3d14.6779017!4d-92.1487923!9m1!1b1!16s%2Fg%2F11f7n4sq8f!3m5!1s0x858e15dae76eaa67:0xd396d9ea52cf0343!8m2!3d14.6779017!4d-92.1487923!16s%2Fg%2F11f7n4sq8f?authuser=0&hl=en&entry=ttu"
#     )
# )

# google_reviews = google_map_reviews(
#     url='https://www.google.com/maps/place/Control+Needle+North+Customs/@11.213892,-85.6137899,17.85z/data=!4m17!1m8!3m7!1s0x858e0b33fe4be03d:0xcdceec5f02680797!2s30875+Talism%C3%A1n,+Chis.,+Mexico!3b1!8m2!3d14.9633299!4d-92.14722!16s%2Fg%2F11c5m4dmbn!3m7!1s0x8f75a9f850f54cfb:0x43f908dacf7bb17c!8m2!3d11.215153!4d-85.6122499!9m1!1b1!16s%2Fg%2F11fq2tx58v?entry=ttu'
# )

# reviews = []
# for review in google_reviews:
#     openairesponse = send_ai_message(
#         model='gpt-3.5-turbo',
#         response_format={ "type": "json_object" },
#         sys_message='Give short sentiment review',
#         user_messages=[
#             " ".join(review),
#             "Give as json format"
#         ]
#     )

#     reviews.append(openairesponse)
#     send_telegram_message(
#         user_name='shakhrillo',
#         message=openairesponse
#     )

# send_telegram_message(
#     user_name='shakhrillo',
#     message='Done'
# )
