CREATE TABLE eu_referendum_constituency_results(
    ons_id TEXT,
    leave_estimate FLOAT,
    known_result BOOL,
    known_leave FLOAT,
    leave_figure_to_use FLOAT,
    primary key (ons_id)
);
