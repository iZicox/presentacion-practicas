-- =========================================================
-- SCHEMA.SQL — CRM FOR CLOUDFLARE D1
-- =========================================================
-- Tables:
--   1. SEGMENT
--   2. STATUS
--   3. CLIENT_TYPE
--   4. COMPANY
--   5. CONTACT
--   6. INTERACTION
--   7. PURCHASE
--   8. USERS
--
-- INTERACTION:
--   Simple commercial follow-up history.
--   No activity types, statuses or completion tracking.
--
-- PURCHASE:
--   Purchase date and amount per company.
--   No products, statuses or document types.
-- =========================================================


-- =========================================================
-- SEGMENTS
-- =========================================================

CREATE TABLE IF NOT EXISTS SEGMENT (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,

    NAME TEXT NOT NULL UNIQUE,
    DESCRIPTION TEXT,

    CREATED_AT TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- COMPANY / LEAD STATUSES
-- =========================================================

CREATE TABLE IF NOT EXISTS STATUS (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,

    NAME TEXT NOT NULL UNIQUE,
    DESCRIPTION TEXT,

    "ORDER" INTEGER NOT NULL DEFAULT 0,

    CREATED_AT TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- CLIENT TYPES
-- =========================================================

CREATE TABLE IF NOT EXISTS CLIENT_TYPE (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,

    NAME TEXT NOT NULL UNIQUE,
    DESCRIPTION TEXT,

    CREATED_AT TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- COMPANIES
-- =========================================================

CREATE TABLE IF NOT EXISTS COMPANY (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,

    NAME TEXT NOT NULL,

    SEGMENT_ID INTEGER,
    STATUS_ID INTEGER,
    CLIENT_TYPE_ID INTEGER,

    EMAIL TEXT,
    PHONE_NUMBER TEXT,
    WEB TEXT,

    NOTES TEXT,

    CREATED_AT TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UPDATED_AT TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (SEGMENT_ID)
        REFERENCES SEGMENT(ID)
        ON DELETE SET NULL,

    FOREIGN KEY (STATUS_ID)
        REFERENCES STATUS(ID)
        ON DELETE SET NULL,

    FOREIGN KEY (CLIENT_TYPE_ID)
        REFERENCES CLIENT_TYPE(ID)
        ON DELETE SET NULL
);


-- =========================================================
-- CONTACTS
-- People associated with a company.
-- COMPANY_ID is a foreign key, not part of the primary key.
-- =========================================================

CREATE TABLE IF NOT EXISTS CONTACT (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,

    COMPANY_ID INTEGER NOT NULL,

    FIRST_NAME TEXT NOT NULL,
    LAST_NAME TEXT,
    JOB_TITLE TEXT,

    EMAIL TEXT,
    PHONE_NUMBER TEXT,

    NOTES TEXT,

    CREATED_AT TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UPDATED_AT TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (COMPANY_ID)
        REFERENCES COMPANY(ID)
        ON DELETE CASCADE
);


-- =========================================================
-- INTERACTIONS
-- Simple commercial follow-up history.
--
-- COMPANY_ID: required company.
-- CONTACT_ID: optional contact.
-- DATE: interaction date.
-- DESCRIPTION: main interaction content.
-- NOTES: optional additional observations.
-- =========================================================

CREATE TABLE IF NOT EXISTS INTERACTION (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,

    COMPANY_ID INTEGER NOT NULL,
    CONTACT_ID INTEGER,

    DATE TEXT NOT NULL,

    DESCRIPTION TEXT NOT NULL,
    NOTES TEXT,

    CREATED_AT TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UPDATED_AT TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (COMPANY_ID)
        REFERENCES COMPANY(ID)
        ON DELETE CASCADE,

    FOREIGN KEY (CONTACT_ID)
        REFERENCES CONTACT(ID)
        ON DELETE SET NULL
);


-- =========================================================
-- PURCHASES
-- Purchase date and amount per company.
--
-- AMOUNT_CENTS:
--   EUR 250.50 is stored as 25050.
--
-- COMPANY_ID is a foreign key, not part of the primary key.
-- =========================================================

CREATE TABLE IF NOT EXISTS PURCHASE (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,

    COMPANY_ID INTEGER NOT NULL,

    DATE TEXT NOT NULL,

    AMOUNT_CENTS INTEGER NOT NULL
        CHECK (AMOUNT_CENTS >= 0),

    CREATED_AT TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (COMPANY_ID)
        REFERENCES COMPANY(ID)
        ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    email TEXT COLLATE NOCASE NOT NULL UNIQUE,

    password_hash TEXT NOT NULL,

    is_active INTEGER NOT NULL DEFAULT 1
        CHECK (is_active IN (0, 1)),

    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- COMPANY INDEXES
-- =========================================================

CREATE INDEX IF NOT EXISTS IDX_COMPANY_SEGMENT
    ON COMPANY(SEGMENT_ID);

CREATE INDEX IF NOT EXISTS IDX_COMPANY_STATUS
    ON COMPANY(STATUS_ID);

CREATE INDEX IF NOT EXISTS IDX_COMPANY_CLIENT_TYPE
    ON COMPANY(CLIENT_TYPE_ID);


-- =========================================================
-- CONTACT INDEXES
-- =========================================================

CREATE INDEX IF NOT EXISTS IDX_CONTACT_COMPANY
    ON CONTACT(COMPANY_ID);


-- =========================================================
-- INTERACTION INDEXES
-- =========================================================

CREATE INDEX IF NOT EXISTS IDX_INTERACTION_COMPANY_DATE
    ON INTERACTION(COMPANY_ID, DATE DESC);

CREATE INDEX IF NOT EXISTS IDX_INTERACTION_CONTACT_DATE
    ON INTERACTION(CONTACT_ID, DATE DESC);


-- =========================================================
-- PURCHASE INDEXES
-- =========================================================

CREATE INDEX IF NOT EXISTS IDX_PURCHASE_COMPANY_DATE
    ON PURCHASE(COMPANY_ID, DATE DESC);
