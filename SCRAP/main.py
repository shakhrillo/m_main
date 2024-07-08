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
    url='https://www.google.com/maps/place/Frontera+Mexico%2FGuatemala/@14.9663853,-92.1471757,16.76z/data=!4m17!1m8!3m7!1s0x858e0b33fe4be03d:0xcdceec5f02680797!2s30875+Talism%C3%A1n,+Chis.,+Mexico!3b1!8m2!3d14.9633299!4d-92.14722!16s%2Fg%2F11c5m4dmbn!3m7!1s0x858e0bd22ad2597d:0x196210b7563412c4!8m2!3d14.9653625!4d-92.1466094!9m1!1b1!16s%2Fg%2F11kqr2vbys?entry=ttu'
)

response_format = """
    id SERIAL PRIMARY KEY,
    border_name VARCHAR(255),
    border_location VARCHAR(255),
    border_country VARCHAR(255),
    wait_time VARCHAR(255),
    required_documents VARCHAR(255),
    roads_conditions VARCHAR(255),
    restaurants VARCHAR(255),
    restrooms VARCHAR(255),
    children_playground VARCHAR(255),
    money_exchange VARCHAR(255),
    atm VARCHAR(255),
    nearest_hotel VARCHAR(255),
    attentions VARCHAR(255),
    bribes VARCHAR(255),
    security VARCHAR(255)
"""

openairesponse = send_ai_message(
    model='gpt-3.5-turbo',
    response_format={ "type": "json_object" },
    sys_message='Extract the sentiment from the review:',
    user_messages=[
        " ".join(google_reviews),
        "Give the result as json format and include these values" + response_format + " in order to store the response in the database."
    ]
)

# Add the response to the database
# cursor.execute(f"INSERT INTO borders (border_name, border_location, border_country, wait_time, required_documents, roads_conditions, restaurants, restrooms, children_playground, money_exchange, atm, nearest_hotel, attentions, bribes, security) VALUES {openairesponse}")

send_telegram_message(
    user_name='shakhrillo',
    message=openairesponse
)
