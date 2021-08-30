import { baseFileUrl } from "config";

export const init = async (db) => {
  await loadTables([
    "constituencies",
    "general-election",
    "eu-referendum",
  ], db);
  await load2015Election(db);
};

export const loadTables = (tables, db) => {
  return Promise.all(tables.map(async (table) => {
    const resp = await fetch(`${baseFileUrl}/tables/${table}.sql`);

    if (resp.status >= 400) {
      throw fileNotFound(`${table}.sql`);
    }

    const script = await resp.text();
    db.exec(script);
  }));
};

export const load2015Election = async (db) => {
  const { data } = await loadCsv("ge-2015");
  data.map((item) => {
    db.exec(
      `INSERT OR IGNORE INTO constituencies(ons_id, ons_region_id, constituency_name) VALUES(?, ?, ?)`,
      [item.ons_id, item.ons_region_id, item.constituency_name],
    );
  });
};

export const loadCsv = async (name) => {
  const resp = await fetch(`${baseFileUrl}/data/${name}.csv`);

  if (resp.status >= 400) {
    throw fileNotFound(`${name}.csv`);
  }

  const blob = await resp.text();

  return Papa.parse(blob, {
    header: true,
    skipEmptyLines: true,
  });
};

const fileNotFound = (file) => new Error(`File ${file} not found`);
