import * as mysql from "mysql2/promise";

export type MysqlPage = {
  id: number;
  text_coordinates_file_path: string;
  image_file_path: string;
  pdf_file_path: string;
  issue_id: number;
  order: number;
};

type MysqlPageDetails = {
  id: number;
  text_coordinates_file_path: string;
  image_file_path: string;
  pdf_file_path: string;
  issue_id: number;
  order: number;
  order_label: string;
  date: string;
  page_count: number;
  title: string;
};

export type MysqlIssueDetails = {
  id: number;
  image_file_path: string;
  pdf_file_path: string;
  text_coordinates_file_path: string;
  issue_id: number;
  order: number;
  order_label: number;
  date: string;
  page_count: number;
  title: string;
  width: number;
  height: number;
};

//==================
// mysql
//==================

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

//==================
// search page
//==================

export async function getPagesByIds(page_ids: number[]) {
  const idsString = page_ids.join(", ");
  const [rows] = await pool.execute(
    `
    SELECT pages.id, image_file_path, pdf_file_path, text_coordinates_file_path,
    issue_id, pages.order,
    publications.title, issues.date
    FROM pages
    JOIN issues ON issues.id = pages.issue_id
    JOIN publications ON publications.id = issues.publication_id
    WHERE pages.id in (${idsString});
    `,
    [],
  );

  return rows as MysqlPage[];
}

//==================
// details page
//==================

export async function getPageById(page_id: number) {
  const [rows] = await pool.execute(
    `
    SELECT pages.id, pages.image_file_path, pages.pdf_file_path,
    pages.text_coordinates_file_path,
    pages.issue_id, pages.order, pages.order_label,
    issues.date, issues.page_count,
    publications.title, pages.width, pages.height
    FROM pages
    JOIN issues on issues.id = pages.issue_id
    JOIN publications on publications.id = issues.publication_id
    WHERE pages.id = ?;
    `,
    [page_id],
  );

  return rows[0] as MysqlPageDetails;
}

export async function getIssueById(issue_id: number) {
  const [rows] = await pool.execute(
    `
    SELECT pages.id, pages.image_file_path, pages.pdf_file_path,
    pages.text_coordinates_file_path,
    pages.issue_id, pages.order, pages.order_label,
    issues.date, issues.page_count,
    publications.title, pages.width, pages.height
    FROM pages
    JOIN issues on issues.id = pages.issue_id
    JOIN publications on publications.id = issues.publication_id
    WHERE issues.id = ?;
    `,
    [issue_id],
  );

  return rows as MysqlIssueDetails[];
}

export async function getPrevNextIssues(issue_id: number) {
  const [rows] = await pool.execute(
    `
      SELECT
      (SELECT id FROM issues t2
      WHERE t2.date < t1.date
      ORDER BY date DESC LIMIT 1) as previous_issue,
      (SELECT id FROM issues t3
      WHERE t3.date > t1.date
      ORDER BY date ASC LIMIT 1) as next_issue
      FROM issues t1
      WHERE id = ?;
    `,
    [issue_id],
  );
  return rows[0];
}

export async function getPrevNextPages(page_id: number) {
  const [rows] = await pool.execute(
    `
    SELECT t1.issue_id,
    (SELECT t2.id FROM pages t2
    WHERE t2.order < t1.order AND t2.issue_id = t1.issue_id
    ORDER BY t2.order DESC LIMIT 1) as previous_page,
    (SELECT t3.id FROM pages t3
    WHERE t3.order > t1.order AND t3.issue_id = t1.issue_id
    ORDER BY t3.order ASC LIMIT 1) as next_page
    FROM pages t1
    WHERE id = ?;
    `,
    [page_id],
  );
  return rows[0];
}

export async function getIssueFirstPage(issue_id: number) {
  const [rows] = await pool.execute(
    `
    SELECT id
    FROM pages
    WHERE issue_id = ?
    ORDER BY \`order\` ASC
    LIMIT 1;
    `,
    [issue_id],
  );
  return rows[0];
}

export async function fetchPublications() {
  const [rows] = await pool.execute(
    `
    SELECT id, title
    FROM publications;
    `,
    [],
  );
  return rows;
}
