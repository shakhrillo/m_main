from transformers import pipeline
classifier = pipeline("text-classification", model="SamLowe/roberta-base-go_emotions")

def detect_speech_content(text):
  """Detects the emotional content of speech.

  Args:
    text: The text to analyze.

  Returns:
    A list of labels and scores for the detected emotions.
  """
  max_length = 512  # Roberta's maximum sequence length
  # Truncate the text if it exceeds max_length
  if len(text.split()) > max_length:
      text = ' '.join(text.split()[:max_length])

  result = classifier(text, truncation=True, max_length=max_length)
  return result