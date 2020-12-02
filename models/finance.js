const db_PromisePool = require("../database");
const Joi = require("joi");

class Finance {
  constructor(id = null, amount, note, date) {
    (this.id = id), (this.amount = amount);
    this.note = note;
    this.date = date;
  }
}

async function getAllFinances() {
  const sql = "select * from finance";
  const [results, fields] = await db_PromisePool.query(sql);
  return results;
}

async function getFinance(id) {
  const sql = "select * from finance where id = ?";
  const [results, fields] = await db_PromisePool.query(sql, [id]);
  return results[0];
}

async function addFinance({ amount, note, date }) {
  const sql = "insert into finance (amount, note, date) values (?, ?, ?)";
  const [results, fields] = await db_PromisePool.query(sql, [
    amount,
    note,
    date,
  ]);
  return {
    id: results.insertId,
    amount,
    note,
    date,
  };
}

async function updateFinance({ id, amount, note, date }) {
  const item = await getFinance(id);

  if (item) {
    const sql =
      "UPDATE finance SET amount = ?, note = ?, date = ? WHERE id = ?;";
    const [results, fields] = await db_PromisePool.query(sql, [
      amount,
      note,
      date,
      id,
    ]);

    if (results.changedRows > 0) {
      return {
        id,
        amount,
        note,
        date,
      };
    }
  }
}

async function deleteFinance(id) {
  const item = await getFinance(id);
  if (item) {
    const sql = "DELETE FROM finance where id = ?";
    const [results, fields] = await db_PromisePool.query(sql, [id]);
    if (results.affectedRows > 0) {
      return true;
    }
  }
}

function validateFinance(finance) {
  const schema = Joi.object({
    amount: Joi.number().required().label("Amount"),
    note: Joi.string().required().label("Note"),
    date: Joi.date().required().label("Datum"),
  });
  return schema.validate(finance);
}

module.exports = {
  getAllFinances,
  getFinance,
  addFinance,
  updateFinance,
  deleteFinance,
  validateFinance,
};
