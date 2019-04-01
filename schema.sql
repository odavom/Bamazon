DROP DATABASE IF EXISTS bamazon_DB;
CREATE DATABASE bamazon_DB;

use bamazon_DB;

CREATE TABLE products (
    item_id INT(10) NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(45) NOT NULL ,
    department_name VARCHAR(45) NOT NULL,
    customer_price DECIMAL(10,2) NOT NULL,
    stock_quantity INT(10) NOT NULL,
    PRIMARY KEY(item_id)
);

