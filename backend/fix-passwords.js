process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const fixPasswords = async () => {
  console.log('🔐 Fixing user passwords...\n');
  
  // Generate proper bcrypt hash for "admin123"
  const password = 'admin123';
  const hashedPassword = await bcrypt.hash(password, 10);
  
  console.log(`Generated hash for "${password}":`);
  console.log(hashedPassword);
  console.log('');

  const client = await pool.connect();
  
  try {
    // Update all users with the correct password hash
    const result = await client.query(
      `UPDATE users SET password = $1`,
      [hashedPassword]
    );
    
    console.log(`✅ Updated ${result.rowCount} users with correct password hash\n`);

    // Verify by listing users
    const users = await client.query(`SELECT email, role FROM users`);
    console.log('👥 Users (all can login with password: admin123):');
    users.rows.forEach(row => console.log(`   - ${row.email} (${row.role})`));
    
    console.log('\n✅ Password fix complete!');

  } finally {
    client.release();
    await pool.end();
  }
};

fixPasswords().catch(err => {
  console.error('❌ Fix failed:', err);
  process.exit(1);
});
