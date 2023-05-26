--SET lc_messages TO 'en_US.UTF-8';
DROP TABLE IF EXISTS payment;
DROP TABLE IF EXISTS credit_card_order;
DROP TABLE IF EXISTS credit_card;
DROP TABLE IF EXISTS money_account;
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS account;
DROP TABLE IF EXISTS users;
DROP TYPE IF EXISTS role_type;
DROP TYPE IF EXISTS payment_status_type;
DROP TYPE IF EXISTS block_type;

CREATE TABLE users
(
    id           SERIAL PRIMARY KEY,
    name         VARCHAR(30),
    email        VARCHAR(50) UNIQUE,
    phone_number VARCHAR(15),
    role         VARCHAR,
    password     varchar,
    is_blocked   VARCHAR
);

CREATE TABLE account
(
    id                   SERIAL PRIMARY KEY,
    number               VARCHAR UNIQUE,
    account_name         VARCHAR,
    IBAN                 VARCHAR(10),
    date_of_registration TIMESTAMP,
    balance_amount       DOUBLE PRECISION,
    is_blocked           VARCHAR,
    user_id              INT REFERENCES users on delete cascade
);

CREATE TABLE IF NOT EXISTS credit_card
(
    id                SERIAL PRIMARY KEY,
    number            VARCHAR(12) UNIQUE,
    cvv               VARCHAR(3),
    expire_date       VARCHAR(7),
    account_id        INT REFERENCES account on delete cascade
);

CREATE TABLE IF NOT EXISTS payment
(
    id                  SERIAL PRIMARY KEY,
    number              INT UNIQUE,
    amount              DOUBLE PRECISION,
    assignment          VARCHAR(100),
    time                TIMESTAMP,
    status              VARCHAR,
    sender_account_id   INT REFERENCES account on delete cascade,
    receiver_account_id INT REFERENCES account on delete cascade
);

------------------
-- INSERT INTO users VALUES(DEFAULT, 'Volodymyr Kyryliuk', 'kirilyukvolodimir2003@gmail.com', '1234567890', 'ADMIN',
--                            '33275a8aa48ea918bd53a9181aa975f15ab0d0645398f5918a006d08675c1cb27d5c645dbd084eee56e675e25ba4019f2ecea37ca9e2995b49fcb12c096a032e',
--                          'ACTIVE');
-- INSERT INTO account VALUES(DEFAULT, '0001', 'Volodymyr Kyryliuk', 'UA0001', '2021-08-24 10:23:54', 1000.00, 'ACTIVE', 1);
-- ------------------
--
--
-- INSERT INTO users VALUES(DEFAULT, 'Petro Petrov', 'petrov@gmail.com', '1234567891', 'USER',
--                          '33275a8aa48ea918bd53a9181aa975f15ab0d0645398f5918a006d08675c1cb27d5c645dbd084eee56e675e25ba4019f2ecea37ca9e2995b49fcb12c096a032e',
--                          'ACTIVE');
-- INSERT INTO account VALUES(DEFAULT, '0010', 'Ivan Petrov', 'UA0010', '2022-08-24 10:23:54', 2000.00, 'ACTIVE', 2);
-- INSERT INTO account VALUES(DEFAULT, '0011', 'Petro Petrov', 'UA0011', '2022-09-24 10:24:54', 1000.00, 'ACTIVE', 2);
-- INSERT INTO credit_card VALUES(DEFAULT, 'CC0011', '111', '2023-03', 3);
----------------------