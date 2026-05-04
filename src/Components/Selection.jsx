import React, { useState, useEffect } from "react"
import './Selection.css'

const Selection = ({onStartGame}) => {

    const [settings, setSettings] = useState({
        operation: '+',
        factor: 2,
        mode: "Classic",
        time: 1
    });

    const possibleMultiple = 
    [0.2, 0.25, 0.5, 2, 3, 4, 5, 6, 7, 8, 9,
        12, 13, 14, 15, 16, 17, 18, 19, 20,
        25, 50, 75, 99, 125, 250, 500, 750, 999
    ]

    const possibleDivisible =
    [0.2, 0.25, 0.5, 2, 3, 4, 5, 6, 7, 8, 9,
        15, 20, 25, 40, 50
    ]
    
    return (
        <div className="container">
            <h1>Math Tricks</h1>
            
            <div className="panel">
                <div className="form-group">
                    <div className="form">
                        <label>Select Operation</label>
                        <select value={settings.operation}
                        onChange={e => setSettings({
                            ...settings,
                            operation: e.target.value
                        })}>
                            <option value="+">Addition</option>
                            <option value="-">Subtraction</option>
                            <option value="×">Multiplication</option>
                            <option value="÷">Division</option>
                        </select>
                    </div>
                    <div className="form">
                        <label>Quantity</label>
                        <select value={settings.factor}
                        disabled={
                            settings.operation !== '×' &&
                            settings.operation !== '÷'
                        }
                        onChange={e => setSettings({
                            ...settings,
                            factor: e.target.value
                        })}>
                            {(settings.operation === "×") &&
                            possibleMultiple.map(num => (
                                <option key={num} value={num}>Multiply by {num}</option>
                            ))}
                            {(settings.operation === "÷") &&
                            possibleDivisible.map(num => (
                                <option key={num} value={num}>Divisible by {num}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="form-group">
                    <div className="form">
                        <label>Select Mode</label>
                        <select value={settings.mode}
                        onChange={e => setSettings({
                            ...settings,
                            mode: e.target.value
                        })}>
                            <option value="Classic">Classic</option>
                            <option value="Minute">Minute Challenge</option>
                            <option value="Practice">Practice</option>
                        </select>
                    </div>
                    <div className="form">
                        <label>Select Time Limit</label>
                        <select value={settings.time}
                        disabled={settings.mode !== "Minute"}
                        onChange={e => setSettings({
                            ...settings,
                            time: e.target.value
                        })}>
                        {[1, 2, 3, 5, 10].map(num => (
                            <option key={num} value={num}>{num} minute(s)</option>
                        ))}
                        </select>
                    </div>
                </div>
            </div>
            <button onClick={() => {
                onStartGame(settings)
                console.log(settings)
                }}>Start</button>
        </div>
    )
}

export default Selection