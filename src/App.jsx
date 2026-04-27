import React, {useState} from "react";
import Quiz from "./Components/Quiz"
import Selection from "./Components/Selection"

const App = () => {

  const [running, setRunning] = useState(false)
  const [config, setConfig] = useState(null);

  const [stats, setStats] = useState({
    lives: 5,
    progress: 0
  })
  
  const startGame = (selectedConfig) => {
    if (selectedConfig.mode === "Practice")
      setStats((prev) => ({
      ...prev,
      lives: '∞'
    }))
    setConfig(selectedConfig)
    setRunning(true)
  }

  

  const handleLoss = () => {
    if (config.mode !== "Practice"){
      const nextLives = stats.lives - 1;
      setStats((prev) => ({
        ...prev,
        lives: nextLives
      }))

      if (nextLives <= 0) {
        alert("Game Over!");
        handleGameOver()
      }
    }
  }

  const handleGameOver = () => {
    
      setRunning(false);
      setStats({
        lives: 5,
        progress: 0
      })
  }

  const handleCorrect = () => {
    setStats((prev) => ({
      ...prev,
      progress: prev.progress + 1,
    }))
  }


  return (
    <>
      {(running) ? (
        <Quiz onWrong={handleLoss} onCorrect={handleCorrect} endGame={handleGameOver} stats={stats} config={config}/>
      ): (
        <Selection onStartGame={startGame} />
      )}
    </>
  )
}

export default App;