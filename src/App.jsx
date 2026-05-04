import React, {useState} from "react";
import Quiz from "./Components/Quiz"
import Selection from "./Components/Selection"
import { useGameLogic } from "./logic.js";

import { Routes, Route, Link } from 'react-router-dom';

const App = () => {
  const {startGame, handleCorrect, handleLoss, handleGameOver, stats, config, running} = useGameLogic();

  return (
      <>
        {(!running) ? <Selection onStartGame={startGame} /> : 
        <Quiz onWrong={handleLoss} onCorrect={handleCorrect} endGame={handleGameOver} stats={stats} config={config} />}
      </>
  )
}

export default App;