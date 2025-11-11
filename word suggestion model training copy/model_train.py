import os
import re
import ebooklib
from ebooklib import epub
from bs4 import BeautifulSoup
import nltk
nltk.download('punkt')
from nltk.tokenize import word_tokenize


#using epubs file
def epub_to_text(file_path):
    book = epub.read_epub(file_path)
    text = ""

    for item in book.get_items():
        if item.get_type() == ebooklib.ITEM_DOCUMENT:
            soup = BeautifulSoup(item.get_content(), 'html.parser')
            text += soup.get_text() + "\n"
            
    return text

def preprocess_text(text):
    # Remove special characters and digits
    text = re.sub(r'[^a-zA-Z\s]', '', text)

    # Convert to lowercase
    text = text.lower()

    # Remove extra whitespaces
    text = re.sub(r'\s+', ' ', text)

    # Tokenize words
    words = text.split()

    # Remove words that are less than 3 characters long
    words = [word for word in words if len(word) > 2]

    # Join the filtered words back into a string
    filtered_text = ' '.join(words)

    return filtered_text

epub_files = [
      'Think-And-Grow-Rich.epub',
      'CompTIA-Cybersecurity-Analyst.epub',
      'Education-AND-the-good-ife-by-Bertrand-Russell.epub',
      'Rich-Dad-Poor-Dad.epub',
      'The-five-Second-Rule-Transform-your-Life-Work-AND-Confidence-WITH-Everyday-Courage.epub',
      'The-Kite-Runner.epub',
      'Safety-Health-AND-Environmental-Handbook.epub',
      'Strategic-Management-AND-Business-Policy.epub',
     'The-Complete-Art-of-War.epub',
       'Encyclopedia-of-Physical-Science-(Facts-on-File-Science-Library)-Volume-1-AND-2.epub',
       'The-Oxford-Handbook-of-Contextual-Political-Analysis-(Oxford-Handbooks-of-Political-Science).epub',
       'Trends-in-Computer-Science-Engineering-and-Information-Technology-First-International-Conference-on-Computer-Science-Engineering and-Information-Technology-CCSEIT-2011-Tirunelveli-Tamil-Nadu-India-September-23-25-2011-Proceedings.epub',
       'Oxford-English-Dictionary.epub',
       'The-Animal-Book.epub'
]
corpus = ''

for epub_file in epub_files:
    text = epub_to_text(epub_file)
    preprocessed_text = preprocess_text(text)
    corpus += preprocessed_text + "\n"

with open('corpus.txt', 'w', encoding='utf-8') as f:
    f.write(corpus)


#proprocessing
from collections import Counter

def word_frequency(corpus):
    words = corpus.split()
    word_counts = Counter(words)
    return word_counts.most_common()

with open('corpus.txt', 'r', encoding='utf-8') as f:
    corpus = f.read()

word_counts = word_frequency(corpus)

# Save the word frequencies to a CSV file
import csv

with open('word_frequencies.csv', 'w', encoding='utf-8', newline='') as csvfile:
    csv_writer = csv.writer(csvfile)
    csv_writer.writerow(['word', 'count'])
    
    for word, count in word_counts:
        csv_writer.writerow([word, count])

print(word_counts[:10])  # Print the 10 most common words


#starting the model training code now and importing the csv

import numpy as np
import pandas as pd
from tqdm import tqdm

# Load the dataset into a pandas dataframe
data = pd.read_csv("word_frequencies.csv")
# Remove rows with NaN values
data.dropna(subset=['word'], inplace=True)

# Preprocess the data by creating a bag of words
words = list(set(''.join(data['word'])))
word_to_index = {word: i for i, word in enumerate(words)}
index_to_word = {i: word for word, i in word_to_index.items()}

# Convert the word strings to vectors
def word_to_vector(word):
    vec = np.zeros(len(words), dtype=np.int32)
    for char in word:
        vec[word_to_index[char]] += 1
    return vec

X = np.array([word_to_vector(word) for word in data['word']])
y = np.array(data['word'])
counts = np.array(data['count'])

class NaiveBayes:
    def __init__(self, classes):
        self.classes = classes
        self.class_probs = None
        self.cond_probs = None
    
    def fit(self, X, y, counts):
        n, d = X.shape
        self.class_probs = np.zeros(len(self.classes))
        self.cond_probs = np.zeros((len(self.classes), d))

        for i, c in enumerate(tqdm(self.classes, desc="Processing classes")):
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

    def predict_starting_with(self, X, prefix, n=10):
        probs = np.zeros((len(X), len(self.classes)))
        for i, x in enumerate(X):
            for j, c in enumerate(self.classes):
                if c.startswith(prefix):
                    probs[i, j] = np.log(self.class_probs[j]) + (np.log(self.cond_probs[j]) * x).sum()
                else:
                    probs[i, j] = -np.inf
        return probs
    def predict_top_n_words(self, X, prefix, n=4):
        probs = self.predict_starting_with(X, prefix)
        top_n_indices = np.argsort(-probs, axis=1)[:, :n]
        top_n_words = self.classes[top_n_indices][0]
        top_n_probs = np.exp(probs[0][top_n_indices[0]])
        top_n_probs = top_n_probs / top_n_probs.sum()
        return list(zip(top_n_words, top_n_probs))

clf = NaiveBayes(classes=np.unique(y))
clf.fit(X, y, counts)

def predict_word(input_str, n=4):
    input_str = input_str.lower()
    input_vec = np.array([word_to_vector(input_str)])
    preds = clf.predict_top_n_words(input_vec, input_str, n)
    return preds if preds else None

print(predict_word("cat"))



# Save the trained model to a file
import pickle
with open("naive_bayes_model.pkl", "wb") as f:
    pickle.dump(clf, f)

import numpy as np
import pandas as pd
import pickle

# Assuming you have the 'data' DataFrame with the 'word' column
words = list(set(''.join(data['word'])))
word_to_index = {word: i for i, word in enumerate(words)}

# Save the word_to_index dictionary as a pickle file
with open("word_to_index.pkl", "wb") as word_to_index_file:
    pickle.dump(word_to_index, word_to_index_file)

