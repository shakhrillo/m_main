def evaluate_sentiment(scores):
    # Define thresholds for classification
    positive_threshold = 0.6  # Threshold for positive emotions
    negative_threshold = 0.6  # Threshold for negative emotions
    ok_threshold = 0.6  # Threshold for ok emotions

    # Define positive and negative emotions
    positive_emotions = ['amusement', 'admiration', 'joy', 'caring', 'gratitude', 'desire', 'optimism', 'pride', 'satisfaction']
    negative_emotions = ['annoyance', 'disapproval', 'fear', 'disappointment', 'disgust', 'remorse', 'sadness', 'anger', 'confusion', 'embarrassment']
    ok_emotions = ['neutral', 'surprise', 'excitement', 'relief', 'love', 'pride', 'contentment', 'awe', 'shame', 'guilt']

    # Calculate total positive and negative scores
    positive_score = sum(scores[emotion] for emotion in positive_emotions if emotion in scores)
    negative_score = sum(scores[emotion] for emotion in negative_emotions if emotion in scores)
    ok_score = sum(scores[emotion] for emotion in ok_emotions if emotion in scores)

    # Calculate average scores
    total_positive_emotions = len(positive_emotions)
    total_negative_emotions = len(negative_emotions)
    total_ok_emotions = len(ok_emotions)

    average_positive_score = positive_score / total_positive_emotions
    average_negative_score = negative_score / total_negative_emotions
    average_ok_score = ok_score / total_ok_emotions

    # Determine overall sentiment
    if average_positive_score >= positive_threshold and average_negative_score < negative_threshold:
        return "good"
    elif average_negative_score >= negative_threshold and average_positive_score < positive_threshold:
        return "bad"
    elif average_ok_score >= ok_threshold:
        return "ok"
    else:
        return "neutral"
