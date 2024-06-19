// import { useState } from 'react'
import './App.css'

import { useState } from 'react'; // Import necessary hooks



function getWordStat (words) {
  let str = words.trim();
  let matches = str.match(/\S+/g);
  return {
    characters: str.length,
    words: matches ? matches.length : 0,
  };
}

function App() {
  const [text, setText] = useState(''); // State for text content
  const [wordCount, setWordCount] = useState(0); // State for word count
  const [characterCount, setCharacterCount] = useState(0); // State for character count


  const handleTextChange = (event) => {
    let result;
    setText(event.target.value);
    result = getWordStat(event.target.value);

    setCharacterCount(result.characters);
    setWordCount(result.words);
  };


  return (
    <div className="main">
      <div className="container">
        <h1>Word Counter</h1>
        <label htmlFor="text">Enter some text below:</label>
        <textarea id="text" rows="10" cols="70" value={text} onChange={handleTextChange} />
        <div id="stat">
          <p>
           You've written <span className="highlight">{wordCount} words</span> and{' '}
           <span className="highlight">{characterCount} characters</span>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
