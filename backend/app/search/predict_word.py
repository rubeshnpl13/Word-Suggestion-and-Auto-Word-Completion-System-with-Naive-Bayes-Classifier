import sys
import pickle
import os
import numpy as np
import json


class NaiveBayes:
    def __init__(self, classes):
        self.classes = classes
        self.class_probs = None
        self.cond_probs = None

    def fit(self, X, y, counts):
        n, d = X.shape
        self.class_probs = np.zeros(len(self.classes))
        self.cond_probs = np.zeros((len(self.classes), d))

        for i, c in enumerate(self.classes):
            X_c = X[y == c]
            n_c = counts[y == c].sum()
            self.class_probs[i] = n_c / counts.sum()
            self.cond_probs[i] = (X_c.sum(axis=0) + 1) / (X_c.sum() + d)

    def predict(self, X):
        probs = np.zeros((len(X), len(self.classes)))

        for i, x in enumerate(X):
            for j, c in enumerate(self.classes):
                probs[i, j] = np.log(self.class_probs[j]) + (np.log(self.cond_probs[j]) * x).sum()

        return self.classes[np.argmax(probs, axis=1)]

    def predict_top_n_words(self, X, prefix, n=10):
        probs = np.zeros((len(X), len(self.classes)))
        found_prefix = False
        
        for i, x in enumerate(X):
            for j, c in enumerate(self.classes):
                if c.startswith(prefix):
                    found_prefix = True
                    probs[i, j] = np.log(self.class_probs[j]) + (np.log(self.cond_probs[j]) * x).sum()
                else:
                    probs[i, j] = -np.inf

        if not found_prefix:
            return []

        top_n_indices = np.argsort(-probs, axis=1)[:, :n]
        top_n_words = self.classes[top_n_indices][0]
        top_n_probs = np.exp(probs[0][top_n_indices[0]])
        top_n_probs = top_n_probs / top_n_probs.sum()
        filtered_top_n = list(zip(top_n_words, top_n_probs))
        filtered_top_n = [t for t in filtered_top_n if not np.isnan(t[1])]
        return filtered_top_n if top_n_probs.sum() != 0 else []

def word_to_vector(word, word_to_index):
    vec = np.zeros(len(word_to_index), dtype=np.int32)
    for char in word:
        if char in word_to_index:
            vec[word_to_index[char]] += 1
    return vec

def preprocess_input(input_str, word_to_index):
    return np.array([word_to_vector(input_str, word_to_index)])

# def predict(input_str, model, word_to_index, fetched_words, n=4):
    preprocessed_input = preprocess_input(input_str, word_to_index)
    prediction = model.predict_top_n_words(preprocessed_input, input_str, n)
    
    # Filter fetched_words to keep only the ones that start with input_str
    fetched_filtered = {k: v for k, v in fetched_words.items() if k.startswith(input_str)}

    if prediction or fetched_filtered:
        # Update the probabilities of the predicted words based on their counts in fetched_words
        updated_prediction = []
        for word, prob in prediction:
            count = fetched_words.get(word, 0)
            updated_prob = prob * (1 + count)
            updated_prediction.append((word, updated_prob))

        # Add fetched_filtered words to the updated_prediction list
        for word, count in fetched_filtered.items():
            updated_prediction.append((word, count))

        # Sort updated_prediction list in descending order of probability
        updated_prediction.sort(key=lambda x: x[1], reverse=True)

        # Keep only the top n words in updated_prediction
        updated_prediction = updated_prediction[:n]

        # Normalize the probabilities
        total_prob = sum(p for _, p in updated_prediction)
        normalized_prediction = [(word, p / total_prob) for word, p in updated_prediction]
        return normalized_prediction
    else:
        return []
def predict(input_str, model, word_to_index, fetched_words, n=4):
    preprocessed_input = preprocess_input(input_str, word_to_index)
    prediction = model.predict_top_n_words(preprocessed_input, input_str, n)
    
    # Filter fetched_words to keep only the ones that start with input_str
    fetched_filtered = {k: v for k, v in fetched_words.items() if k.startswith(input_str)}

    if prediction or fetched_filtered:
        # Initialize a dictionary to store the probabilities of each word
        probs_dict = {}
        for word, prob in prediction:
            probs_dict[word] = prob

        # Update the probabilities of the predicted words based on their counts in fetched_words
        for word, count in fetched_filtered.items():
            if word in probs_dict:
                probs_dict[word] *= (1 + count)
            else:
                probs_dict[word] = count

        # Normalize the probabilities
        total_prob = sum(probs_dict.values())
        normalized_prediction = [(word, p / total_prob) for word, p in probs_dict.items()]

        # Sort the normalized probabilities in descending order and return the result
        sorted_prediction = sorted(normalized_prediction, key=lambda x: x[1], reverse=True)[:n]
        return sorted_prediction
    else:
        return None

if __name__ == "__main__":
    input_str = sys.argv[1]

    # Load the model
    model_file_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "naive_bayes_model.pkl")
    with open(model_file_path, "rb") as model_file:
        model = pickle.load(model_file)

    # Load the word_to_index dictionary
    word_to_index_file_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "word_to_index.pkl")
    with open(word_to_index_file_path, "rb") as word_to_index_file:
        word_to_index = pickle.load(word_to_index_file)


   # Parse the fetched_words from the command-line arguments
    fetched_words_json = sys.argv[2]
    fetched_words = json.loads(fetched_words_json)
    fetched_words_dict = {w['word']: w['count'] for w in fetched_words}
    # Make prediction and return output
    prediction = predict(input_str, model, word_to_index, fetched_words_dict)
    if prediction:
        print(json.dumps(prediction))
    else:
        print(json.dumps({"prediction": []}))
