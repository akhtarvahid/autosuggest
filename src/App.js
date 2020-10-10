import React, { useState, useEffect } from "react";
import Search from "./components/search/Search";
import Results from "./components/results/Results";
import {API_KEY} from './utils/constants';
import "./styles.scss";

const url = `https://pixabay.com/api/?key=${API_KEY}`;
export default function App() {
  const getData = JSON.parse(localStorage.getItem('recents'));
  const isDataAvailable = getData ? getData: [];
  const [searchText, setSearchText] = useState("books");
  const [results, setResults] = useState({});
  const [recents, setRecents] = useState(isDataAvailable);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const saveLocalStorage = (recentText) => {
    if(getData===null || getData === undefined) {
      let newArr = [recentText];
      localStorage.setItem('recents', JSON.stringify(newArr));
    }
    else {
     const updateData = [recentText, ...getData];
     setRecents(updateData);
     localStorage.setItem('recents', JSON.stringify(updateData));
     }
  }

  const callToApi = (textPassed) => {
    return fetch(`${url}&q=${textPassed}&image_type=photo`)
    .then((res) => res.json())
    .then((res) => res)
    .catch(err=> {console.log(err); return [];})
  }
  useEffect(()=> {
    if (searchText) {
      setIsSearching(true);
      callToApi(searchText)
      .then(results => {
        setIsSearching(false);
        setResults(results);
      });
    } else {
      setResults([]);
    }
  },[])

  const typeSearch = (e) => {
    const { value } = e.target
    setSearchText(value);
    setShowSuggestion(true);
  };
  const handleSubmitSearch = (e) => {
    e.preventDefault();
    setShowSuggestion(false);
    const typedText = searchText.charAt(0).toUpperCase() + searchText.slice(1);
    let notExist = recents.filter(recent=> recent===typedText).length === 0;
    if(notExist) {
      setRecents([...recents, typedText]);
      saveLocalStorage(typedText);
      setSearchText('');
    }

    if (typedText) {
      setIsSearching(true);
      callToApi(typedText)
      .then(results => {
        setIsSearching(false);
        setResults(results);
      });
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
  };
  return (
    <div className="App">
      <h1>Autosuggest Search</h1>
      <Search
        searchText={searchText}
        typeSearch={typeSearch}
        handleSubmitSearch={handleSubmitSearch}
        handleBlur={handleBlur}
        showSuggestion={showSuggestion}
        recents={recents}
        setToInput={setToInput}
        handleClick={handleClick}
      />
       {isSearching ? 
       <p className="searching">Searching...</p>
        : (results.hits && results.hits.length> 0) 
        && <p>Results found</p>}
      <Results 
       lists={results.hits}
      />
    </div>
  );
}
