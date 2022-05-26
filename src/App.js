//Style
import "./App.css";

//React
import { useCallback, useEffect, useState } from "react";

//Data
import { wordsList } from "./data/words";

//COMPONENTS
import { StartSrceen } from "./COMPONENTS/StartScreen/StartSrceen";
import { Game } from "./COMPONENTS/Game/Game";
import { GameOver } from "./COMPONENTS/GameOver/GameOver";

const stages = [
  { id: 0, name: "start" },
  { id: 1, name: "game" },
  { id: 2, name: "end" },
];

const guessesQTY = 3;

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQTY);
  const [score, setScore] = useState(0);

  const pickWordAndCategory = useCallback(() => {
    //Pick random category
    const categories = Object.keys(words);
    const category =
      categories[Math.floor(Math.random() * Object.keys(categories).length)];

    //Pick a random word
    const word =
      words[category][[Math.floor(Math.random() * words[category].length)]];

    return { word, category };
  }, [words]);

  //Starts the game
  const startGame = useCallback(() => {
    //Clear all letters
    clearLetterStates();

    //pick word & category
    const { word, category } = pickWordAndCategory();

    //Create array of letters
    let wordLetters = word.split("");

    wordLetters = wordLetters.map((l) => l.toLowerCase());

    //fill states
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);

  //process the letter input
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();

    //Check if letter is already used
    if (
      guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
    ) {
      return;
    }

    //Push guessed letter or removes chance
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter,
      ]);
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ]);

      setGuesses((actualguesses) => actualguesses - 1);
    }
  };

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  };
  //Check if guesses ended
  useEffect(() => {
    if (guesses <= 0) {
      //Reset Game states
      clearLetterStates();
      setGameStage(stages[2].name);
    }
  }, [guesses]);

  //Check wind condition
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)];

    //Win condition
    if (guessedLetters.length === uniqueLetters.length) {
      //Add score
      setScore((actualScore) => (actualScore += 100));

      //Restart game
      startGame();
    }
  }, [guessedLetters, letters, startGame]);

  //Restarts the game
  const retry = () => {
    setScore(0);
    setGuesses(guessesQTY);

    setGameStage(stages[0].name);
  };

  return (
    <>
      <div className="container">
        {gameStage === "start" && <StartSrceen startGame={startGame} />}
        {gameStage === "game" && (
          <Game
            verifyLetter={verifyLetter}
            pickedWord={pickedWord}
            pickedCategory={pickedCategory}
            letters={letters}
            guessedLetters={guessedLetters}
            wrongLetters={wrongLetters}
            guesses={guesses}
            score={score}
          />
        )}
        {gameStage === "end" && <GameOver retry={retry} score={score} />}
      </div>
    </>
  );
}

export default App;
