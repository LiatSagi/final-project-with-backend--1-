const Organization = require("../../models/organization.model");

const getRequestedOrganizations = async (req, res, next) => {
  try {
    const organizations = await Organization.find({
      status: "pending",
    });

    res.status(200).json(organizations);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = {
  getRequestedOrganizations,
};
