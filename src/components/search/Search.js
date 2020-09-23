import React from "react";
import './search.scss';

export default function Search({ 
  searchText, 
  typeSearch, 
  handleSearch, 
  handleBlur, 
  handleClick, 
  showSuggestion, 
  recents, 
  setToInput 
}) {

  const typedText = searchText.charAt(0).toUpperCase() + searchText.slice(1);

  return (
    <div className="search">
    <form onSubmit={handleSearch}>
      <div>
      <input
        types="text"
        value={searchText}
        onChange={typeSearch}
        placeholder="Type something"
        onClick={handleClick}
        onBlur={handleBlur}
      />
      <button type="submit">
        <i className="fa fa-search"></i>
      </button>
      </div>
    </form>
    {(showSuggestion && recents.length>0) && 
     <div className="overlay">
        <h5>Recently searched</h5>
        {recents && 
         recents.map(recent=>
         <div key={recent} onClick={()=>setToInput(recent)}>
           {recent.includes(typedText) ? <>
            <span style={{color:'blue'}}>{recent.slice(0, typedText.length)}</span>
            <span>{recent.slice(typedText.length, recent.length)}</span></>: recent
          }
           </div>
         )}
        </div>
    }
    </div>
  );
}
