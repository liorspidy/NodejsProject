const express = require('express');
const router = express.Router();
const Costs = require('./models/costs');
const User = require('./models/user');
const createdReports = require('./models/createdReports');
// Add a new cost item
router.post('/addcost', async (req, res) => {
  const { user_id, year, month, day, description, category, sum } = req.body;

  // Check if the user exists
  const user = await User.findOne({ id: user_id });
  if (!user) {
    return res.status(400).send('User not found');
  }

  // Helper function to validate the year - checks if the year is within a valid range
  function isValidYear(year) {
    return Number.isInteger(year) && year >= 1970 && year <= 2024;
  }

  // Helper function to validate the month - checks if the month is within a valid range (1-12)
  function isValidMonth(month) {
    return Number.isInteger(month) && month >= 1 && month <= 12;
  }

  // Helper function to validate the day - checks if the day is within a valid range based on the month
  function isValidDay(year, month, day) {
    if (month === 2) {
      // February has 28 or 29 days depending on whether it's a leap year
      if (isLeapYear(year)) {
        return Number.isInteger(day) && day >= 1 && day <= 29;
      } else {
        return Number.isInteger(day) && day >= 1 && day <= 28;
      }
    } else if ([4, 6, 9, 11].includes(month)) {
      // April, June, September, and November have 30 days
      return Number.isInteger(day) && day >= 1 && day <= 30;
    } else {
      // All other months have 31 days
      return Number.isInteger(day) && day >= 1 && day <= 31;
    }
  }

  // Helper function to check if a year is a leap year
  function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  // Validate year, month, and day
  if (!isValidYear(year)) {
    return res.status(400).send('Invalid year');
  }
  if (!isValidMonth(month)) {
    return res.status(400).send('Invalid month');
  }
  if (!isValidDay(year, month, day)) {
    return res.status(400).send('Invalid day');
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

  // Check if the report exists in the createdReports collection
  const existingReport = await createdReports.findOne({
    user_id,
    year,
    month,
  });

  // If the report exists, return it
  if (existingReport) {
    return res.json(existingReport.report);
  }

  // If the report doesn't exist, calculate it
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
    // Extract day, description, sum
    const { day, description, sum, category } = cost;

    // Add only the required properties to the report
    report[category].push({ day, description, sum });
  });

  // Save the computed report in the createdReports collection
  const newReport = new createdReports({
    user_id,
    year,
    month,
    report,
  });

  try {
    await newReport.save();
    res.json(report);
  } catch (err) {
    console.error(err);
    res.status(500).send('Could not save report');
  }
});

// Get information about the developers
router.get('/about', (req, res) => {
  const developers = [
    {
      firstname: 'Lior',
      lastname: 'Fridman',
      id: 206798902,
      email: 'liorspidy@gmail.com',
    },
    {
      firstname: 'Daniel',
      lastname: 'Gardashnik',
      id: 206389363,
      email: 'danielgard10@gmail.com',
    },
  ];

  res.json(developers);
});

module.exports = router;
