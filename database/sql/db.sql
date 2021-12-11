DROP TABLE IF EXISTS notifications cascade;
DROP TABLE IF EXISTS status cascade;

-- GENERAL TABLES
CREATE TABLE IF NOT EXISTS status (
	id double precision PRIMARY KEY,
	status varchar(25) UNIQUE
);

CREATE TABLE IF NOT EXISTS notifications (
    id serial PRIMARY KEY,

    title varchar(50) NOT NULL,
    description varchar(300) NOT NULL,
    priority int NOT NULL,
    action varchar(20) NOT NULL,

    received boolean NOT NULL,
    readed boolean NOT NULL,
    
    _to int NOT NULL,
    _from int NOT NULL,

    status double precision NOT NULL,
	audit_trail json NOT NULL,

    CONSTRAINT fk_status_notifications
        FOREIGN KEY (status)
        REFERENCES status(id)
);