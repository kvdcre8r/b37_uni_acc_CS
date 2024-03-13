//EVERYTHING IN THIS FILE PRODUCT
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const client = require('../client.js');

const fetchProducts = async () => {
    try {
        const FETCH_PRODUCT_SQL = `SELECT * FROM products;`
        const fetchProductResponse = await client.query(FETCH_PRODUCT_SQL);
        return fetchProductResponse.rows;
    } catch (e) {
        throw new Error(e);
    }
}

const createProductService = async ({name,is_available,qty}) => {
    try {
        const CREATE_PRODUCT_SQL_STR = `
        INSERT INTO products(id,name,is_available,qty) VALUES($1,$2,$3,$4) RETURNING *;
        `
        const createProductResponse = await client.query(CREATE_PRODUCT_SQL_STR, [
            uuid.v4(),
            name,
            is_available,
            qty
        ])
        return createProductResponse.rows[0];
    } catch (e) {
        throw new Error(e);
    }
}

module.exports = {
    fetchProducts,
    createProductService
}