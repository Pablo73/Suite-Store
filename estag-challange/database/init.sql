--Every command here will be executed when the container is created

CREATE TABLE CATEGORIES ( 
    ID SERIAL PRIMARY KEY, 
    CATEGORIES_NAME VARCHAR(255) NOT NULL UNIQUE, 
    TAX DECIMAL(10,2) NOT NULL
); 

CREATE TABLE PERSON ( 
    ID SERIAL PRIMARY KEY, 
    NAME_USER VARCHAR(255) NOT NULL UNIQUE, 
    ROLE_USER  VARCHAR(50) NOT NULL,
    PASSWORD_USER_HASH VARCHAR(255) NOT NULL
); 

CREATE TABLE AUTH_TOKENS (
    ID SERIAL PRIMARY KEY,
    USER_ID INTEGER NOT NULL,
    TOKEN VARCHAR(255) NOT NULL,
    CONSTRAINT FK_USER_TOKEN FOREIGN KEY (USER_ID) REFERENCES PERSON(ID) ON DELETE CASCADE
);

CREATE TABLE PRODUCTS ( 
    ID SERIAL PRIMARY KEY, 
    PRODUCTS_NAME VARCHAR(255) NOT NULL UNIQUE, 
    UNIT_PRICE DECIMAL (10,2) NOT NULL, 
    PRODUCT_AMOUNT NUMERIC(10,2) NOT NULL, 
    CATEGORIES_ID INTEGER NOT NULL, 
    CONSTRAINT FK_CATEGORY FOREIGN KEY (CATEGORIES_ID) REFERENCES CATEGORIES(ID) ON DELETE CASCADE
); 

CREATE TABLE ORDERS ( 
    ID SERIAL PRIMARY KEY, 
    TOTAL_ORDER DECIMAL (10,2) NOT NULL, 
    TAX_ORDER DECIMAL (10,2) NOT NULL,
    ORDER_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 

CREATE TABLE ORDER_ITEM( 
    ID SERIAL PRIMARY KEY, 
    ORDER_ITEM_AMOUNT NUMERIC(10,2) NOT NULL,  
    ORDER_ID INTEGER NOT NULL, 
    PRODUCT_ID INTEGER NOT NULL, 
    PERSON_ID INTEGER NOT NULL,
    CONSTRAINT FK_PRODUCT FOREIGN KEY (PRODUCT_ID) REFERENCES PRODUCTS(ID) ON DELETE CASCADE, 
    CONSTRAINT FK_ORDER FOREIGN KEY (ORDER_ID) REFERENCES ORDERS(ID) ON DELETE CASCADE,
    CONSTRAINT FK_PERSON FOREIGN KEY (PERSON_ID) REFERENCES PERSON(ID) ON DELETE CASCADE
); 

INSERT INTO CATEGORIES (CATEGORIES_NAME, TAX) VALUES
    ('Electronics', 0.18),
    ('Clothing', 0.10),
    ('Home and Kitchen', 0.15);


INSERT INTO PRODUCTS (PRODUCTS_NAME, UNIT_PRICE, PRODUCT_AMOUNT, CATEGORIES_ID) VALUES
    ('Laptop', 1200.00, 50, 1),
    ('Smartphone', 600.00, 100, 1),
    ('T-Shirt', 20.00, 200, 2),
    ('Jeans', 50.00, 150, 2),
    ('Coffee Maker', 80.00, 30, 3);

INSERT INTO PERSON (NAME_USER, PASSWORD_USER_HASH, ROLE_USER) VALUES
    ('admin', '$2y$10$SJIGA7UJj3AO7yHKG4r0W.rTeHdxVNAJTHfaNaUAytWn7ME8COek6', 'admin');




