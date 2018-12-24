const { Campaign, validate } = require('../models/Campaigns');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const campaign = new Campaign({
    campaignName: req.body.campaignName,
    advertiser: req.body.advertiser,
    targets: req.body.targets,
    conversionType: req.body.conversionType,
    bid: req.body.bid
  });
  const result = await campaign.save();

  console.log(req.body);
  res.redirect('/campaign=' + result ? true : false);
  // res.render('console', { campaign: true });
});

module.exports = router;