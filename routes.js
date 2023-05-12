const express = require('express');
const router = express.Router();
const Costs = require('./models/costs');
const User = require('./models/user');

// Add a new cost item
router.post('/addcost', async (req, res) => {
  const { user_id, year, month, day, description, category, sum } = req.body;

  // Check if the user exists
  const user = await User.findOne({ id: user_id });
  if (!user) {
    return res.status(400).send('User not found');
  }

  // Create a new cost
  const cost = new Costs({
    user_id,
    year,
    month,
    day,
    description,
    category,
    sum,
  });

  try {
    await cost.save();
    res.status(200).send('Cost added successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Could not add cost successfully');
  }
});

// Get detailed report for a specific month and year
router.get('/report', async (req, res) => {
  const { year, month, user_id } = req.query;

  const costs = await Costs.find({
    user_id,
    year,
    month,
  });

  const categories = [
    'food',
    'health',
    'housing',
    'sport',
    'education',
    'transportation',
    'other',
  ];

  const report = categories.reduce((acc, category) => {
    acc[category] = [];
    return acc;
  }, {});

  costs.forEach((cost) => {
    const { category } = cost;
    report[category].push(cost);
  });

  res.json(report);
});

// Get information about the developers
router.get('/about', (req, res) => {
  const developers = [
    {
      first_name: 'Lior',
      last_name: 'Fridman',
      id: 206798902,
      email: 'liorspidy@gmail.com',
    },
    {
      first_name: 'Daniel',
      last_name: 'Gardashnik',
      id: 206389363,
      email: 'danielgard10@gmail.com',
    },
  ];

  res.json(developers);
});

module.exports = router;
