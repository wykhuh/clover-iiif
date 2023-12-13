const solr = require("solr-client");

//==================
// solr
//==================

export function solrClient() {
  return solr.createClient({ core: process.env.SOLR_CORE });
}

//==================
// search page by keyword
//==================

// convert search terms entered by users into SOLR syntax
export function formatSearchTerms(searchTerms: string): string {
  if (searchTerms.match(/\((.*?) (OR|AND) (.*?)\) NEAR([0-9]+) (.*)/)) {
    const matches = searchTerms.match(
      /\((.*?) (OR|AND) (.*?)\) NEAR([0-9]+) (.*)/,
    );
    if (matches) {
      return `{!complexphrase inOrder=true}"${matches[1]} ${matches[5]}"~${matches[4]} ${matches[2]} "${matches[3]} ${matches[5]}"~${matches[4]}`;
    }
  } else if (searchTerms.match(/ NEAR[0-9]+ /)) {
    const matches = searchTerms.match(/ NEAR([0-9]+) /);
    if (matches) {
      return (
        '{!complexphrase inOrder=true}"' +
        searchTerms.replace(/ NEAR([0-9]+) /, " ") +
        '"~' +
        matches[1]
      );
    }
  }

  return searchTerms;
}

export function searchPagesBySearchTermsQuery(
  client: any,
  formattedSearchTerm: string,
  fields: string[],
  limit: number,
  defaultField: string,
  highlight = false,
  offset: number,
  publicationId?: number,
  dateRange?: string,
) {
  const query = client
    .query()
    .q(formattedSearchTerm)
    .fl(fields)
    .rows(limit)
    .df(defaultField)
    .start(offset)
    .fq({ field: "doc_type", value: "pages" });

  if (publicationId) {
    query.fq({ field: "publication_id", value: publicationId });
  }
  if (dateRange) {
    query.fq({ field: "publication_date", value: dateRange });
  }

  if (highlight) {
    const highlightOptions = {
      on: true,
      fl: defaultField,
      //  fragsize: 100,
    };
    query.hl(highlightOptions);
  }

  return query;
}

export async function searchPagesBySearchTerms(
  client: any,
  formattedSearchTerms: string,
  highlight: boolean,
  offset: number,
  publicationId?: number,
  dateRange?: string,
): Promise<{ page_ids: number[]; count: number; rows: SolrSearch[] }> {
  const query = searchPagesBySearchTermsQuery(
    client,
    formattedSearchTerms,
    ["page_id", "id"],
    20,
    "ocr_content",
    highlight,
    offset,
    publicationId,
    dateRange,
  );

  const response = await client.search(query);
  console.log("search terms response >>>", response);

  return {
    page_ids: response["response"]["docs"].map(
      (row: SolrSearchDoc) => row["page_id"][0],
    ),
    count: response["response"]["numFound"],
    rows: response["response"]["docs"].map((row: SolrSearchDoc) => {
      const data = {} as any;

      if (highlight) {
        const content = response["highlighting"][row["id"]]["ocr_content"];
        if (content) {
          data["solr_highlighting"] = content[0];
        }
      }

      for (const property in row) {
        if (property != "id") {
          data[property] = row[property as keyof SolrSearchDoc][0];
        }
      }

      return data;
    }),
  };
}

export function searchPageBySearchTermsQuery(
  client: any,
  formattedSearchTerm: string,
  pageId: number,
  fields: string[],
  limit: number,
  defaultField: string,
  highlight = false,
) {
  const query = client
    .query()
    .q(formattedSearchTerm + " AND page_id: " + pageId)
    .fl(fields)
    .rows(limit)
    .df(defaultField)
    .start(0)
    .fq({ field: "doc_type", value: "pages" });

  if (highlight) {
    const highlightOptions = {
      on: true,
      fl: defaultField,
      //  fragsize: 100,
    };
    query.hl(highlightOptions);
  }

  return query;
}

