import { useState } from "react"
import { useNavigate } from "react-router-dom";

const IS_MOCK = true;
const MAX_TIME = 20;

export const useGameLogic = () => {

  const [stats, setStats] = useState({
    lives: 5,
    progress: 0,
    score: 0,
    startTime: 0,
    MAX_TIME
  })

  const navigate = useNavigate();
  const [config, setConfig] = useState(null);
  const [running, setRunning] = useState(false);

  const startGame = async (selectedConfig) => {
    const time = (selectedConfig.mode === "Minute") ? (selectedConfig.time * 60) :
        (selectedConfig.mode === "Practice") ? 0 : MAX_TIME;
    
    setStats((prev) => ({
      ...prev,
      startTime: time
    }));
    if (selectedConfig.mode === "Practice") {
      setStats((prev) => ({
        ...prev,
        lives: '∞'
      }))
      const data = await loadPracticeGame(selectedConfig);

      if (data.length != 0) {
        if (confirm("Are you sure you want to continue or reset?")) {
          setStats((prev) => ({
            ...prev,
            progress: data.progress,
            startTime: data.time
          }))
        }
      }
    }
    setConfig(selectedConfig)
    
    setRunning(true);
  }

  const handleCorrect = (pointTime) => {
    if (config.mode !== "Practice") {
      setStats((prev) => ({
        ...prev,
        progress: prev.progress + 1,
        score: prev.score + (pointTime)
      }))
    }
    else {
        setStats((prev) => ({
        ...prev,
        progress: prev.progress + 1,
      }))
    }
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

  const handleGameOver = (level, time) => {
      setRunning(false);
      if (config.mode !== "Practice") {
        saveFinalScore(stats.score, level, config);
      }
      else {
        if (stats.progress > 0)
          savePracticeGame(time, stats.progress, config);
      }
      setStats({
        lives: 5,
        progress: 0,
        score: 0
      })


  }

  const loadPracticeGame = async (config) => {
    const symbol = (op) => {
      switch (op) {
        case '+': return 'add';
        case '-': return 'sub';
        case '×': return 'mult';
        case '÷': return 'div';
      }
    }
    const configString = `${symbol(config.operation)}-${(config.operation === '×' || config.operation === '÷') ? config.factor : 'any'}`;
    console.log("Config String: " + configString);
    try {
      const response = await fetch(`http://localhost:4000/api/practice/${configString}`);
      if (!response.ok) {
        console.error("Server responded with error:", response.statusText);
        return [];
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error loading game. " + error);
    };
    return [];
  };

  const savePracticeGame = async (time, progress, config) => {
    try {
      const response = await fetch("http://localhost:4000/api/practice", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ time, progress, config })
      });
      if (!response.ok) {
        console.error("Server responded with error:", response.statusText);
    }
      console.log({ time, progress, config });
    } catch (error) {
      console.error("Error saving game. " + error);
    };
  }

  const saveFinalScore = async (finalScore, finalLevel, config) => {
    if (IS_MOCK) {
      console.log("Mock save score:", { score: finalScore, level: finalLevel, config });
      return;
    }
   try {
    await fetch('http://localhost:4000/api/scores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ score: finalScore, level: finalLevel, config })
    });
    console.log({ score: finalScore, level: finalLevel, config });
   } catch (error) {
    console.error('Error saving final score:', error);
   };
  }

  return {startGame, handleCorrect, handleLoss, handleGameOver, stats, config, running}
}