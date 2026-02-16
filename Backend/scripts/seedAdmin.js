/**
 * Seed one admin user. Run: node scripts/seedAdmin.js
 * Or set ADMIN_EMAIL and ADMIN_PASSWORD in .env
 */
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@todo.app';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin';

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/todo-app');
  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    console.log('Admin already exists:', ADMIN_EMAIL);
    if (existing.role !== 'admin') {
      existing.role = 'admin';
      await existing.save();
      console.log('Updated role to admin.');
    }
    process.exit(0);
    return;
  }
  await User.create({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    role: 'admin',
  });
  console.log('Admin created:', ADMIN_EMAIL, '(password:', ADMIN_PASSWORD + ')');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
