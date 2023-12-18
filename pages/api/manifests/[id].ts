// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getIssueById, type MysqlIssueDetails } from "src/demo/mysql_utils";
import { editBaseManifest } from "src/demo/create_manifest";
import { manifests } from "src/demo/ca_manifests";
import { type TextCoordinates } from "src/demo/page_files_utils";

import {
  readTextCoordinatesFile,
  filterTextCoordinates,
} from "src/demo/page_files_utils";

import {
  searchIssueBySearchTerms,
  solrClient,
  formatSearchTerms,
  formatDistinctText,
  searchDistinctText,
} from "src/demo/solr_utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const id = req.query.id;
  if (id == undefined || typeof id !== "string") {
    return res.status(200).json({ errror: "missing id" });
  }

  const searchTerm = req.query.q;
  if (searchTerm == undefined || typeof searchTerm !== "string") {
    return res.status(200).json({ errror: "missing search term" });
  }

  const issue_id = Number(id);
  const baseManifest = structuredClone(manifests[issue_id]);

  // connect to mysql to get data for all pages in an issue
  const issue = await getIssueById(issue_id);

  const issuePagesGroupedByPageOrder: { [k: number]: MysqlIssueDetails } = {};
  const pageId_pageOrder = {};
  issue.forEach((page) => {
    issuePagesGroupedByPageOrder[page.order] = page;
    pageId_pageOrder[page.id] = page.order;
  });

  // connect to solr to find all pages in an issue that has a search term
  const client = solrClient();
  const formattedSearchTerms = formatSearchTerms(searchTerm);
  const { rows } = await searchIssueBySearchTerms(
    client,
    formattedSearchTerms,
    issue_id,
    false,
  );

  // connect to solr and get all ocr text that matches the search term
  const formattedDistinctText = formatDistinctText(searchTerm);
  const distinctTexts = await searchDistinctText(client, formattedDistinctText);

  // get the text coordinated that match the search term
  const coordinatesByPageId = {} as { [k: string]: TextCoordinates };
  rows.forEach((row) => {
    const rawTextCoordinates = readTextCoordinatesFile(
      issuePagesGroupedByPageOrder[pageId_pageOrder[row.page_id]],
    );
    const coordinates = filterTextCoordinates(
      rawTextCoordinates,
      distinctTexts,
      formattedSearchTerms,
    );
    coordinatesByPageId[row.page_id] = coordinates;
  });

  // create manifest
  const revisedManifest = editBaseManifest(
    baseManifest,
    issue_id,
    searchTerm,
    issuePagesGroupedByPageOrder,
    coordinatesByPageId,
  );

  return res.status(200).json(revisedManifest);
}
