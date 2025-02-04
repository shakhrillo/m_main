from trains.overview_emotion_speech import evaluate_sentiment
from trains.hate_speech import detect_speech_content

# Initialize variables to store the cumulative scores and counts for each emotion
total_scores = {}
count_scores = {}

with open('google_reviews.csv', 'r') as f:
    data = f.readlines()

# Process each line in the dataset
for i in range(len(data)):
    hate_result = detect_speech_content(data[i])  # Get the emotion scores for each line

    for result in hate_result:
        label = result['label']
        score = result['score']

        # Accumulate the total score for each label
        if label in total_scores:
            total_scores[label] += score
            count_scores[label] += 1
        else:
            total_scores[label] = score
            count_scores[label] = 1

# Calculate the average scores for each label
average_scores = {label: total_scores[label] / count_scores[label] for label in total_scores}

# Print the average scores
print("Average scores:", average_scores)

# Get the last 5 emotions with the highest scores
last_5_highest = sorted(average_scores.items(), key=lambda item: item[1], reverse=True)[:5]

# Convert to dictionary for better readability
last_5_highest_dict = dict(last_5_highest)

print("Last 5 most detected emotions with scores:")
print(last_5_highest_dict)

sentiment_result = evaluate_sentiment(average_scores)
print("Overall sentiment is:", sentiment_result)