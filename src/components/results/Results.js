import React from "react";
import './results.scss';

export default function SearchedResult({ lists }) {
  return (
    <div>
      {lists && lists.length> 0 && <p>Results</p>}
      <div className="searchlist-row">
        {lists &&
          lists.map((list) => (
            <div key={list.id} className="list">
              <img src={list.largeImageURL} alt={list.tags} />
              <div>{list.tags}</div>
            </div>
          ))}
      </div>
    </div>
  );
}
