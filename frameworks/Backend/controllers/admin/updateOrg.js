const { body, validationResult } = require("express-validator");
const Organization = require("../../models/organization.model");

const editOrganization = async (req, res, next) => {
  try {
    // const errors = validationResult(req);
    // console.log(errors);
    // if (!errors.isEmpty()) {
    //   res.status(422).json({ errors: errors.array() });
    //   return;
    // }
    const orgID = req.params.id;
    const name = req.body.OrgName;
    const address = req.body.OrgAddress;
    const contactNumber = req.body.OrgContactNo;
    const email = req.body.OrgEmail;
    const status = req.body.OrgStatus;
    const zipCode = req.body.OrgZipCode;
    const presidentContactNumber = req.body.pContactNo;
    const presidentEmail = req.body.pemail;
    const presidentName = req.body.pname;
    const secretaryContactNumber = req.body.sContactNo;
    const secretaryEmail = req.body.semail;
    const secretaryName = req.body.sname;

    const updateOrganization = {
      name,
      address,
      contactNumber,
      email,
      status,
      zipCode,
      presidentContactNumber,
      presidentEmail,
      presidentName,
      secretaryContactNumber,
      secretaryEmail,
      secretaryName,
    };

    const organization = await Organization.findByIdAndUpdate(
      orgID,
      updateOrganization
    );
    console.log(organization);
    res.status(200).send({ status: "Organization updated" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = {
  editOrganization,
};
