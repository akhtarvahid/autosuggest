import React, { useState, useEffect } from "react";
import Search from "./components/search/Search";
import Results from "./components/results/Results";
import {API_KEY} from './utils/constants';
import "./styles.scss";

const url = `https://pixabay.com/api/?key=${API_KEY}`;
export default function App() {
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState({});
  const [recents, setRecents] = useState([]);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const callToApi = (textPassed) => {
    console.log(textPassed)
    fetch(`${url}&q=${textPassed}&image_type=photo`)
    .then((res) => res.json())
    .then((res) => {
      setResults(res);
    });
  }
  useEffect(()=> {
    callToApi('nature');
  },[])
  const typeSearch = (e) => {
    const { value } = e.target
    setSearchText(value);
    setShowSuggestion(true);
    if (value !== undefined && value !== "" && value.length > 3) {
      callToApi(value);
    }
  };
  const handleSearch = (e) => {
    e.preventDefault();
    const typedText = searchText.charAt(0).toUpperCase() + searchText.slice(1)
    if(typedText!=='' && typedText!==undefined) {
     setRecents([...recents, typedText]);
     setShowSuggestion(false);
    }
  };
  const handleBlur = e => {
        // firefox onBlur issue workaround
     if (e.nativeEvent.explicitOriginalTarget &&
          e.nativeEvent.explicitOriginalTarget === e.nativeEvent.originalTarget) {
        return;
      }
  
      if (showSuggestion) {
        setTimeout(() => {
          setShowSuggestion(false);
        }, 200);
      }
  }
  const handleClick = (e) => {
    e.target.focus();
    setShowSuggestion(!showSuggestion)
  }
  const setToInput = (selected) => {
    setSearchText(selected);
    setShowSuggestion(false);
    callToApi(selected);
    console.log(selected)
  };
  console.log(searchText);
  return (
    <div className="App">
      <h1>Autosuggest Search</h1>
      <Search
        searchText={searchText}
        typeSearch={typeSearch}
        handleSearch={handleSearch}
        handleBlur={handleBlur}
        showSuggestion={showSuggestion}
        recents={recents}
        setToInput={setToInput}
        handleClick={handleClick}
      />
      <Results 
       lists={results.hits}
       searchText={searchText} 
      />
    </div>
  );
}
