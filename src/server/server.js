const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 4000;

app.use(cors({
    methods: ['GET', 'POST', 'DELETE']
}));
app.use(express.json());

let highScores = {};
let practiceProgress = {};

const symbol = (op) => {
    switch (op) {
    case '+': return 'add';
    case '-': return 'sub';
    case '×': return 'mult';
    case '÷': return 'div';
    }
}

app.use((req, res, next) => {
  console.log(`${req.method} request sent to ${req.url}`);
  next();
});

app.get('/api/scores', (req, res) => {
    res.json(highScores);
});


app.get('/api/practice', (req, res) => {
    res.json(practiceProgress); 
});

app.get('/api/practice/:config', (req, res) => {

    console.log(req.params.config);
    const progress = practiceProgress[req.params.config] || [];
    console.log("Data: ", progress);
    return res.json(progress);
});


app.get('/api/scores/:config', (req, res) => {
    const config = req.params.config;
    const key = `${config.operation}-${(config.operation === '×' || config.operation === '÷') ? config.factor : 'any'}-${config.mode}-${(config.mode === 'Minute') ? '(' + config.time + 'minutes)' : ''}`;
    const scores = highScores[key] || [];
    res.json( scores );
});

app.post('/api/scores', (req, res) => {
    const { score, level, config } = req.body;
    const key = `${config.operation}-${(config.operation === '×' || config.operation === '÷') ? config.factor : 'any'}-${config.mode}-${(config.mode === 'Minute') ? '(' + config.time + 'minutes)' : ''}`;
    if (!highScores[key] || score > highScores[key].score) {
        highScores[key] = {score, level: 'Level ' + level};
    }
    res.json({ message: 'Score added successfully' });
});

app.delete('/api/scores', (req, res) => {
    highScores = {};
    res.json({ message: 'All scores cleared successfully' });
});

app.post('/api/practice', (req, res) => {
    const { time, progress, config } = req.body;
    const key = `${symbol(config.operation)}-${(config.operation === '×' || config.operation === '÷') ? config.factor : 'any'}`;

    practiceProgress[key] = { time, progress };
    
    res.json({ message: 'Practice game saved. '})
});

app.get('/api/practice/:config', (req, res) => {
    
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});