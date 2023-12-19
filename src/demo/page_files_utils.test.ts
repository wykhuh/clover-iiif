import { filterTextCoordinates } from "./page_files_utils";
import { formatSearchTerms } from "./solr_utils";

describe("filterTextCoordinates", () => {
  const rawTextCoordinates = {
    dog: [
      [10, 0, 0, 0, 0],
      [20, 0, 0, 0, 0],
    ],
    "dog,": [[40, 0, 0, 0, 0]],
    ant: [[60, 0, 0, 0, 0]],
    mouse: [[22, 0, 0, 0, 0]],
    "mouse,": [
      [31, 0, 0, 0],
      [42, 0, 0, 0, 0],
    ],
    gerbil: [[23, 0, 0, 0, 0]],
    fish: [[50, 0, 0, 0, 0]],
    cat: [
      [11, 0, 0, 0, 0],
      [30, 0, 0, 0, 0],
    ],
    "cat,": [
      [21, 0, 0, 0, 0],
      [41, 0, 0, 0, 0],
    ],
  };

  it("returns all coordinates for single word", () => {
    const searchTerms = "dog";
    const formattedSearchTerms = formatSearchTerms(searchTerms);
    const distinctText = ["dog,", "dog", "dog."];
    const expected = {
      dog: [
        [10, 0, 0, 0, 0],
        [20, 0, 0, 0, 0],
      ],
      "dog,": [[40, 0, 0, 0, 0]],
    };

    const result = filterTextCoordinates(
      rawTextCoordinates,
      distinctText,
      formattedSearchTerms,
    );

    expect(result).toEqual(expected);
  });

  it("returns all coordinates for multiple words", () => {
    const searchTerms = "dog cat";
    const formattedSearchTerms = formatSearchTerms(searchTerms);
    const distinctText = ["dog,", "dog", "dog.", "cat", "cat,", "cat."];
    const expected = {
      dog: [
        [10, 0, 0, 0, 0],
        [20, 0, 0, 0, 0],
      ],
      "dog,": [[40, 0, 0, 0, 0]],
      cat: [
        [11, 0, 0, 0, 0],
        [30, 0, 0, 0, 0],
      ],
      "cat,": [
        [21, 0, 0, 0, 0],
        [41, 0, 0, 0, 0],
      ],
    };

    const result = filterTextCoordinates(
      rawTextCoordinates,
      distinctText,
      formattedSearchTerms,
    );

    expect(result).toEqual(expected);
  });

  it("returns coordinates if quoted words have sequential pageIDs", () => {
    const searchTerms = '"dog cat"';
    const formattedSearchTerms = formatSearchTerms(searchTerms);
    const distinctText = ["dog", "dog,", "cat", "cat,"];

    const expected = {
      dog: [
        [10, 0, 0, 0, 0],
        [20, 0, 0, 0, 0],
      ],
      "dog,": [[40, 0, 0, 0, 0]],
      cat: [[11, 0, 0, 0, 0]],
      "cat,": [
        [21, 0, 0, 0, 0],
        [41, 0, 0, 0, 0],
      ],
    };

    const result = filterTextCoordinates(
      rawTextCoordinates,
      distinctText,
      formattedSearchTerms,
    );

    expect(result).toEqual(expected);
  });

  it("returns coordinates for quoted phrase with multiple spaces", () => {
    const searchTerms = '"  dog   cat "';
    const formattedSearchTerms = formatSearchTerms(searchTerms);
    const distinctText = ["dog", "dog,", "cat", "cat,"];

    const expected = {
      dog: [
        [10, 0, 0, 0, 0],
        [20, 0, 0, 0, 0],
      ],
      "dog,": [[40, 0, 0, 0, 0]],
      cat: [[11, 0, 0, 0, 0]],
      "cat,": [
        [21, 0, 0, 0, 0],
        [41, 0, 0, 0, 0],
      ],
    };

    const result = filterTextCoordinates(
      rawTextCoordinates,
      distinctText,
      formattedSearchTerms,
    );

    expect(result).toEqual(expected);
  });

  it("returns empty object if quoted words do not have sequential pageIDs", () => {
    const searchTerms = '"dog fish"';
    const formattedSearchTerms = formatSearchTerms(searchTerms);
    const distinctText = ["dog", "dog,", "fish", "fish,"];

    const expected = {};

    const result = filterTextCoordinates(
      rawTextCoordinates,
      distinctText,
      formattedSearchTerms,
    );

    expect(result).toEqual(expected);
  });

  it("returns coordinates for long quoted phrase", () => {
    const searchTerms = '"dog cat mouse gerbil"';
    const formattedSearchTerms = formatSearchTerms(searchTerms);
    const distinctText = [
      "gerbil",
      "gerbil,",
      "cat",
      "cat,",
      "dog,",
      "dog",
      "mouse",
      "mouse,",
    ];
    const expected = {
      dog: [[20, 0, 0, 0, 0]],
      mouse: [[22, 0, 0, 0, 0]],
      "cat,": [[21, 0, 0, 0, 0]],
      gerbil: [[23, 0, 0, 0, 0]],
    };

    const result = filterTextCoordinates(
      rawTextCoordinates,
      distinctText,
      formattedSearchTerms,
    );

    expect(result).toEqual(expected);
  });

  it("returns coordinates for quoted phrase and words", () => {
    const searchTerms = 'fish "dog cat" ant';
    const formattedSearchTerms = formatSearchTerms(searchTerms);
    const distinctText = [
      "cat",
      "cat,",
      "dog,",
      "dog",
      "ant",
      "ant,",
      "fish",
      "fish,",
    ];

    const expected = {
      dog: [
        [10, 0, 0, 0, 0],
        [20, 0, 0, 0, 0],
      ],
      "dog,": [[40, 0, 0, 0, 0]],
      cat: [[11, 0, 0, 0, 0]],
      "cat,": [
        [41, 0, 0, 0, 0],
        [21, 0, 0, 0, 0],
      ],
      ant: [[60, 0, 0, 0, 0]],
      fish: [[50, 0, 0, 0, 0]],
    };

    const result = filterTextCoordinates(
      rawTextCoordinates,
      distinctText,
      formattedSearchTerms,
    );

    expect(result).toEqual(expected);
  });

  it("returns coordinates for wildcards", () => {
    const searchTerms = "do* *at";
    const formattedSearchTerms = formatSearchTerms(searchTerms);
    const distinctText = ["cat", "cat,", "dog,", "dog"];

    const expected = {
      dog: [
        [10, 0, 0, 0, 0],
        [20, 0, 0, 0, 0],
      ],
      "dog,": [[40, 0, 0, 0, 0]],
      cat: [
        [11, 0, 0, 0, 0],
        [30, 0, 0, 0, 0],
      ],
      "cat,": [
        [21, 0, 0, 0, 0],
        [41, 0, 0, 0, 0],
      ],
    };

    const result = filterTextCoordinates(
      rawTextCoordinates,
      distinctText,
      formattedSearchTerms,
    );

    expect(result).toEqual(expected);
  });

  it("returns empty object for partial matches", () => {
    const searchTerms = "do at";
    const formattedSearchTerms = formatSearchTerms(searchTerms);
    const distinctText = ["do", "at"];

    const expected = {};

    const result = filterTextCoordinates(
      rawTextCoordinates,
      distinctText,
      formattedSearchTerms,
    );

    expect(result).toEqual(expected);
  });

  it("returns empty object if first word is not in ocr text", () => {
    const searchTerms = "invalid123 NEAR5 mouse";
    const formattedSearchTerms = formatSearchTerms(searchTerms);
    const distinctText = ["mouse", "mouse,"];
    const rawTextCoordinates = {
      dog: [[10, 0, 0, 0, 0]],
      mouse: [
        [16, 0, 0, 0, 0],
        [17, 0, 0, 0, 0],
      ],
    };
    const expected = {};

    const result = filterTextCoordinates(
      rawTextCoordinates,
      distinctText,
      formattedSearchTerms,
    );

    expect(result).toEqual(expected);
  });

  it("returns empty object if second word is not in ocr text", () => {
    const searchTerms = "dog NEAR5 invalid123";
    const formattedSearchTerms = formatSearchTerms(searchTerms);
    const distinctText = ["dog,", "dog"];
    const rawTextCoordinates = {
      dog: [[10, 0, 0, 0, 0]],
      mouse: [
        [16, 0, 0, 0, 0],
        [17, 0, 0, 0, 0],
      ],
    };
    const expected = {};

    const result = filterTextCoordinates(
      rawTextCoordinates,
      distinctText,
      formattedSearchTerms,
    );

    expect(result).toEqual(expected);
  });

  it("returns coordinates if words less than 'X' words aparts", () => {
    const searchTerms = "dog NEAR5 mouse";
    const formattedSearchTerms = formatSearchTerms(searchTerms);
    const distinctText = ["dog,", "dog", "mouse", "mouse,"];
    const rawTextCoordinates = {
      dog: [[10, 0, 0, 0, 0]],
      mouse: [
        [9, 0, 0, 0, 0],
        [11, 0, 0, 0, 0],
        [13, 0, 0, 0, 0],
      ],
      "mouse,": [
        [15, 0, 0, 0, 0],
        [16, 0, 0, 0, 0],
        [17, 0, 0, 0, 0],
      ],
    };
    const expected = {
      dog: [[10, 0, 0, 0, 0]],
      mouse: [
        [11, 0, 0, 0, 0],
        [13, 0, 0, 0, 0],
      ],
      "mouse,": [
        [15, 0, 0, 0, 0],
        [16, 0, 0, 0, 0],
      ],
    };

    const result = filterTextCoordinates(
      rawTextCoordinates,
      distinctText,
      formattedSearchTerms,
    );

    expect(result).toEqual(expected);
  });

  it("returns coordinates if ( OR ) NEAR and only 1st condition is true", () => {
    const searchTerms = "(dog OR mouse) NEAR5 cat";
    const formattedSearchTerms = formatSearchTerms(searchTerms);
    const distinctText = ["dog,", "dog", "mouse", "mouse,", "cat"];
    const rawTextCoordinates = {
      dog: [[10, 0, 0, 0, 0]],
      mouse: [[50, 0, 0, 0, 0]],
      cat: [
        [13, 0, 0, 0, 0],
        [23, 0, 0, 0, 0],
      ],
    };
    const expected = {
      dog: [[10, 0, 0, 0, 0]],
      cat: [[13, 0, 0, 0, 0]],
    };

    const result = filterTextCoordinates(
      rawTextCoordinates,
      distinctText,
      formattedSearchTerms,
    );

    expect(result).toEqual(expected);
  });

  it("returns coordinates if ( OR ) NEAR and only 2nd condition is true", () => {
    const searchTerms = "(dog OR mouse) NEAR5 cat";
    const formattedSearchTerms = formatSearchTerms(searchTerms);
    const distinctText = ["dog,", "dog", "mouse", "mouse,", "cat"];
    const rawTextCoordinates = {
      dog: [[50, 0, 0, 0, 0]],
      mouse: [[20, 0, 0, 0, 0]],
      cat: [
        [13, 0, 0, 0, 0],
        [23, 0, 0, 0, 0],
      ],
    };
    const expected = {
      mouse: [[20, 0, 0, 0, 0]],
      cat: [[23, 0, 0, 0, 0]],
    };

    const result = filterTextCoordinates(
      rawTextCoordinates,
      distinctText,
      formattedSearchTerms,
    );

    expect(result).toEqual(expected);
  });

  it("returns coordinates if ( OR ) NEAR and both conditions are true", () => {
    const searchTerms = "(dog OR mouse) NEAR5 cat";
    const formattedSearchTerms = formatSearchTerms(searchTerms);
    const distinctText = ["dog,", "dog", "mouse", "mouse,", "cat"];
    const rawTextCoordinates = {
      dog: [[20, 0, 0, 0, 0]],
      mouse: [[10, 0, 0, 0, 0]],
      cat: [
        [13, 0, 0, 0, 0],
        [23, 0, 0, 0, 0],
      ],
    };
    const expected = {
      dog: [[20, 0, 0, 0, 0]],

      mouse: [[10, 0, 0, 0, 0]],
      cat: [
        [23, 0, 0, 0, 0],
        [13, 0, 0, 0, 0],
      ],
    };

    const result = filterTextCoordinates(
      rawTextCoordinates,
      distinctText,
      formattedSearchTerms,
    );

    expect(result).toEqual(expected);
  });

  it("returns empty object if ( AND ) NEAR and only 1st condition is true", () => {
    const searchTerms = "(dog AND mouse) NEAR5 cat";
    const formattedSearchTerms = formatSearchTerms(searchTerms);
    const distinctText = ["dog,", "dog", "mouse", "mouse,", "cat"];
    const rawTextCoordinates = {
      dog: [[10, 0, 0, 0, 0]],
      mouse: [[50, 0, 0, 0, 0]],
      cat: [
        [13, 0, 0, 0, 0],
        [23, 0, 0, 0, 0],
      ],
    };
    const expected = {};

    const result = filterTextCoordinates(
      rawTextCoordinates,
      distinctText,
      formattedSearchTerms,
    );

    expect(result).toEqual(expected);
  });

  it("returns empty object if ( AND ) NEAR and only 2nd condition is true", () => {
    const searchTerms = "(dog AND mouse) NEAR5 cat";
    const formattedSearchTerms = formatSearchTerms(searchTerms);
    const distinctText = ["dog,", "dog", "mouse", "mouse,", "cat"];
    const rawTextCoordinates = {
      dog: [[50, 0, 0, 0, 0]],
      mouse: [[20, 0, 0, 0, 0]],
      cat: [
        [13, 0, 0, 0, 0],
        [23, 0, 0, 0, 0],
      ],
    };
    const expected = {};

    const result = filterTextCoordinates(
      rawTextCoordinates,
      distinctText,
      formattedSearchTerms,
    );

    expect(result).toEqual(expected);
  });

  it("returns coordinates if ( AND ) NEAR and both conditions are true", () => {
    const searchTerms = "(dog AND mouse) NEAR5 cat";
    const formattedSearchTerms = formatSearchTerms(searchTerms);
    const distinctText = ["dog,", "dog", "mouse", "mouse,", "cat"];
    const rawTextCoordinates = {
      dog: [[10, 0, 0, 0, 0]],
      mouse: [[20, 0, 0, 0, 0]],
      cat: [
        [13, 0, 0, 0, 0],
        [23, 0, 0, 0, 0],
      ],
    };
    const expected = {
      dog: [[10, 0, 0, 0, 0]],
      mouse: [[20, 0, 0, 0, 0]],
      cat: [
        [13, 0, 0, 0, 0],
        [23, 0, 0, 0, 0],
      ],
    };

    const result = filterTextCoordinates(
      rawTextCoordinates,
      distinctText,
      formattedSearchTerms,
    );

    expect(result).toEqual(expected);
  });
});
