// scripts/add_unique_constraint.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: false } 
    : false,
});

async function addConstraint() {
  try {
    console.log('🔧 Adding UNIQUE constraint to food_item...');
    
    // First, remove any duplicates if they exist
    await pool.query(`
      DELETE FROM food_database a USING food_database b
      WHERE a.id > b.id 
      AND a.food_item = b.food_item;
    `);
    
    console.log('✅ Removed duplicates (if any)');
    
    // Add unique constraint
    await pool.query(`
      ALTER TABLE food_database
      ADD CONSTRAINT food_database_food_item_unique UNIQUE (food_item);
    `);
    
    console.log('✅ UNIQUE constraint added to food_item column');
    
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('✅ Constraint already exists');
    } else {
      console.error('❌ Error:', error.message);
    }
  } finally {
    await pool.end();
  }
}

addConstraint();