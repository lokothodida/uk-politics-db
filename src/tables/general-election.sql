CREATE TABLE general_elections(
    ons_id TEXT,
    date TEXT,
    party TEXT,
    candidate TEXT,
    votes INTEGER,
    primary key (ons_id, date, candidate)
);

CREATE VIEW general_election_seats_won AS
SELECT
    election.ons_id,
    constituency_name,
    date,
    party as winning_party,
    votes - (SELECT MAX(votes)
        FROM general_elections
        WHERE
            ons_id = election.ons_id AND
            date = election.date AND
            NOT (party = election.party)
    ) as majority
FROM
    general_elections as election,
    constituencies
WHERE
    election.ons_id = constituencies.ons_id AND
    election.votes = (
        SELECT MAX(votes)
        FROM general_elections
        WHERE ons_id = election.ons_id AND date = election.date
    );
