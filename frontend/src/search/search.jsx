import "./search.css";
import UserContext from "store/context/UserContext";
import { Navigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import axios from "axios";

function Search() {
  const { user } = useContext(UserContext);
  const [inputStr, setInputStr] = useState("");
  const [lastWord, setLastWord] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [savedWords, setSavedWords] = useState([]);

  const [predictedWord, setPredictedWord] = useState("");
  const [placeholderText, setPlaceholderText] = useState(
    "Type your search query here"
  );

  useEffect(() => {
    if (lastWord.length > 0) {
      fetch("http://localhost:3000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: lastWord, fetchedWords: savedWords }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (Object.keys(data.prediction).length === 0) {
            setPredictedWord(lastWord);
            setPlaceholderText(lastWord);
            setPredictions([
              {
                word: lastWord,
                percentage: "User input", // Display "User input" instead of a percentage
              },
            ]);
          } else if (Array.isArray(data.prediction)) {
            console.log(data.prediction);
            setPredictedWord(data.prediction[0][0]);
            setPlaceholderText(data.prediction[0][0]);

            // Format the predictions and set the state
            const formattedPredictions = data.prediction.map((prediction) => ({
              word: prediction[0],
              percentage: parseFloat(prediction[1] * 100).toFixed(1),
            }));
            // Sort the predictions by percentage in descending order
            const sortedPredictions = formattedPredictions.sort(
              (a, b) => b.percentage - a.percentage
            );
            setPredictions(sortedPredictions);
            //setPredictions(formattedPredictions);
          } else {
            setPredictedWord(lastWord);
            setPlaceholderText("Prediction not available");
            setPredictions([]);
          }
        });
    } else {
      setPredictedWord("");
      setPlaceholderText("Type your search query here");
      setPredictions([]);
    }
  }, [lastWord, savedWords]);

  const handleInputChange = (e) => {
    const inputValue = e.target.value.toLowerCase();
    setInputStr(inputValue);
    const words = inputValue.split(" ");
    setLastWord(words[words.length - 1]);
    if (predictions.length === 0) {
      setPredictedWord(words[words.length - 1]);
    }
    console.log("Current input:", inputValue);
  };

  const saveWordEmail = async (word, email) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/word-suggestion/v1/save-word-email",
        { word, email, increment: true } // add the increment flag
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error saving word and email:", error);
    }
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Tab") {
      e.preventDefault(); // Prevent default tab behavior (losing focus)
      if (predictedWord !== "no prediction available") {
        const lastWord = inputStr.split(" ").slice(-1)[0];
        const newInputStr =
          inputStr.slice(0, inputStr.length - lastWord.length) +
          predictedWord +
          " ";
        setInputStr(newInputStr);
        // Save the selected word and user's email
        if (user?.email) {
          await saveWordEmail(predictedWord, user.email);
          fetchSavedWords(user.email);
        }
      }
    } else if (e.key === " ") {
      const lastWord = inputStr.split(" ").slice(-1)[0];

      // Check if the word is not in the predictions
      const wordInPredictions = predictions.some(
        (prediction) => prediction.word === lastWord
      );

      if (!wordInPredictions && user?.email) {
        // Save the word with count and email in the database
        await saveWordEmail(lastWord, user.email);
        fetchSavedWords(user.email);
      }
    }
  };

  const handlePredictionClick = async (word) => {
    const words = inputStr.split(" ");
    words[words.length - 1] = word;
    const newInputStr = words.join(" ") + " ";
    setInputStr(newInputStr);

    // Save the selected word and user's email
    if (user?.email) {
      await saveWordEmail(word, user.email);
      fetchSavedWords(user.email);
    }
  };

  const fetchSavedWords = async (email) => {
    try {
      console.log("Fetching saved words for email:", email);
      const response = await axios.get(
        `http://localhost:3000/word-suggestion/v1/saved-words/${email}`
      );
      const sortedWords = response.data
        .sort((a, b) => b.count - a.count)
        .slice(0, 10); // Sort the words by count in descending order and only take the top 10
      setSavedWords(sortedWords);
    } catch (error) {
      console.error("Error fetching saved words:", error);
    }
  };

  useEffect(() => {
    console.log("User email changed:", user?.email);
    if (user?.email) {
      fetchSavedWords(user.email);
    }
  }, [user?.email]);

  if (user?.role === "user") {
    return (
      <div className="container">
        <div className="word-search">
          <h1>Search</h1>
          <form>
            <input
              id="field1"
              type="text"
              placeholder={placeholderText}
              value={inputStr}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
          </form>
          <p>Prediction:</p>
          {predictions.map((prediction, index) => (
            <div
              key={index}
              onClick={() => handlePredictionClick(prediction.word)}
              style={{ cursor: "pointer" }}
            >
              {prediction.word} {prediction.percentage}%
            </div>
          ))}
          {predictedWord && !predictions.length && <div>{predictedWord}</div>}
        </div>

        <div className="saved-words-table">
          <h2>Previously Used Words</h2>
          <table>
            <thead>
              <tr>
                <th>Word</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {savedWords.map((item, index) => (
                <tr key={index}>
                  <td>{item.word}</td>
                  <td>{item.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  } else {
    return <Navigate to="/login" />;
  }
}
export default Search;
