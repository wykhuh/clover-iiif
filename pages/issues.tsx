import React, { useState } from "react";

import Viewer from "docs/components/DynamicImports/Viewer";
import { menuOptions } from "src/demo/ca_manifests";

function Newspaper() {
  const [issueId, setIssueId] = useState(menuOptions[0][0]);
  const [searchTerm, setSearchTerm] = useState("grand");

  const url = `${process.env.NEXT_PUBLIC_API_BASE}manifests/${issueId}?q=${searchTerm}`;

  const iiifContent = url;

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
            {menuOptions.map((option) => (
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
