-- Active: 1795199721558@@127.0.0.1@5432@election
CREATE TABLE polling_stations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE ballot_votes (
    polling_station_id UUID NOT NULL,
    candidate_number INTEGER NOT NULL,
    count INTEGER NOT NULL CHECK (count >= 0),

    PRIMARY KEY (polling_station_id, candidate_number),

    FOREIGN KEY (polling_station_id)
        REFERENCES polling_stations(id)
);

SELECT * FROM polling_stations

SELECT * FROM ballot_votes