const Fund = require("../../models/fund.model");

const getRequestedFunds = async (req, res, next) => {
  try {
    const funds = await Fund.find({ status: "pending" });
    res.status(200).json(funds);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const getApprovedFunds = async (req, res, next) => {
  try {
    const funds = await Fund.find({ status: "approved" });
    res.status(200).json(funds);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = {
  getRequestedFunds,
  getApprovedFunds,
};
