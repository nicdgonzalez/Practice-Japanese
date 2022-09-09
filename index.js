const express = require('express');

const app = express();
const phrases = require('./static/json/phrases.json').greetings;

app.use('/static', express.static('static'));
app.use(express.urlencoded({ extended: true }));

app.listen(8000, () => {
    console.log(`Listening on: http://localhost:8000`);
});

app.get('/', (request, response) => {
    let prompt = phrases[Math.floor(Math.random() * phrases.length)];
    let params = {
        phrase: prompt.phrase,
        valid_answers: prompt.valid_answers,
    };
    response.render('index.ejs', params);
});
