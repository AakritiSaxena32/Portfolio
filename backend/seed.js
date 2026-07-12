/* =========================================================
   seed.js — populates MongoDB with your starter projects.
   Run once with: npm run seed
   ========================================================= */
require('dotenv').config();
const connectDB = require('./config/db');
const Project = require('./models/Project');

const projects = [
  {
    title: 'Travel Planner (Gen AI)',
    category: 'Full-Stack',
    description: 'A Spring Boot travel planner integrated with the Gemini API to generate day-wise trip itineraries based on user preferences, budget, and destination.',
    tech: ['Java', 'Spring Boot', 'HTML', 'CSS', 'Gemini API'],
    liveUrl: '',
    codeUrl: '"https://github.com/AakritiSaxena32/Trip-Planner"',
    featured: true,
    order: 1
  },
  {
    title: 'Smart Route Finder',
    category: 'Frontend',
    description: 'A hybrid Ant Colony Optimization + Genetic Algorithm model that finds optimal routes under real-time traffic conditions, solving an NP-hard TSP variant with an interactive visualizer.',
    tech: ['JavaScript', 'HTML', 'CSS'],
    liveUrl: '',
    codeUrl: 'https://github.com/AakritiSaxena32/Smart-Route-Finder',
    featured: true,
    order: 2
  },
  {
    title: 'Credit Card Fraud Detection System',
    category: 'Backend',
    description: 'A machine learning system that flags fraudulent transactions using a Random Forest Classifier on unbalanced data — achieved an 86.96% F1-score and 99.95% accuracy.',
    tech: ['Python', 'Scikit-learn', 'Pandas'],
    liveUrl: '',
    codeUrl: 'https://github.com/AakritiSaxena32/Credit-Card-Fraud-Detection-System',
    featured: false,
    order: 3
  }
];

(async () => {
  await connectDB();
  await Project.deleteMany({});
  await Project.insertMany(projects);
  console.log(`Seeded ${projects.length} projects.`);
  process.exit(0);
})();