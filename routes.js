const express = require('express');
const router = express.Router();
const Costs = require('./models/costs');
const User = require('./models/user');

// Add a new cost item
router.post('/addcost', async (req, res) => {
  const { user_id, year, month, day, id, description, category, sum } =
    req.body;
  const cost = new Costs({
    user_id,
    year,
    month,
    day,
    id,
    description,
    category,
    sum,
  });
  try {
    await cost.save();
    res.json(cost);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Get detailed report for a specific month and year
router.get('/report/:year/:month/:user_id', async (req, res) => {
  const { year, month, user_id } = req.params;
  const pipeline = [
    {
      $match: {
        user_id: parseInt(user_id),
        year: parseInt(year),
        month: parseInt(month),
      },
    },
    {
      $group: {
        _id: '$category',
        costs: {
          $push: {
            user_id: '$user_id',
            year: '$year',
            month: '$month',
            id: '$_id',
            description: '$description',
            category: '$category',
            sum: '$sum',
          },
        },
      },
    },
  ];
  try {
    const result = await Cost.aggregate(pipeline);
    const report = {};
    const categories = [
      'food',
      'health',
      'housing',
      'sport',
      'education',
      'transportation',
      'other',
    ];
    categories.forEach((category) => {
      report[category] = [];
    });
    result.forEach((item) => {
      report[item._id] = item.costs;
    });
    res.json(report);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Get information about the developers
router.get('/about', (req, res) => {
  const developers = [
    {
      first_name: 'John',
      last_name: 'Doe',
      id: 1,
      email: 'john.doe@example.com',
    },
    {
      first_name: 'Jane',
      last_name: 'Doe',
      id: 2,
      email: 'jane.doe@example.com',
    },
  ];

  res.json(developers);
});

module.exports = router;
