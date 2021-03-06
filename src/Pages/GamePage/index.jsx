import "./style.scss";
import React, { useState, useEffect, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import Cookie from "js-cookie";
import QuestionCard from "./QuestionCard";
import Pyramid from "./assets/pyramid.png";
import Perso1 from "./assets/perso1.png";
import Perso2 from "./assets/perso2.png";
import Countdown from "./Countdown/index";
import ModalDiv from "./Modal/index";
import { motion } from "framer-motion";
import { Prompt } from "react-router-dom";
import { AudioPlayerProvider } from "react-use-audio-player";
import PyramidRaceAudio from "./assets/PyramidRaceMusicOGG.ogg";
import AudioPlayer from "../../Components/AudioPlayer/index.jsx";

const Game = () => {
  let { id } = useParams();
  const userId = useSelector((state) => state.id);
  const tokenCookie = Cookie.get("token");
  const [game, setGame] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState({});
  const [gameOn, setGameOn] = useState(false);
  const [newQuestionTime, setNewQuestionTime] = useState(new Date(Date.now()));
  const [currentStep, setCurrentStep] = useState(0);
  const [opponentStep, setOpponentStep] = useState(0);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [gameHistories, setGameHistories] = useState([]);
  const [perso1animation, setPerso1Animation] = useState({ x: 0, y: 0 });
  const [perso2animation, setPerso2Animation] = useState({ x: 0, y: 0 });
  const [firstGameHistory, setFirstGameHistory] = useState({});
  const history = useHistory();
  const pyramidRef = useRef();
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(0);
  const [timePlayer1, setTimePlayer1] = useState(0);
  const [timePlayer2, setTimePlayer2] = useState(0);

  // Status possible: pending, gameFetched, questionsFetched, gameReady, gameOver

  const status = useRef("pending");

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    history.push("/gameinfos");
  };

  useEffect(() => {
    if (status.current === "questionsFetched") {
      setCurrentQuestion(questions[currentQuestionIndex]);
      setTimePlayer1(Date.now());
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setGameOn(true);
      status.current = "gameReady";
    }
  }, [questions]);

  useEffect(() => {
    fetchGame();
  }, []);

  useEffect(() => {
    if (game && status.current === "gameFetched") {
      if (userId === game.player2_id) {
        fetchHistoryPlayer1();
      }
      fetchQuestions();
    }
    return () => {
      if (game && status.current === "gameReady") {
        userId === game.player1_id ? destroyGame() : forfeitGame();
      }
    };
  }, [game]);

  const fetchGame = () => {
    fetch(`https://pyramid-race-api.herokuapp.com/games/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setGame(data);
        status.current = "gameFetched";
      })
      .catch((error) => console.log(error));
  };

  const fetchQuestions = () => {
    fetch(
      `https://opentdb.com/api.php?amount=12&category=${game.category}&difficulty=${game.difficulty}&type=multiple`
    )
      .then((response) => response.json())
      .then((data) => {
        setQuestions(data.results);
        status.current = "questionsFetched";
      })
      .catch((error) => console.log(error));
  };

  const fetchHistoryPlayer1 = () => {
    fetch(`https://pyramid-race-api.herokuapp.com/games/${id}/game_histories`)
      .then((response) => response.json())
      .then((data) => {
        setGameHistories(data);
        setFirstGameHistory(data[0]);
      })
      .catch((error) => console.log(error));
  };

  const gameEnd = (firstWinnerId) => {
    let winner_id;
    if (firstWinnerId) {
      winner_id = firstWinnerId;
    } else if (currentStep > opponentStep) {
      winner_id = game.player2_id;
    } else if (currentStep < opponentStep) {
      winner_id = game.player1_id;
    } else if (opponentStep === currentStep) {
      if (timePlayer1 >= timePlayer2) {
        winner_id = game.player2_id;
      } else if (timePlayer1 < timePlayer2) {
        winner_id = game.player1_id;
      }
    }

    const data = {
      game: {
        winner_id: winner_id,
        turn: "gameEnded",
      },
    };
    fetch(`https://pyramid-race-api.herokuapp.com/games/${id}`, {
      method: "put",
      headers: {
        Authorization: `${tokenCookie}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(() => {
        if (userId === winner_id) {
          history.push(`/games/${id}/victory`);
        } else if (userId !== winner_id) {
          history.push(`/games/${id}/defeat`);
        }
        status.current = "gameOver";
      })
      .catch((error) => console.log(error));
  };

  const nextTurn = () => {
    const data = {
      game: {
        turn: "player2",
      },
    };
    fetch(`https://pyramid-race-api.herokuapp.com/games/${id}`, {
      method: "put",
      headers: {
        Authorization: `${tokenCookie}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(() => {
        status.current = "gameOver";
      })
      .catch((error) => console.log(error));
  };

  const nextQuestion = (answer_choice, correct_answer) => {
    const data = {
      game_history: {
        user_id: userId,
        game_id: id,
        response_correct:
          !!answer_choice &&
          !!correct_answer &&
          answer_choice === correct_answer,
        question_time: newQuestionTime,
        response_time: new Date(Date.now()),
      },
    };
    fetch(`https://pyramid-race-api.herokuapp.com/game_histories`, {
      method: "post",
      headers: {
        Authorization: `${tokenCookie}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).catch((error) => console.log(error));

    if (answer_choice && answer_choice === correct_answer && currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else if (
      answer_choice &&
      answer_choice === correct_answer &&
      currentStep === 5
    ) {
      setCurrentStep(currentStep + 1);
      setGameOn(false);
      setCurrentQuestion({});
      if (userId === game.player1_id) {
        nextTurn();
        openModal();
      } else if (userId === game.player2_id) {
        gameEnd(game.player2_id);
      }
    } else if (
      (!answer_choice && currentStep > 0) ||
      (answer_choice !== correct_answer && currentStep > 0)
    ) {
      setCurrentStep(currentStep - 1);
    }

    if (currentQuestionIndex < 12) {
      setCurrentQuestion(questions[currentQuestionIndex]);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setNewQuestionTime(new Date(Date.now()));
    } else {
      setGameOn(false);
      setCurrentQuestion({});
      setCurrentQuestionIndex("");
      if (userId === game.player1_id) {
        nextTurn();
        openModal();
      } else if (userId === game.player2_id) {
        let totalTime = Date.now() - timePlayer1;
        setTimePlayer1(totalTime);
        gameEnd();
      }
    }
  };

  useEffect(() => {
    if (count3 === 3) {
      gameEnd();
    }
    setCount3(count3 + 1);
  }, [timePlayer1]);

  const destroyGame = () => {
    if (status.current === "gameOver") {
      return;
    }

    fetch(`https://pyramid-race-api.herokuapp.com/games/${id}`, {
      method: "delete",
      headers: {
        Authorization: `${tokenCookie}`,
        "Content-Type": "application/json",
      },
    }).catch((error) => console.log(error));
  };

  const forfeitGame = () => {
    if (status.current === "gameOver") {
      return;
    }

    const data = {
      game: {
        winner_id: game.player1_id,
        turn: "gameEnded",
      },
    };
    fetch(`https://pyramid-race-api.herokuapp.com/games/${id}`, {
      method: "put",
      headers: {
        Authorization: `${tokenCookie}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).catch((error) => console.log(error));
  };

  const movePlayer1 = (step) => {
    if (!pyramidRef.current) {
      return;
    }
    const pyramidHeight = pyramidRef.current.getBoundingClientRect().height;
    const pyramidWidth = pyramidRef.current.getBoundingClientRect().width;
    const marchHeight = pyramidHeight / 6.57;
    const groundHeight = pyramidHeight / 100;
    const marchWidth = pyramidWidth / 2 / 7;

    if (step >= 0) {
      if (step < 6) {
        setPerso1Animation({
          x: step * marchWidth,
          y: -step * marchHeight - groundHeight,
        });
      } else if (step === 6) {
        setPerso1Animation({
          x: step * marchWidth + marchWidth / 1.3,
          y: -5 * marchHeight - groundHeight,
        });
      }
    } else if (step < 0) {
      if (step > -6) {
        setPerso2Animation({
          x: step * marchWidth,
          y: step * marchHeight - groundHeight,
        });
      } else if (step === -6) {
        setPerso2Animation({
          x: step * marchWidth - marchWidth / 1.3,
          y: -5 * marchHeight - groundHeight,
        });
        setGameOn(false);
        gameEnd(game.player1_id);
      }
    }
  };

  const movePlayer2 = () => {
    if (!pyramidRef.current) {
      return;
    }
    const pyramidHeight = pyramidRef.current.getBoundingClientRect().height;
    const groundHeight = pyramidHeight / 100;

    let step = 0;
    const startOpponentGame = Date.parse(gameHistories[0].question_time);
    const endOpponentGame = Date.parse(
      gameHistories[gameHistories.length - 1].response_time
    );
    const totalTimeOpponent = endOpponentGame - startOpponentGame;
    setTimePlayer2(totalTimeOpponent);
    gameHistories.forEach((game_history) => {
      setTimeout(function () {
        if (game_history.response_correct) {
          step += 1;
          setOpponentStep(opponentStep + 1);
        } else if (step > 0 && !game_history.response_correct) {
          step -= 1;
        }
        if (step > 0) {
          movePlayer1(-step);
          setOpponentStep(step);
        } else if (step === 0) {
          setPerso2Animation({
            x: 0,
            y: -groundHeight,
          });
          setOpponentStep(step);
        }
      }, Date.parse(game_history.response_time) - startOpponentGame);
    });
  };

  useEffect(() => {
    movePlayer1(currentStep);
  }, [currentStep]);

  useEffect(() => {
    setCount2(count2 + 1);
    if (count2 === 1 && game.turn === "player2") {
      movePlayer2();
    }
  }, [firstGameHistory]);

  useEffect(() => {
    window.addEventListener("resize", movePlayer1);
    return () => {
      window.removeEventListener("resize", movePlayer1);
    };
  }, []);

  return (
    <div className="game_page">
      {game && userId === game.player1_id && gameOn && (
        <Prompt
          message={() => "Si vous quittez cette page la partie sera perdue !"}
        />
      )}
      {game && userId === game.player2_id && gameOn && (
        <Prompt
          message={() =>
            "Si vous quittez cette page, vous serez automatiquement déclaré forfait !"
          }
        />
      )}
      <AudioPlayerProvider>
        <AudioPlayer file={PyramidRaceAudio} />
      </AudioPlayerProvider>
      <ModalDiv
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        step={currentStep}
        controlsList="play"
      />
      {((status.current === "gameReady" &&
        game &&
        gameOn &&
        userId === game.player2_id &&
        game.turn === "player2") ||
        (status.current === "gameReady" &&
          game &&
          gameOn &&
          userId === game.player1_id &&
          game.turn === "player1")) && (
        <>
          <Countdown onExpire={nextQuestion} resetTick={currentQuestionIndex} />
          <QuestionCard
            question={currentQuestion.question}
            correct_answer={currentQuestion.correct_answer}
            incorrect_answers={currentQuestion.incorrect_answers}
            nextQuestion={nextQuestion}
          />
        </>
      )}
      <div className="game_content">
        <img className="pyramid" src={Pyramid} ref={pyramidRef} />
        <motion.div
          className="perso1"
          animate={perso1animation}
          transition={{ type: "Tween", stiffness: 100 }}
        >
          <img className="perso" src={Perso1} />
        </motion.div>
        <motion.div
          className="perso2"
          animate={perso2animation}
          transition={{ type: "Tween", stiffness: 100 }}
        >
          <img className="perso" src={Perso2} />
        </motion.div>
      </div>
    </div>
  );
};

export default Game;
