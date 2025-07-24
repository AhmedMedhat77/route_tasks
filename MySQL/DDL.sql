-- --DDL 
-- create Database
-- DB AUTO_INCREMENT =4 

CREATE DATABASE IF NOT EXISTS 'uber';

USE 'uber';

CREATE TABLE
    IF NOT EXISTS 'drivers' (
        -- column data_type(length) constrains 
        id INT (11) NOT NULL AUTO_INCREMENT DEFAULT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email CHAR(100),
        content TEXT,
        status ENUM ('active', 'inactive') NOT NULL DEFAULT 'active',
        isActive BOOLEAN NOT NULL DEFAULT TRUE, -- 0 ,1 TINYINT(1)
        dob DATE, -- 07-07-1996 
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT on update CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
    )