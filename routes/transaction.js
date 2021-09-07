const { validateTransaction } = require("../validation/validation");
const {
    insertTransaction,
    updateTransaction,
    deleteTransaction,
} = require("../model/transaction");
const express = require("express");
const auth = require("../middleware/auth");
const {
    insertCustomFieldValue,
    deleteCustomFieldValue,
} = require("../model/customFieldValue");
const { custom } = require("joi");
const router = express.Router();

router.post("/", auth, async (req, res) => {
    try {
        const { error } = validateTransaction(req.body.transaction);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        const transaction = await insertTransaction(
            req.body.transaction,
            req.user.id
        );

        const customFieldValues = await insertCustomFieldValues(
            transaction.id,
            req.body.customFields
        );

        return res.send({ transaction, customFieldValues });
    } catch (error) {
        return res.status(405).send(error.message);
    }
});

router.post("/incoming", auth, async (req, res) => {
    try {
        const { error } = validateTransaction(req.body.transaction);

        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        const transaction = await insertTransaction(
            req.body.transaction,
            req.user.id
        );
        let customFieldsValues = req.body.customFieldsValues;
        customFieldsValues.forEach((custom) => {
            custom.transactionId = transaction.id;
        });
        const customFieldValues = await insertCustomFieldIncomingValues(
            customFieldsValues
        );
        return res.send({ transaction, customFieldValues });
    } catch (error) {
        return res.status(405).send(error.message);
    }
});

router.put("/", auth, async (req, res) => {
    try {
        const transaction = req.body.transaction;

        const { error } = validateTransaction(transaction);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        await updateTransaction(transaction);
        await deleteCustomFieldValue(transaction.id);
        const customFieldValues = await insertCustomFieldValues(
            req.body.transaction.id,
            req.body.customFields
        );

        res.send({ transaction, customFieldValues });
    } catch (error) {
        return res.status(405).send(error.message);
    }
});

router.delete("/:transactionId", auth, async (req, res) => {
    try {
        const id = req.params.transactionId;
        await deleteCustomFieldValue(id);
        await deleteTransaction(id);
        res.send(true);
    } catch (error) {
        return res.status(405).send(error.message);
    }
});

const insertCustomFieldValues = async (transactionId, customFields) => {
    const promises = customFields.map(async (custom) => {
        return await insertCustomFieldValue(
            custom.id,
            custom.value,
            transactionId
        );
    });
    return await Promise.all(promises);
};

const insertCustomFieldIncomingValues = async (customs) => {
    const promises = customs.map(async (custom) => {
        return await insertCustomFieldValue(
            custom.customFieldId,
            custom.value,
            custom.transactionId
        );
    });
    return await Promise.all(promises);
};

module.exports = router;
