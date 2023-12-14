import * as fs from "fs";
import * as path from "path";

import { type MysqlPage } from "src/demo/mysql_utils";

export type TextCoordinates = {
  [k: string]: number[][];
};

//==================
// fetch text coordinates
//==================

export function readTextCoordinatesFile(page: MysqlPage) {
  const pageFilePath = path.join(
    process.env.DATA_DIRECTORY || "",
    page["text_coordinates_file_path"].replace(".gz", ""),
  );
  return JSON.parse(fs.readFileSync(pageFilePath, "utf8"));
}

// quotedSearchTerms: [A, B]
// ocr_texts: [A1, B1, B2, C1]
// rawTextCoordinates: {A1:[[1,0,0,0,0], [3,0,0,0,0]], B1: [[2,0,0,0,0]], B2: [[4,0,0,0,0]]}
function createTextPositionIndexes(
  quotedSearchTerms: string[],
  ocr_texts: string[],
  rawTextCoordinates: TextCoordinates,
) {
  // quoteSearchTerm_indexes: {A: [1, 3], B: [2, 4]}
  const quoteSearchTerm_indexes = {} as { [k: string]: number[] };
  // index_distinctText: {1: A1, 2: B1, 3: A1, 4: B2}
  const index_distinctText = {} as { [k: number]: string };
  // quotedDistinctTexts: [ A1, B1, B2 ]
  const quotedDistinctTexts = [] as string[];

  quotedSearchTerms.forEach((quotedWord) => {
    ocr_texts.forEach((text) => {
      if (text.toLowerCase().includes(quotedWord.toLowerCase())) {
        quotedDistinctTexts.push(text);

        if (rawTextCoordinates[text]) {
          if (!quoteSearchTerm_indexes[quotedWord]) {
            quoteSearchTerm_indexes[quotedWord] = [];
          }

          rawTextCoordinates[text].forEach((coordinate: number[]) => {
            quoteSearchTerm_indexes[quotedWord].push(coordinate[0]);
            index_distinctText[coordinate[0]] = text;
          });
        }
      }
    });
  });

  // console.log("quotedDistinctTexts 10 ???:", quotedDistinctTexts);
  console.log("quoteSearchTerm_indexes 11 ???:", quoteSearchTerm_indexes);
  console.log("index_distinctText 12 ???:", index_distinctText);

  return { quoteSearchTerm_indexes, index_distinctText, quotedDistinctTexts };
}

// check if pageID of all subsequent search terms are sequential
function validateSequentialPageIds(
  quotedSearchTerms: string[],
  quoteSearchTerm_indexes: {
    [k: string]: number[];
  },
  index: number,
) {
  let count = 1;
  let valid = true;
  while (count < quotedSearchTerms.length) {
    const nextQuotedSearchTerm = quotedSearchTerms[count];
    if (
      quoteSearchTerm_indexes[nextQuotedSearchTerm].indexOf(index + count) ===
      -1
    ) {
      valid = false;
    }
    count = count + 1;
  }

  return valid;
}

function processSequentialSearchTerms(
  quotedSearchTerms: string[],
  index_distinctText: { [k: number]: string },
  rawTextCoordinates: TextCoordinates,
  index: number,
  matches: TextCoordinates,
): void {
  let count = 0;
  while (count < quotedSearchTerms.length) {
    const currentDistinctText = index_distinctText[index + count];
    if (rawTextCoordinates[currentDistinctText]) {
      rawTextCoordinates[currentDistinctText].forEach((coordinate) => {
        if (coordinate[0] == index + count) {
          if (!matches[currentDistinctText]) {
            matches[currentDistinctText] = [];
          }
          matches[currentDistinctText].push(coordinate);
        }
      });
    }
    count += 1;
  }
}

function findTextCoordinatesWithinGivenDistance(
  index_distinctText: { [k: number]: string },
  secondWordIndexes: number[],
  rawTextCoordinates: TextCoordinates,
  index: number,
  proximityCount: number,
  stringIds: Set<number>,
  matches: TextCoordinates,
) {
  let count = 0;

  while (count < secondWordIndexes.length) {
    const secondIndex = secondWordIndexes[count];

    if (secondIndex > index && secondIndex < index + proximityCount + 2) {
      if (!stringIds.has(index)) {
        stringIds.add(index);

        const firstCoord = rawTextCoordinates[index_distinctText[index]].find(
          (coordinate) => coordinate[0] === index,
        );

        if (!matches[index_distinctText[index]]) {
          matches[index_distinctText[index]] = [];
        }
        if (firstCoord) {
          matches[index_distinctText[index]].push(firstCoord);
        }
      }

      if (!stringIds.has(secondIndex)) {
        stringIds.add(secondIndex);

        const secondCoord = rawTextCoordinates[
          index_distinctText[secondIndex]
        ].find((coordinate) => coordinate[0] === secondIndex);

        if (!matches[index_distinctText[secondIndex]]) {
          matches[index_distinctText[secondIndex]] = [];
        }
        if (secondCoord) {
          matches[index_distinctText[secondIndex]].push(secondCoord);
        }
      }
    }

    count += 1;
  }
}

