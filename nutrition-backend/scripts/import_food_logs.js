// scripts/import_food_logs.js
const XLSX = require('xlsx');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: false } 
    : false,
});

async function getTableColumns(tableName) {
  const result = await pool.query(`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = $1
  `, [tableName]);
  
  return result.rows.map(row => row.column_name);
}

async function importFoodLogs() {
  try {
    console.log('📖 Reading Excel file - Sheet 1 (Ingredients/Food Logs)...');
    
    const workbook = XLSX.readFile('./Dataset.xlsx');
    const sheetName = 'Ingredients';
    const worksheet = workbook.Sheets[sheetName];
    
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    console.log(`✅ Found ${data.length} food log entries`);
    console.log('📋 Sample row:', data[0]);
    
    // Create Win Moe Oo user
    const userId = 'usr_winmoeoo';
    
    console.log('\n👤 Creating/verifying user "Win Moe Oo"...');
    try {
      await pool.query(`
        INSERT INTO users (user_id, user_name, is_active)
        VALUES ($1, 'Win Moe Oo', TRUE)
        ON CONFLICT (user_id) DO NOTHING
      `, [userId]);
      console.log('✅ User ready');
    } catch (e) {
      console.log('⚠️  Could not create user:', e.message);
      console.log('Continuing with import...');
    }
    
    // Check which columns exist in food_logs table
    console.log('\n🔍 Checking database schema...');
    const columns = await getTableColumns('food_logs');
    console.log(`   Available columns: ${columns.join(', ')}`);
    
    // Build dynamic query based on available columns
    const columnMapping = {
      'user_id': () => userId,
      'food_item': (row) => row.Food_Item,
      'category': (row) => row.Category || 'Other',
      'calories': (row) => parseFloat(row['Calories (kcal)']) || 0,
      'protein': (row) => parseFloat(row['Protein (g)']) || 0,
      'carbohydrates': (row) => parseFloat(row['Carbohydrates (g)']) || 0,
      'fat': (row) => parseFloat(row['Fat (g)']) || 0,
      'fiber': (row) => parseFloat(row['Fiber (g)']) || 0,
      'sugar': (row) => parseFloat(row['Sugars (g)']) || 0,
      'sodium': (row) => parseFloat(row['Sodium (mg)']) || 0,
      'cholesterol': (row) => parseFloat(row['Cholesterol (mg)']) || 0,
      'meal_type': (row) => row.Meal_Type || 'Snack',
      'water_intake': (row) => parseFloat(row['Water_Intake (ml)']) || 0,
      'logged_at': (row) => {
        if (row.Date && typeof row.Date === 'number') {
          return new Date((row.Date - 25569) * 86400 * 1000);
        }
        return new Date();
      }
    };
    
    // Only use columns that exist in the table
    const availableColumns = [];
    const valueFunctions = [];
    
    Object.keys(columnMapping).forEach(col => {
      if (columns.includes(col)) {
        availableColumns.push(col);
        valueFunctions.push(columnMapping[col]);
      }
    });
    
    console.log(`   Will insert into: ${availableColumns.join(', ')}\n`);
    
    const placeholders = availableColumns.map((_, i) => `$${i + 1}`).join(', ');
    const query = `
      INSERT INTO food_logs (${availableColumns.join(', ')})
      VALUES (${placeholders})
    `;
    
    let inserted = 0;
    let errors = 0;
    
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      
      if (!row.Food_Item) {
        continue;
      }
      
      try {
        // Build values array using the value functions
        const values = valueFunctions.map(fn => fn(row));
        
        await pool.query(query, values);
        
        inserted++;
        
        if (inserted % 500 === 0) {
          console.log(`   Processed ${inserted} logs...`);
        }
        
      } catch (err) {
        console.error(`❌ Error row ${i + 1}:`, err.message);
        errors++;
        if (errors > 20) {
          console.log('⚠️  Too many errors, stopping...');
          break;
        }
      }
    }
    
    console.log('\n📊 Import Summary:');
    console.log(`   ✅ Inserted: ${inserted}`);
    console.log(`   ❌ Errors: ${errors}`);
    
    // Verify import
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM food_logs WHERE user_id = $1',
      [userId]
    );
    console.log(`\n🗄️  Total logs for Win Moe Oo: ${countResult.rows[0].count}`);
    
    // Show date range if logged_at exists
    if (columns.includes('logged_at')) {
      const dateRange = await pool.query(`
        SELECT 
          MIN(DATE(logged_at)) as first_date,
          MAX(DATE(logged_at)) as last_date
        FROM food_logs
        WHERE user_id = $1
      `, [userId]);
      
      console.log('\n📅 Date range:');
      console.log(`   From: ${dateRange.rows[0].first_date}`);
      console.log(`   To: ${dateRange.rows[0].last_date}`);
    }
    
    // Show meal type breakdown if meal_type exists
    if (columns.includes('meal_type')) {
      const mealTypes = await pool.query(`
        SELECT meal_type, COUNT(*) as count
        FROM food_logs
        WHERE user_id = $1
        GROUP BY meal_type
        ORDER BY count DESC
      `, [userId]);
      
      console.log('\n🍽️  Meals by type:');
      mealTypes.rows.forEach(row => {
        console.log(`   ${row.meal_type}: ${row.count}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Import failed:', error.message);
    console.error(error.stack);
  } finally {
    await pool.end();
  }
}

importFoodLogs();