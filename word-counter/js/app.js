const inputText = document.querySelector('#text');
const statElem = document.querySelector('#stat');


const wordFrequencyDiv = document.getElementById('word-frequency');

// create a new instance of WordCounter
new WordCounter(inputText);


const render = (event) => {
    statElem.innerHTML = `<p>You've written <span class="highlight">${event.detail.wordStat.words} words</span> 
        and <span class="highlight">${event.detail.wordStat.characters} characters</span>.</p>`;
}

inputText.addEventListener('count', render);