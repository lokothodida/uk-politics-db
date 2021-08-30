export const loadTables = (tables, db) => {
  return Promise.all(tables.map(async (table) => {
    const resp = await fetch(`/tables/${table}.sql`);

    if (resp.status >= 400) {
      throw new Error(`File ${table}.sql not found`);
    }

    const script = await resp.text();
    db.exec(script);
  }));
};
