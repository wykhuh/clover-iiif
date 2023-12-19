import * as solr from "solr-client";

import {
  searchPagesBySearchTermsQuery,
  formatSearchTerms,
  formatDistinctText,
} from "./solr_utils";

describe("searchPagesBySearchTermsQuery", () => {
  const client = solr.createClient();
  const fields = ["id"];
  const limit = 10;
  const defaultField = "content";
  const offset = 0;
  const highlight = false;

  it("returns search query if one word", () => {
    const searchTerms = "dog";
    const formattedSearchTerms = formatSearchTerms(searchTerms);
    const result = searchPagesBySearchTermsQuery(
      client,
      formattedSearchTerms,
      fields,
      limit,
      defaultField,
      highlight,
      offset,
    );
    const expected = [
      "q=dog",
      "fl=id",
      "rows=10",
      "df=content",
      "start=0",
      "fq=doc_type%3Apages",
    ];

    expect(result["parameters"]).toEqual(expected);
  });

  it("returns search query if (x OR y) NEAR z", () => {
    const searchTerms = "(dog OR mouse) NEAR5 cat";
    const formattedSearchTerms = formatSearchTerms(searchTerms);
    const result = searchPagesBySearchTermsQuery(
      client,
      formattedSearchTerms,
      fields,
      limit,
      defaultField,
      highlight,
      offset,
    );
    const expected = [
      "q=%7B!complexphrase%20inOrder%3Dtrue%7D%22dog%20cat%22~5%20OR%20%22mouse%20cat%22~5",
      "fl=id",
      "rows=10",
      "df=content",
      "start=0",
      "fq=doc_type%3Apages",
    ];
    expect(result["parameters"]).toEqual(expected);
  });

  it("returns search query if highlight is true", () => {
    const searchTerms = "dog";
    const formattedSearchTerms = formatSearchTerms(searchTerms);
    const highlight = true;
    const result = searchPagesBySearchTermsQuery(
      client,
      formattedSearchTerms,
      fields,
      limit,
      defaultField,
      highlight,
      offset,
    );
    const expected = [
      "q=dog",
      "fl=id",
      "rows=10",
      "df=content",
      "start=0",
      "fq=doc_type%3Apages",
      "hl=true",
      "hl.fl=content",
      "hl.simple.pre=<em>",
      "hl.simple.post=<%2Fem>",
    ];

    expect(result["parameters"]).toEqual(expected);
  });
});

describe("formatSearchTerms", () => {
  it("returns original search terms if one word", () => {
    const searchTerms = "dog";
    const result = formatSearchTerms(searchTerms);
    const expected = "dog";

    expect(result).toEqual(expected);
  });

  it("returns original search terms if multiple words", () => {
    const searchTerms = "dog cat";
    const result = formatSearchTerms(searchTerms);
    const expected = "dog cat";

    expect(result).toEqual(expected);
  });

  it("returns quoted search term if there are quotes", () => {
    const searchTerms = '"dog cat" mouse';
    const result = formatSearchTerms(searchTerms);
    const expected = '"dog cat" mouse';

    expect(result).toEqual(expected);
  });

  it("returns search terms with AND if AND", () => {
    const searchTerms = "dog AND cat AND mouse";
    const result = formatSearchTerms(searchTerms);
    const expected = "dog AND cat AND mouse";

    expect(result).toEqual(expected);
  });

  it("returns search terms with OR if OR", () => {
    const searchTerms = "dog OR cat OR mouse";
    const result = formatSearchTerms(searchTerms);
    const expected = "dog OR cat OR mouse";

    expect(result).toEqual(expected);
  });

  it("returns search terms with NOT if NOT", () => {
    const searchTerms = "dog NOT cat NOT mouse";
    const result = formatSearchTerms(searchTerms);
    const expected = "dog NOT cat NOT mouse";

    expect(result).toEqual(expected);
  });

  it("returns search terms with * if *", () => {
    const searchTerms = "dog* cat";
    const result = formatSearchTerms(searchTerms);
    const expected = "dog* cat";

    expect(result).toEqual(expected);
  });

  it("returns search terms with ~distance if NEAR", () => {
    const searchTerms = "dog NEAR5 cat";
    const result = formatSearchTerms(searchTerms);
    const expected = '{!complexphrase inOrder=true}"dog cat"~5';

    expect(result).toEqual(expected);
  });

  it("returns search query if (x OR y) NEAR z", () => {
    const searchTerms = "(dog OR mouse) NEAR5 cat";
    const result = formatSearchTerms(searchTerms);
    const expected =
      '{!complexphrase inOrder=true}"dog cat"~5 OR "mouse cat"~5';

    expect(result).toEqual(expected);
  });

  it("returns search query if (x AND y) NEAR z", () => {
    const searchTerms = "(dog AND mouse) NEAR5 cat";
    const result = formatSearchTerms(searchTerms);
    const expected =
      '{!complexphrase inOrder=true}"dog cat"~5 AND "mouse cat"~5';

    expect(result).toEqual(expected);
  });
});

describe("formatDistinctText", () => {
  it("returns original search terms if one word", () => {
    const searchTerms = "dog";
    const result = formatDistinctText(searchTerms);
    const expected = "dog";

    expect(result).toEqual(expected);
  });

  it("returns original search terms if multiple words", () => {
    const searchTerms = "dog cat";
    const result = formatDistinctText(searchTerms);
    const expected = "dog cat";

    expect(result).toEqual(expected);
  });

  it("remove quotes from search terms if there are quotes", () => {
    const searchTerms = '"dog cat" mouse';
    const result = formatDistinctText(searchTerms);
    const expected = "dog cat mouse";

    expect(result).toEqual(expected);
  });

  it("remove AND from search terms if AND", () => {
    const searchTerms = "dog AND cat AND mouse";
    const result = formatDistinctText(searchTerms);
    const expected = "dog cat mouse";

    expect(result).toEqual(expected);
  });

  it("remove OR from search terms if OR", () => {
    const searchTerms = "dog OR cat OR mouse";
    const result = formatDistinctText(searchTerms);
    const expected = "dog cat mouse";

    expect(result).toEqual(expected);
  });

  it("remove NOT word from search terms if NOT", () => {
    const searchTerms = "dog NOT cat NOT mouse";
    const result = formatDistinctText(searchTerms);
    const expected = "dog";

    expect(result).toEqual(expected);
  });

  it("returns search terms with wildcard if wildcard", () => {
    const searchTerms = "dog* cat";
    const result = formatDistinctText(searchTerms);
    const expected = "dog* cat";

    expect(result).toEqual(expected);
  });

  it("remove NEAR from search terms if NEAR", () => {
    const searchTerms = "dog NEAR5 cat";
    const result = formatDistinctText(searchTerms);
    const expected = "dog cat";

    expect(result).toEqual(expected);
  });

  it("remove NEAR () OR if (x OR y) NEAR z", () => {
    const searchTerms = "(dog OR mouse) NEAR5 cat";
    const result = formatDistinctText(searchTerms);
    const expected = "dog mouse cat";

    expect(result).toEqual(expected);
  });

  it("remove NEAR () AND if (x AND y) NEAR z", () => {
    const searchTerms = "(dog AND mouse) NEAR5 cat";
    const result = formatDistinctText(searchTerms);
    const expected = "dog mouse cat";

    expect(result).toEqual(expected);
  });
});
