const express = require("express");
const router = express.Router();
const financeModel = require("../models/finance");
const auth = require("../middleware/auth");

//const asyncMiddleware = require("../middleware/async");
// router.get(
//   "/",
//   asyncMiddleware(async (req, res) => {
//     const items = await financeModel.getAllFinances();
//     res.send(items);
//   })
// );

router.get("/", auth, async (req, res) => {
  const items = await financeModel.getAllFinances();
  return res.send(items);
});

router.get("/:id", auth, async (req, res) => {
  const finance = await financeModel.getFinance(req.params.id);
  if (finance) {
    return res.send(finance);
  } else {
    return res.status(404).send("No record with given ID");
  }
});

router.post("/", auth, async (req, res) => {
  const { error } = financeModel.validateFinance(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const resData = {
    amount: req.body.amount,
    note: req.body.note,
    date: req.body.date,
  };
  const item = await financeModel.addFinance(resData);
  return res.send(item);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = financeModel.validateFinance(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const resData = {
    id: req.params.id,
    amount: req.body.amount,
    note: req.body.note,
    date: req.body.date,
  };
  var data = await financeModel.updateFinance(resData);
  if (data == undefined) {
    return res.status(404).send("No record with given ID");
  }
  return res.send(data);
});

router.delete("/:id", auth, async (req, res) => {
  var result = await financeModel.deleteFinance(req.params.id);
  if (result) {
    return res.send(result);
  }
  return res.send(false);
});

module.exports = router;
