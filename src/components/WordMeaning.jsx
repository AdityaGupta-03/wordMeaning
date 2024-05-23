import React, { useState, useRef} from 'react';

export default function WordMeaning(props) {
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const buttonRef = useRef(null);
  
  const handleChange = (e) => {
    if(e.target.value){
      setWord(e.target.value);
    }else{
      handleClear();
    }
  };

  const handleFind = async (e) => {
    e.preventDefault();
    if (word) {
      await fetchMeaning(word);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevents the default newline behavior in the textarea
      if (buttonRef.current) {
        buttonRef.current.click();
      }
    }
  };

  const fetchMeaning = async (word) => {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const data = await response.json();
    if (data && data.length > 0 && data[0].meanings && data[0].meanings.length > 0) {
      setMeaning(data[0].meanings[0].definitions[0].definition);
      props.showAlert("success", "Meaning is fetched");
    } else {
      setMeaning('No definition found.');
      props.showAlert("danger", "Please find another word");
    }
  };

  const handleClear = (e) => {
    document.getElementById("text").value="";
    setWord("");
    setMeaning("");
    props.showAlert("secondary", "Enter the word");
  };

  let color = {
    color: props.mode ==='light'?"black":"white"
  }

  let backgroundColor={
    backgroundColor: props.mode ==='light' ? "white":"#334066", 
    color: props.mode ==='light' ? "black":"white"
  }

  return (
    <div className="container my-3" style={color}>
      <h1>Please enter the word: </h1>
      <div className="form-floating mt-3" >
        <textarea className="form-control" placeholder="Drop your Word" id="text" onKeyDown={handleKeyDown} onChange={handleChange} style={backgroundColor}></textarea>
        <label htmlFor="floatingTextarea">Drop Your Word</label>
      </div>
      <button className="btn btn-success my-3" onClick={handleFind}  ref={buttonRef} >Find</button>
      <button className="btn btn-warning mx-3" onClick={handleClear}>Clear</button>
      <hr />
      <p className='fs-4'>Meaning:</p>
      {meaning.length > 0 ? <h3>{meaning}</h3> : ""}
    </div>
  );
}
