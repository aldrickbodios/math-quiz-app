import React, { useState, useEffect } from "react"
import './Quiz.css'
import { IoMdTimer, IoMdClose } from "react-icons/io";
import { FaHeart } from "react-icons/fa";

import { useLocation, useNavigate } from 'react-router-dom';


const Quiz = ({onWrong, onCorrect, endGame, stats, config}) => {

    const MAX_TIME = stats.MAX_TIME;
    const { mode = "Classic", operation = "+", factor = 2, time: answerTime = 1 } = config || {};

    const [num1, setNum1] = useState(0);
    const [num2, setNum2] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [time, setTime] = useState(stats.startTime);
    const [pointTime, setPointTime] = useState(MAX_TIME * 5);
    const [level, setLevel] = useState(1);

    const generateQuestion = () => {
        const max = 10 + (Math.floor((level - 1) / 2)) * 5;
        const min = (level >= 5) ? (Math.floor((level - 5) / 2)) * 5 : 1;
        let a, b;
        a = (Math.floor(Math.random() * (max - min)) + min);
        switch (operation) {
            case "×":
                b = factor
                break
            case "÷":
                b = factor
                a = (Math.floor(Math.random() * (max - min)) + min) * factor
                break
            case "-":
                b = Math.floor(Math.random() * (max - min)) + min;
                if (a < b) 
                [a, b] = [b, a]
                break;
            default:
                b = (Math.floor(Math.random() * (max - min)) + min);
        }

        setNum1(a)
        setNum2(b)
    }

    const handleEvaluation = () => {
        switch (operation) {
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

    useEffect(() => {
        if (mode !== "Practice"){
            if (time === 0) {
                if (mode === "Minute") {
                    alert("Time's Up!");
                    endGame(level, time);
                    return;
                }
                else {
                alert("Time's up! The correct answer is " + handleEvaluation());
                    onWrong();
                    setTime(MAX_TIME);
                    setPointTime(MAX_TIME * 5);
                    return;
                }
            }
        }
        const timer = setInterval(() => {
            if (mode !== "Practice") {
                setTime(prev => prev - 1)
                setPointTime(prev => prev - 5)
            }
            else
                setTime(prev => prev + 1)
        }, 1000)

        return () => clearInterval(timer)
    }, [time])

    const handleSubmit = () => {
        const input = parseFloat(userInput, 10);
        if (isNaN(input))
            alert("Please enter a valid number. ")
        else {
            if (handleEvaluation() === input) {
                onCorrect(pointTime);        
            }
            else {
                alert("Wrong answer! The correct answer is " + handleEvaluation());
                onWrong();
            }
            if (mode === "Classic") setTime(MAX_TIME);
            if (mode !== "Practice") setPointTime(MAX_TIME * 5);
            generateQuestion();
        }
        setUserInput("");
    }

    const getName = () => {
        switch (operation) {
            case "+":
                return "Addition"
            case "-":
                return "Subtraction"
            case "×":
                return "Multiplication by " + factor
            case "÷":
                return "Division by " + factor
        }
    }

    const convertTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return (mode !== "Classic") ? 
            `${minutes}:${seconds < 10 ? '0' : ''}${seconds}` : `${time}s`;
    }

    return (
        <div className="container">
            <header>
                <h1>Math Tricks</h1>
                <IoMdClose size="20px" style={{cursor: 'pointer'}} onClick = {() => {
                    if (confirm("Are you sure you want to exit?"))
                        endGame(level, time);
                }} />
            </header>
            <div className="topbar">
                <div className="stat">
                    <span>Level {level} {(mode !== "Practice") && `• Score ${stats.score}`}</span>
                    <span><IoMdTimer size="20px"/>{convertTime(time)}</span>
                    <span><FaHeart size="20px"/>{stats.lives}</span>
                </div>
                <div className="progress-bar">
                    <div className="progress" 
                    style={{width: `${(stats.progress % 10) * 10}%`}}></div>
                </div>
            </div>
            <div className="question-box">
                <span>{num1} {operation} {num2}</span>
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