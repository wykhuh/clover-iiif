import React, { useState } from "react";

import Viewer from "docs/components/DynamicImports/Viewer";
function Newspaper() {
  const [issueId, setIssueId] = useState(4);
  const [searchTerm, setSearchTerm] = useState("furniture");

  const url = `http://localhost:3000/api/details/${issueId}?q=${searchTerm}`;

  const iiifContent = url;

  const options = [
    [4, "Grand Rapids Herald 1905-01-01 01"],
    [5, "Grand Rapids Herald 1909-01-01 01"],
    [6, "Weekly Artisan 1909-07-03 01"],
    [7, "Fine Furniture 1936-05-01 01"],
    [8, "Woman 1908-11-21 01"],
    [9, "Woman 1909-01-02 01"],
    [11, "Peninsular Club 1934-11-01 01"],
  ];

  return (
    <>
      <div>
        <form>
          <select
            onChange={(e) => {
              console.log("onChange:", e.target.value);
              setIssueId(Number(e.target.value));
            }}
          >
            {options.map((option) => (
              <option key={option[0]} value={option[0]}>
                {option[1]}
              </option>
            ))}
          </select>
        </form>
        <form
          style={{ marginTop: ".5rem" }}
          onSubmit={(e) => {
            e.preventDefault();
            setSearchTerm(e.target[0].value);
          }}
        >
          <input
            type="text"
            defaultValue={searchTerm}
            data-searchterm={searchTerm}
          ></input>
          <button type="submit">Search</button>
        </form>
      </div>
      <Viewer
        iiifContent={iiifContent}
        options={{ informationPanel: { renderAbout: false } }}
      />
    </>
  );
}

export default Newspaper;