function processProximitySearchTerms(
  quotedSearchTerms: RegExpMatchArray | null,
  ocr_texts: string[],
  rawTextCoordinates: TextCoordinates,
  proximityCount: number,
  stringIds: Set<number>,
  matches: TextCoordinates,
) {
  console.log("\nquotedSearchTerms 1 ???:", quotedSearchTerms);
  console.log("proximityCount 2 ???:", proximityCount);
  if (quotedSearchTerms === null) {
    return;
  }

  const { quoteSearchTerm_indexes, index_distinctText } =
    createTextPositionIndexes(quotedSearchTerms, ocr_texts, rawTextCoordinates);

  const firstWordIndexes = quoteSearchTerm_indexes[quotedSearchTerms[0]];
  const secondWordIndexes = quoteSearchTerm_indexes[quotedSearchTerms[1]];
  console.log("firstWordIndexes 20 ???:", firstWordIndexes);
  console.log("secondWordIndexes 21 ???:", secondWordIndexes);

  if (firstWordIndexes === undefined) {
    return;
  }
  if (secondWordIndexes === undefined) {
    return;
  }

  firstWordIndexes.forEach((index) => {
    findTextCoordinatesWithinGivenDistance(
      index_distinctText,
      secondWordIndexes,
      rawTextCoordinates,
      index,
      proximityCount,
      stringIds,
      matches,
    );
  });
  console.log("matches 30 ???:", matches);
  // }
}

function proximityOrHandler(
  rawTextCoordinates: TextCoordinates,
  ocr_texts: string[],
  firstProximityCondition: string,
  secondProximityCondition: string,
  proximityCount: number,
) {
  const matches = {} as TextCoordinates;
  const stringIds = new Set() as Set<number>;

  processProximitySearchTerms(
    firstProximityCondition.match(/\b[^ ]+\b/g),
    ocr_texts,
    rawTextCoordinates,
    proximityCount,
    stringIds,
    matches,
  );

  processProximitySearchTerms(
    secondProximityCondition.match(/\b[^ ]+\b/g),
    ocr_texts,
    rawTextCoordinates,
    proximityCount,
    stringIds,
    matches,
  );

  return matches;
}

function proximityAndHandler(
  rawTextCoordinates: TextCoordinates,
  ocr_texts: string[],
  firstProximityCondition: string,
  secondProximityCondition: string,
  proximityCount: number,
) {
  const matches = {} as TextCoordinates;
  const stringIds = new Set() as Set<number>;

  const firstMatches = {} as TextCoordinates;
  processProximitySearchTerms(
    firstProximityCondition.match(/\b[^ ]+\b/g),
    ocr_texts,
    rawTextCoordinates,
    proximityCount,
    stringIds,
    firstMatches,
  );

  const secondMatches = {} as TextCoordinates;
  processProximitySearchTerms(
    secondProximityCondition.match(/\b[^ ]+\b/g),
    ocr_texts,
    rawTextCoordinates,
    proximityCount,
    stringIds,
    secondMatches,
  );

  if (
    Object.keys(firstMatches).length === 0 ||
    Object.keys(secondMatches).length === 0
  ) {
    return matches;
  }

  for (const [key, value] of Object.entries(firstMatches)) {
    if (!matches[key]) {
      matches[key] = [];
    }
    value.forEach((v) => matches[key].push(v));
  }
  for (const [key, value] of Object.entries(secondMatches)) {
    if (!matches[key]) {
      matches[key] = [];
    }
    value.forEach((v) => matches[key].push(v));
  }

  return matches;
}

function proximityHandler(
  rawTextCoordinates: TextCoordinates,
  ocr_texts: string[],
  firstProximityCondition: string,
  proximityCount: number,
) {
  const matches = {} as TextCoordinates;
  const stringIds = new Set() as Set<number>;

  processProximitySearchTerms(
    firstProximityCondition.match(/\b[^ ]+\b/g),
    ocr_texts,
    rawTextCoordinates,
    proximityCount,
    stringIds,
    matches,
  );

  return matches;
}

