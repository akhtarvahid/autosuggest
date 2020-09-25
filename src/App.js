import React, { useState, useEffect } from "react";
import Search from "./components/search/Search";
import Results from "./components/results/Results";
import customDebounce from './components/debounce/customDebounce';
import {API_KEY} from './utils/constants';
import "./styles.scss";

const url = `https://pixabay.com/api/?key=${API_KEY}`;
export default function App() {
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState({});
  const [recents, setRecents] = useState(['Animal']);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const defaultText = searchText ? searchText : 'books';
  const debouncedSearchTerm = customDebounce(defaultText, 500);

  const callToApi = (textPassed) => {
    return fetch(`${url}&q=${textPassed}&image_type=photo`)
    .then((res) => res.json())
    .then((res) => res)
    .catch(err=> {console.log(err); return [];})
  }
  useEffect(()=> {
    if (debouncedSearchTerm) {
      setIsSearching(true);
      callToApi(debouncedSearchTerm)
      .then(results => {
        setIsSearching(false);
        setResults(results);
      });
    } else {
      setResults([]);
    }
  },
  [debouncedSearchTerm])

  const typeSearch = (e) => {
    const { value } = e.target
    setSearchText(value);
    setShowSuggestion(true);

      if (debouncedSearchTerm) {
        setIsSearching(true);
        callToApi(debouncedSearchTerm)
        .then(results => {
          setIsSearching(false);
          setResults(results);
        });
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
    if (debouncedSearchTerm) {
      setIsSearching(true);
      callToApi(debouncedSearchTerm)
      .then(results => {
        setIsSearching(false);
        setResults(results);
      });
    }
  };
  return (
    <div className="App">
      <h1>Autosuggest Search</h1>
      {'<To be implemented- store recent searches with x icon to delete for specified durations>'}
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
       {isSearching ? 
       <p className="searching">Searching...</p>
        : (results.hits && results.hits.length> 0) 
        && <p>Results for <span>{searchText}</span></p>}
      <Results 
       lists={results.hits}
      />
    </div>
  );
}
