const TreeModel = require("../models/Tree");

const mapEmailCountToHue = (emailCount) => {
  const maxEmails = 10000;
  const minHue = 0; // Red color
  const maxHue = 120; // Green color

  // If email count exceeds maximum, the hue becomes the minimum
  if (emailCount >= maxEmails) {
    return minHue;
  }

  // Calculate the hue based on the ratio of emails sent
  return maxHue - (emailCount / maxEmails) * maxHue;
};

exports.createOrUpdateTree = (req, res) => {
  const customerName = req.body.customerName;
  const emailCount = req.body.emailCount;
  TreeModel.findOne({ customerName })
    .then((tree) => {
      if (!tree) {
        // If tree for this customer does not exist, create a new one
        tree = new TreeModel({ customerName, emailCount });
      } else {
        // Otherwise, update the email count
        tree.emailCount += emailCount;
      }
      // Set the hue based on the new email count
      tree.hue = mapEmailCountToHue(tree.emailCount);
      return tree.save();
    })
    .then((tree) => {
      res.send(tree);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error occurred while creating or updating tree");
    });
};
