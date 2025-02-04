from googletrans import Translator

# Initialize the Translator
translator = Translator()

# Text to be translated
text = "Assalom alekum Inshoolloh Sankt Peterburg Moskvadan Uzb Toshkent Vodiyga  8 - 9 kuni yuramiz 2 ta odam pochta olamiz shafyor o'zim 89870748718"

# Translate text to Spanish
translated_text = translator.translate(text, src='uz', dest='en')

# Print original and translated texts
print(f'Original Text: {text}')
print(f'Translated Text: {translated_text.text}')
