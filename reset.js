const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env' });

mongoose.connect(process.env.DATABASE_URI).then(async () => {
  const db = mongoose.connection.db;
  const hash = await bcrypt.hash('password', 10);
  await db.collection('users').updateOne({ email: 'demo@admin.com' }, { $set: { password: hash } });
  console.log('Admin password updated to: password');
  process.exit(0);
});
