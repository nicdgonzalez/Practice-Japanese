const express = require('express');

const app = express();

app.use('/static', express.static('static'));
app.use(express.urlencoded({ extended: true }));

app.listen(8000, () => {
    console.log(`Listening on: http://localhost:8000`);
});

// ---------------------------------------------------------------------------

// Prepare the string for case-insensitive comparison.
function cleanupString(string) {
    return string.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").toLowerCase();
}

// Helper function to clean all valid answers of a phrase.
function cleanupValidAnswers(phrasesCategory) {
    for (let index = phrasesCategory.length - 1; index--; ) {
        let valid_answers = phrasesCategory[index].valid_answers;
        valid_answers = valid_answers.map((answer) => cleanupString(answer));
        phrasesCategory[index].valid_answers = [...new Set(valid_answers)];
    }
    return;
}

function getParameters(index) {
    const phrasesGreetings = require('./static/json/phrases.json').greetings;
    cleanupValidAnswers(phrasesGreetings);
    if ((index < 0) || (index >= phrasesGreetings.length)) {
        return null;
    }
    return {
        phrase: phrasesGreetings[index].phrase,
        valid_answers: phrasesGreetings[index].valid_answers,
    };
}

// For incrementing the index of the phrase.
let index = 0;

// ---------------------------------------------------------------------------

app.get('/', (request, response) => {
    response.render('index.ejs', getParameters(index));
});

app.post('/translate', (request, response) => {
    let translation = request.body.translation;
    if (getParameters(index).valid_answers.includes(cleanupString(translation))) {
        index++;
    }
    response.redirect('/');
});
