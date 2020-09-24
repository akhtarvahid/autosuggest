import React from "react";
import './results.scss';

export default function Results({ lists, 
  searchText, isSearching }) {
  return (
    <div className="results">
      {isSearching ? <p className="searching">Searching...</p>: 
     ( lists && lists.length> 0) && 
     <p>Results for <span>{searchText}</span></p>}
      <div className="searchlist-row">
        {lists && lists.length > 0 ?
          lists.map((list) => (
            <div key={list.id} className="list">
              <img src={list.largeImageURL} alt={list.tags} />
              <div>{list.tags}</div>
            </div>
          )):
          <div>Not found</div>
        }
      </div>
    </div>
  );
}
