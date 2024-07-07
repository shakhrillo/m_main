import requests
from bs4 import BeautifulSoup


# Coordinates of the place
# 41°28'05.3"N 69°21'18.4"E
latitude = 41.4681286
longitude = 69.3550982

# Google Maps API URL
url = f"https://www.google.com/maps/place/Gisht+Kuprik/@41.4698412,69.3575125,19z/data=!4m18!1m9!3m8!1s0x38aeedb5e25db569:0xc701527ce0ede059!2sGisht+Kuprik!8m2!3d41.4702088!4d69.3581526!9m1!1b1!16s%2Fg%2F1tk_mncy!3m7!1s0x38aeedb5e25db569:0xc701527ce0ede059!8m2!3d41.4702088!4d69.3581526!9m1!1b1!16s%2Fg%2F1tk_mncy?entry=ttu"
print(url)
# https://www.google.com/maps/search/?api=1&query=41.466806,69.3544381
# 41.466806,69.3544381,15.78z
# Request the page
response = requests.get(url)

# Parse the HTML
soup = BeautifulSoup(response.text, 'html.parser')

# save html file
with open("google_map.html", "w") as file:
    file.write(response.text)

# Extract the review information (this may vary depending on the specific HTML structure)
# try:
#     reviews = soup.find_all('div', class_='review-text')
#     overall_rating = soup.find('span', class_='section-rating-text').text
    
#     # Print the review information
#     print(f"Overall Rating: {overall_rating}")
#     for review in reviews:
#         print(f"Review: {review.text.strip()}")
# except AttributeError:
#     print("Could not find review information on the page.")