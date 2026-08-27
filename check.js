const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env' });

mongoose.connect(process.env.DATABASE_URI).then(async () => {
  const db = mongoose.connection.db;
  const user = await db.collection('users').findOne({ email: 'demo@admin.com' });
  console.log('Hash in DB:', user.password);
  const isValid = await bcrypt.compare('password', user.password);
  console.log('isValid for "password":', isValid);
  process.exit(0);
});
