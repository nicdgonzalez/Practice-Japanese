const express = require('express');

const app = express();

app.use('/static', express.static('static'));
app.use(express.urlencoded({ extended: true }));

let phraseIndex = 0;

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

// Helper function to save some repetitive typing.
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

app.listen(8000, () => {
    console.log(`Listening on: http://localhost:8000`);
});

app.get('/', (request, response) => {
    response.render('index.ejs', getParameters(phraseIndex));
});

app.post('/translate', (request, response) => {
    let translation = request.body.translation;
    if (getParameters(phraseIndex).valid_answers.includes(
            cleanupString(translation)
    )) {
        phraseIndex++;
    }
    response.redirect('/');
});
