import React, { useState, useEffect } from "react"
import './Quiz.css'
import { IoMdTimer } from "react-icons/io";
import { FaHeart } from "react-icons/fa";

const Quiz = ({onWrong, onCorrect, endGame, stats, config}) => {

    const [num1, setNum1] = useState(0);
    const [num2, setNum2] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [time, setTime] = (config.mode === "Minute") ? useState(config.time * 60) :
    (config.mode === "Practice") ? useState('∞') : useState(20);
    const [level, setLevel] = useState(1);

    const generateQuestion = () => {
        const max = 10 + Math.floor((level-1) / 2) * 5;
        const min = (level >= 5) ? Math.floor(1 + (level-5) / 2 * 5) : 1;
        let a, b;
        a = (Math.floor(Math.random() * max) + min);
        switch (config.operation) {
            case "×":
                b = config.factor
                break
            case "÷":
                b = config.factor
                a = (Math.floor(Math.random() * max) + min) * config.factor
                break
            case "-":
                b = Math.floor(Math.random() * max) + min;
                if (a < b) 
                [a, b] = [b, a]
                break;
            default:
                b = (Math.floor(Math.random() * max) + min);
        }
        setNum1(a)
        setNum2(b)
    }

    const handleEvaluation = () => {
        switch (config.operation) {
            case "+":
                return num1 + num2
            case "-":
                return num1 - num2
            case "×":
                return num1 * num2
            case "÷":
                return num1 / num2
        }
    }

    useEffect(() => {
        generateQuestion();
    }, []);

    useEffect(() => {
        const keyDownHandler = e => {
            if (e.key === 'Enter') {
                e.preventDefault()
                handleSubmit()
            }
        }

        document.addEventListener('keydown', keyDownHandler);
        setLevel(Math.floor(stats.progress / 10) + 1)
        return () => {
            document.removeEventListener('keydown', keyDownHandler);
        }
    })

    if (config.mode !== "Practice") {
        useEffect(() => {
            if (time === 0) {
                if (config.mode === "Minute") {
                    endGame();
                    return;
                }
                else {
                alert("Time's up! The correct answer is " + handleEvaluation());
                    onWrong();
                    setTime(20);
                    return;
                }
            }
            const timer = setInterval(() => {
                setTime(prev => prev - 1)
            }, 1000)

            return () => clearInterval(timer)
        }, [time])
    }

    const handleSubmit = () => {
        const input = parseFloat(userInput, 10);
        if (isNaN(input))
            alert("Please enter a valid number. ")
        else {
            if (handleEvaluation() === input) {
                onCorrect();        
            }
            else {
                alert("Wrong answer! The correct answer is " + handleEvaluation());
                onWrong();
            }
            if (config.mode === "Practice") setTime('∞');
            else if (config.mode !== "Minute") setTime(20);
            generateQuestion();
        }
        setUserInput("");
    }

    const getName = () => {
        switch (config.operation) {
            case "+":
                return "Addition"
            case "-":
                return "Subtraction"
            case "×":
                return "Multiplication by " + config.factor
            case "÷":
                return "Division by " + config.factor
        }
    }

    return (
        <div className="container">
            <h1>Math Tricks</h1>
            <div className="topbar">
                <div className="stat">
                    <span>Level {level}</span>
                    <span><IoMdTimer size="20px"/>{time}s</span>
                    <span><FaHeart size="20px"/>{stats.lives}</span>
                </div>
                <div className="progress-bar">
                    <div className="progress" 
                    style={{width: `${(stats.progress % 10) * 10}%`}}></div>
                </div>
            </div>
            <div className="question-box">
                <span>{num1} {config.operation} {num2}</span>
            </div>
            <p>{getName()}</p>
            <div className="input-panel">
                <input value={userInput} onChange={(e) => {
                    setUserInput(e.target.value);
                }}></input>
                <button onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    )
}

export default Quiz