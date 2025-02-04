from open_ai.send_message import send_ai_message

# load csv file
with open('google_reviews.csv', 'r') as f:
  data = f.readlines()

print(len(data))
# show 5 reviews
for i in range(15):
  print(data[i])
  message = data[i].strip()
  # skip is length less than 50 characters
  if message == '' or len(message) < 150:
    continue
  openairesponse = send_ai_message(
    model='gpt-3.5-turbo',
    response_format={ "type": "json_object" },
    sys_message='Border crossing overview',
    user_messages=[
      message,
      """ return as json object only include what mentioned in the message otherwise return empty object
        {
          "border_crossing": {
            "operating_hours": "", // Date iso format or not include
            "waiting_time": "", // Number in minutes or not include
            "family_friendly": true | false, // Boolean or not include
            "female_friendly": true | false, // Boolean or not include
            "disabled_friendly": true | false, // Boolean or not include
            "pet_friendly": true | false, // Boolean or not include
            "toilet": true | false, // Boolean or not include
            "atm": true | false, // Boolean or not include
            "currency_exchange": true | false, // Boolean or not include
            "parking": true | false, // Boolean or not include
            "wifi": true | false, // Boolean or not include
            "restaurant": true | false, // Boolean or not include
            "cafe": true | false, // Boolean or not include
            "duty_free": true | false, // Boolean or not include
            "car_rental": true | false, // Boolean or not include
            "taxi": true | false, // Boolean or not include
            "bus": true | false, // Boolean or not include
            "train": true | false, // Boolean or not include
            "airport_transfer": true | false, // Boolean or not include
            "tourist_information": true | false, // Boolean or not include
            "medical_facility": true | false, // Boolean or not include
            "luggage_storage": true | false, // Boolean or not include
            "smoking_area": true | false, // Boolean or not include
            "petrol_station": true | false, // Boolean or not include
            "electric_vehicle_charging": true | false, // Boolean or not include
            "bicycle_parking": true | false, // Boolean or not include
            "motorcycle_parking": true | false, // Boolean or not include
            "car_parking": true | false, // Boolean or not include
            "truck_parking": true | false, // Boolean or not include
            "bus_parking": true | false, // Boolean or not include
          }
        }
      """
      
    ]
  )

  print(openairesponse)
