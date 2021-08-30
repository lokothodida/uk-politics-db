import { baseFileUrl } from "config";

export const init = async (db) => {
  await loadTables([
    "constituencies",
    "general-election",
    "eu-referendum",
    "parties",
  ], db);
  await Promise.all([
    load2015Election(db),
    load2017Election(db),
    load2019Election(db),
    loadParties(db),
  ]);
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

    db.exec(
      `INSERT INTO general_elections(ons_id, date, party, candidate, votes) VALUES(?, ?, ?, ?, ?)`,
      [
        item.ons_id,
        "2015",
        item.party_abbreviation,
        `${item.firstname} ${item.surname}`,
        parseInt(item.votes, 10),
      ],
    );
  });
};

export const load2017Election = async (db) => {
  const abbreviations = {
    con: "Con",
    lab: "Lab",
    ld: "LD",
    ukip: "UKIP",
    green: "Green",
    snp: "SNP",
    pc: "PC",
    dup: "DUP",
    sf: "SF",
    sdlp: "SDLP",
    uup: "UUP",
    alliance: "Alliance",
    other: "Ind",
  };

  const { data } = await loadCsv("ge-2017");

  data.map((item) => {
    for (const abbr in abbreviations) {
      const votes = parseInt(item[abbr], 10);
      if (isNaN(votes)) {
        continue;
      }
      db.exec(
        `INSERT INTO general_elections(ons_id, date, party, candidate, votes) VALUES(?, ?, ?, ?, ?)`,
        [
          item.ons_id,
          "2017",
          abbreviations[abbr],
          `${abbreviations[abbr]}: TO ADD NAME`,
          votes,
        ],
      );
    }
  });
};

export const load2019Election = async (db) => {
  const { data } = await loadCsv("ge-2019");
  data.map((item) => {
    db.exec(
      `INSERT INTO general_elections(ons_id, date, party, candidate, votes) VALUES(?, ?, ?, ?, ?)`,
      [
        item.ons_id,
        "2019",
        item.party_abbreviation,
        `${item.firstname} ${item.surname}`,
        parseInt(item.votes, 10),
      ],
    );
  });
};

export const loadParties = async (db) => {
  const { data } = await loadCsv("parties");
  data.map((item) => {
    db.exec(
      `INSERT INTO parties(id, name, nickname, colour) VALUES(?, ?, ?, ?)`,
      [
        item.id,
        item.name,
        item.nickname,
        item.colour,
      ],
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
