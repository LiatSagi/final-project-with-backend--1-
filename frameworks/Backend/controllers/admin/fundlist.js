const Fund = require("../../models/fund.model");

const getRequestedFunds = (req, res, next) => {
  try {
    const funds = Fund.find({ status: "pending" });
    res.status(200).json(funds);
  } catch (error) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const getApprovedFunds = (req, res, next) => {
  try {
    const funds = Fund.find({ status: "approved" });
    res.status(200).json(funds);
  } catch (error) {
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
