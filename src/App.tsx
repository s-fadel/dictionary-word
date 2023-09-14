import { useState, useEffect } from "react";
import "./index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faVolumeHigh } from "@fortawesome/free-solid-svg-icons";
import { ErrorResponse, WordData } from "./utils/dictionaryTypes";

const App = () => {
  const [word, setWord] = useState("");
  const [dictionaryWord, setDictionaryWord] = useState<WordData[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<ErrorResponse | null>(null);

  const handleSearch = async () => {
    if (word.trim() === "") {
      return; // Undvik att göra en förfrågan om sökordet är tomt
    }
    const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    const response = await fetch(apiUrl);

    try {
      if (response.ok) {
        const data: WordData[] = await response.json();
        setDictionaryWord(data);
        console.log("dictionary", data);
      } else {
        const errorResponse: ErrorResponse = await response.json();
        setErrorMessage(errorResponse);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setErrorMessage({
        message: "Sorry we could not retrieve data at the moment.",
        resolution:
          "You can try the search again at later time or head to the web instead.",
        title: "No Definitions Found",
      });
    }
  };

  const playAudio = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.play();
  };

  return (
    <div className="App">
      <h2>Hello.</h2>
      <div className="App-header">
        <input
          type="text"
          placeholder="Search for word..."
          className="searchbar-dictionary"
          onChange={(e) => setWord(e.target.value)}
          value={word || ""}
        />{" "}
        <button id="search-btn" onClick={handleSearch}>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </div>
      <div className="error-message">
        {errorMessage?.message ? <p>{errorMessage.message}</p> : null}
      </div>

      {dictionaryWord && dictionaryWord.length > 0 ? (
        <div className="dictionary-result" id="result">
          <div className="typed-word">
            <h3>{dictionaryWord[0]?.word}</h3>

            {dictionaryWord[0]?.phonetics.length > 0 ? (
  <div>
   {dictionaryWord[0]?.phonetics
      .filter((phonetic) => phonetic.audio) // Filtrera bort ljudobjekt med tomma audio-strängar
      .map((phonetic, phoneticIndex) => (
      <button
        key={phoneticIndex}
        onClick={() => playAudio(phonetic.audio)}
      >
        <FontAwesomeIcon icon={faVolumeHigh} />
      </button>
    ))}
  </div>
) : null}
          </div>
          <div className="info-typed-word">
            <p>{dictionaryWord[0]?.meanings[0].partOfSpeech}</p>
            <p>{dictionaryWord[0]?.phonetic}</p>
          </div>
          <p className="word-description">
            {dictionaryWord[0]?.meanings[0].definitions[0].definition}
          </p>
          <p className="word-example">
            {dictionaryWord[0]?.meanings[0].definitions[0].example}
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default App;
