from transformers import pipeline

# Load a pre-trained model for sentiment analysis
classifier = pipeline("text-classification", model="cardiffnlp/twitter-roberta-base-sentiment-latest")

def detect_social_division(text):
  """
  Detects potential social division in text content using sentiment analysis.

  Args:
    text: The text content to analyze.

  Returns:
    A dictionary containing the sentiment score and a label indicating
    potential social division based on the sentiment.
  """

  result = classifier(text)[0]
  sentiment_score = result["score"]
  sentiment_label = result["label"]

  if sentiment_label == "negative" and sentiment_score > 0.8:
    division_label = "Potential social division detected (negative sentiment)"
  elif sentiment_label == "positive":
    division_label = "No significant social division detected (positive sentiment)"
  else:
    division_label = "Neutral or unclear social division"

  return {"sentiment_score": sentiment_score,
          "sentiment_label": sentiment_label,
          "division_label": division_label}

# Example usage
# text = "They were real nice. I had a evisa and they got me right through. I was walking, once I got the ok there was a long path to get to the other side."
# result = detect_social_division(text)
# print(result)