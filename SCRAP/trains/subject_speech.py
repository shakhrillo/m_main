from transformers import pipeline

# classifier = pipeline("zero-shot-classification")
classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")


def detect_speech_subject(text):
  sequence_to_classify = "land border crossing Sarpi Turkey to Sarpi Georgia"
  candidate_labels = ["car", "documents", "border", "other"]

  try:
    result = classifier(sequence_to_classify, candidate_labels)
  except Exception as e:
    result = str(e)
  return result
