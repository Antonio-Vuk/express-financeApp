const db_PromisePool = require("../database");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class User {
  constructor(id = null, name, email, password) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
  }

  generateAuthToken() {
    const token = jwt.sign(
      {
        _id: this.id,
      },
      "jwtPrivateKey"
      //config.get("jwtPrivateKey")
    );
    return token;
  }
}

async function getUserById(id) {
  const sql = "select * from users where id = ?";
  const [results, fields] = await db_PromisePool.query(sql, [id]);
  return getObject(results);
}

async function getUserByEmail(email) {
  const sql = "select * from users where email = ?";
  const [results] = await db_PromisePool.query(sql, [email]);
  return getObject(results);
}

async function addUser({ name, email, password }) {
  const item = await getUserByEmail(email);

  if (item == null) {
    const sql = "insert into users (name, email, password) values (?, ?, ?)";
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const [results, fields] = await db_PromisePool.query(sql, [
      name,
      email,
      hashed,
    ]);

    return new User(results.insertId, name, email);
  }
}

function getObject(data) {
  if (data.length == 0) {
    return null;
  }

  const user = data[0];
  return new User(user.id, user.name, user.email, user.password);
}

function validateUser(finance) {
  const schema = Joi.object({
    name: Joi.string().required().label("Name"),
    email: Joi.string().email().required().label("Email"),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required()
      .min(6)
      .label("Password"),
  });
  return schema.validate(finance);
}

function validateAuth(finance) {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required()
      .min(6)
      .label("Password"),
  });
  return schema.validate(finance);
}

module.exports = {
  validateUser,
  validateAuth,
  getUserByEmail,
  getUserById,
  addUser,
  User,
};