export async function searchPageBySearchTerms(
  client: any,
  formattedSearchTerms: string,
  pageId: number,
  highlight: boolean,
): Promise<{ count: number; row: SolrSearchDetails }> {
  const query = searchPageBySearchTermsQuery(
    client,
    formattedSearchTerms,
    pageId,
    ["page_id", "id", "ocr_content"],
    20,
    "ocr_content",
    highlight,
  );

  const response = await client.search(query);
  console.log("search terms response >>>", response);

  return {
    count: response["response"]["numFound"],
    row: response["response"]["docs"].map((row: SolrSearchDetailsDoc) => {
      const data = {} as any;

      if (highlight) {
        const content = response["highlighting"][row["id"]]["ocr_content"];
        if (content) {
          data["solr_highlighting"] = content[0];
        }
      }

      for (const property in row) {
        if (property != "id") {
          data[property] = row[property as keyof SolrSearchDetailsDoc][0];
        }
      }

      return data;
    })[0],
  };
}

export function searchIssueBySearchTermsQuery(
  client: any,
  formattedSearchTerm: string,
  issueId: number,
  fields: string[],
  limit: number,
  defaultField: string,
  highlight = false,
) {
  const query = client
    .query()
    .q(formattedSearchTerm + " AND issue_id: " + issueId)
    .fl(fields)
    .rows(limit)
    .df(defaultField)
    .start(0)
    .fq({ field: "doc_type", value: "pages" });

  if (highlight) {
    const highlightOptions = {
      on: true,
      fl: defaultField,
      //  fragsize: 100,
    };
    query.hl(highlightOptions);
  }

  return query;
}

export async function searchIssueBySearchTerms(
  client: any,
  formattedSearchTerms: string,
  issueId: number,
  highlight: boolean,
): Promise<{ count: number; row: SolrSearchDetails }> {
  const query = searchIssueBySearchTermsQuery(
    client,
    formattedSearchTerms,
    issueId,
    ["issue_id", "issue_idno", "page_id"],
    20,
    "ocr_content",
    highlight,
  );

  const response = await client.search(query);
  console.log("search terms response >>>", response);

  return {
    count: response["response"]["numFound"],
    rows: response["response"]["docs"].map((row: SolrSearchDetailsDoc) => {
      const data = {} as any;

      if (highlight) {
        const content = response["highlighting"][row["id"]]["ocr_content"];
        if (content) {
          data["solr_highlighting"] = content[0];
        }
      }

      for (const property in row) {
        if (property != "id") {
          data[property] = row[property as keyof SolrSearchDetailsDoc][0];
        }
      }

      return data;
    }),
  };
}

//==================
// find matching distinct text
//==================

// convert search terms entered by users into SOLR syntax
export function formatDistinctText(searchTerms: string): string {
  if (searchTerms.match(/\((.*?) (OR|AND) (.*?)\) NEAR([0-9]+) (.*)/)) {
    const matches = searchTerms.match(
      /\((.*?) (OR|AND) (.*?)\) NEAR([0-9]+) (.*)/,
    );
    if (matches) {
      return `${matches[1]} ${matches[3]} ${matches[5]}`;
    }
  } else if (searchTerms.includes('"')) {
    return searchTerms.replaceAll('"', "");
  } else if (searchTerms.includes(" OR ")) {
    return searchTerms.replaceAll(" OR ", " ");
  } else if (searchTerms.includes(" AND ")) {
    return searchTerms.replaceAll(" AND ", " ");
  } else if (searchTerms.includes(" NOT ")) {
    return searchTerms.replaceAll(/ NOT .+/g, "");
  } else if (searchTerms.match(/ NEAR[0-9]+ /)) {
    const matches = searchTerms.match(/ NEAR[0-9]+ /);
    if (matches) {
      return searchTerms.replace(/ NEAR[0-9]+ /, " ");
    }
  }

  return searchTerms;
}

function searchDistinctTextQuery(
  client: any,
  formattedSearchTerms: string,
  fields: string[],
  limit: number,
  defaultField: string,
) {
  const query = client
    .query()
    .q(formattedSearchTerms)
    .fl(fields)
    .rows(limit)
    .df(defaultField)
    .fq({ field: "doc_type", value: "ocr_text" });

  return query;
}

export async function searchDistinctText(
  client: any,
  formattedSearchTerms: string,
) {
  const query = searchDistinctTextQuery(
    client,
    formattedSearchTerms,
    ["text"],
    100000,
    "text",
  );
  const response = await client.search(query);
  console.log("distinct text response >>>", response);

  return response["response"]["docs"].map(
    (row: SolrDistinctTextDoc) => row["text"][0],
  );
}
