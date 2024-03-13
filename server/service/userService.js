// WILL PERTAIN TO USERS223const client = require("./client.js");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const client = require('../client.js');


const fetchUsers = async () => {
    try {
        const FETCH_USER_SQL = `SELECT * FROM users;`
        const fetchUserResponse = await client.query(FETCH_USER_SQL);
        return fetchUserResponse.rows;
        
    }catch(e) {
        throw new Error(e)
    }
}


const createUserService = async ({ name, email, password, is_admin }) => {
  try {
    const CREATE_USER_SQL_STR = `
        INSERT INTO users(id,name,email,password,is_admin) VALUES($1,$2,$3,$4,$5) RETURNING *;
        `;
    const createUserResponse = await client.query(CREATE_USER_SQL_STR, [
      uuid.v4(),
      name,
      email,
      await bcrypt.hash(password, 5),
      is_admin,
    ]);
    return createUserResponse.rows[0];
  } catch (e) {
    throw new Error(e);
  }
};



module.exports = {
    fetchUsers,
    createUserService
}