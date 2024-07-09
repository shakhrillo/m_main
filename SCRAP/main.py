from selenium_scrap.google_map_reviews import google_map_reviews
from telegram.send_message import send_telegram_message
from open_ai.send_message import send_ai_message
import mysql.connector

conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="12345678",
    database="borders"
)

cursor = conn.cursor()

google_reviews = google_map_reviews(
    url='https://www.google.com/maps/place/Control+Needle+North+Customs/@11.213892,-85.6137899,17.85z/data=!4m17!1m8!3m7!1s0x858e0b33fe4be03d:0xcdceec5f02680797!2s30875+Talism%C3%A1n,+Chis.,+Mexico!3b1!8m2!3d14.9633299!4d-92.14722!16s%2Fg%2F11c5m4dmbn!3m7!1s0x8f75a9f850f54cfb:0x43f908dacf7bb17c!8m2!3d11.215153!4d-85.6122499!9m1!1b1!16s%2Fg%2F11fq2tx58v?entry=ttu'
)

reviews = []
for review in google_reviews:
    openairesponse = send_ai_message(
        model='gpt-3.5-turbo',
        response_format={ "type": "json_object" },
        sys_message='Give short sentiment review',
        user_messages=[
            " ".join(review),
            "Give as json format"
            # "Give a short review if it is an actual review of experience. Otherwise skip it. The result should be as json format. {'location', 'issues', 'suggestions', 'observations', 'recommendations', 'concerns', 'feedback', 'rating'}"
        ]
    )

    reviews.append(openairesponse)
    send_telegram_message(
        user_name='shakhrillo',
        message=openairesponse
    )


# Add the response to the database
# cursor.execute(f"INSERT INTO borders (border_name, border_location, border_country, wait_time, required_documents, roads_conditions, restaurants, restrooms, children_playground, money_exchange, atm, nearest_hotel, attentions, bribes, security) VALUES {openairesponse}")

send_telegram_message(
    user_name='shakhrillo',
    message='Done'
)