export function filterTextCoordinates(
  rawTextCoordinates: TextCoordinates,
  ocr_texts: string[],
  formattedSearchTerms: string,
) {
  console.log("==========");
  // console.log("000 rawTextCoordinates", rawTextCoordinates);
  // console.log("000 ocr_texts", ocr_texts);
  console.log("000 formattedSearchTerms", formattedSearchTerms);

  const quotedRegex = /^.*?"(.*?)".*?$/;
  const quotedMatches = formattedSearchTerms.match(quotedRegex);
  const proximityRegex = /"(.*?)"~(\d+)/;
  const proximityMatches = formattedSearchTerms.match(proximityRegex);
  const proximityOrRegex = /("(.*?)"~(\d+)) OR ("(.*?)"~(\d+))/;
  const proximityOrMatches = formattedSearchTerms.match(proximityOrRegex);
  const proximityAndRegex = /("(.*?)"~(\d+)) AND ("(.*?)"~(\d+))/;
  const proximityAndMatches = formattedSearchTerms.match(proximityAndRegex);
  const proximityCountFactor = 1.5;

  // NOTE: sometimes solr NEAR queries do not match the strings in the ALTO
  // files. rob* NEAR5 kennedy has result in SOLR even though Robert has
  // string_id 1798 and Kennedy is 1806 for GRH/1924/12/14_01/MASTER/0038.
  // In order to get text coordinate when string id distance is larger than
  // NEAR, we re-run the proxmity handler if there are no matches with a
  // larger proximityCount.

  // handle (a OR b) NEAR c
  if (proximityOrMatches) {
    const proximityCount = Number(proximityOrMatches[3]);
    let matches = proximityOrHandler(
      rawTextCoordinates,
      ocr_texts,
      proximityOrMatches[2],
      proximityOrMatches[5],
      proximityCount,
    );

    if (Object.keys(matches).length === 0) {
      matches = proximityOrHandler(
        rawTextCoordinates,
        ocr_texts,
        proximityOrMatches[2],
        proximityOrMatches[5],
        proximityCount * proximityCountFactor,
      );
    }

    return matches;

    // handle (a AND b) NEAR c
  } else if (proximityAndMatches) {
    const proximityCount = Number(proximityAndMatches[3]);
    let matches = proximityAndHandler(
      rawTextCoordinates,
      ocr_texts,
      proximityAndMatches[2],
      proximityAndMatches[5],
      proximityCount,
    );

    if (Object.keys(matches).length === 0) {
      matches = proximityAndHandler(
        rawTextCoordinates,
        ocr_texts,
        proximityAndMatches[2],
        proximityAndMatches[5],
        proximityCount * proximityCountFactor,
      );
    }

    return matches;
  } else if (proximityMatches) {
    const proximityCount = Number(proximityMatches[2]);
    let matches = proximityHandler(
      rawTextCoordinates,
      ocr_texts,
      proximityMatches[1],
      proximityCount,
    );

    if (Object.keys(matches).length === 0) {
      matches = proximityHandler(
        rawTextCoordinates,
        ocr_texts,
        proximityMatches[1],
        proximityCount * proximityCountFactor,
      );
    }

    return matches;

    // handle quoted search terms
  } else if (quotedMatches) {
    const matches = {} as TextCoordinates;

    const quotedSearchTerms = quotedMatches[1].match(/\b[^ ]+\b/g);
    console.log("quotedSearchTerms 0 ???:", quotedSearchTerms);

    if (quotedSearchTerms) {
      const {
        quoteSearchTerm_indexes,
        index_distinctText,
        quotedDistinctTexts,
      } = createTextPositionIndexes(
        quotedSearchTerms,
        ocr_texts,
        rawTextCoordinates,
      );

      const firstWordIndexes = quoteSearchTerm_indexes[quotedSearchTerms[0]];
      firstWordIndexes.forEach((index) => {
        // if all quoted search terms have sequential pageID, add coordinations
        // to matches object
        const valid = validateSequentialPageIds(
          quotedSearchTerms as string[],
          quoteSearchTerm_indexes,
          index,
        );

        if (valid) {
          processSequentialSearchTerms(
            quotedSearchTerms as string[],
            index_distinctText,
            rawTextCoordinates,
            index,
            matches,
          );
        }
      });

      // removed quoted search words from ocr_texts
      ocr_texts = ocr_texts.filter((n) => !quotedDistinctTexts.includes(n));
    }

    ocr_texts.forEach((text) => {
      if (rawTextCoordinates[text]) {
        matches[text] = rawTextCoordinates[text];
      }
    });

    return matches;
  } else {
    const matches = {} as TextCoordinates;

    ocr_texts.forEach((text) => {
      if (rawTextCoordinates[text]) {
        matches[text] = rawTextCoordinates[text];
      }
    });

    return matches;
  }
}
