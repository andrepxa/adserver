const { Campaign } = require('./models/Campaigns');
const mongoose = require('mongoose');
const express = require('express');
const app = express();

mongoose.connect(process.env.ad_db || 'mongodb://localhost/adnetwork', { useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connected to MongoDB...'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/fetch', async (req, res) => {
  console.log(req.query.country);

  if (!req.query.country) return res.status(400).send('Bad request. Valid country parameter required');

  try {
    const campaign = await Campaign
      .find({ targets: { $in: req.query.country.toUpperCase() } })
      .sort('-bid')
      .limit(1)
      .select('campaignName advertiser bid conversionType -_id');

    if (!campaign || campaign.length === 0) return res.status(400).send('There is no campaign available for this country.');

    res.send(campaign);
  } catch (err) {
    res.status(500).send('Something failed.');
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}...`));