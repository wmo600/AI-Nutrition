// scripts/import_food_database.js
const XLSX = require('xlsx');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: false } 
    : false,
});

function parseNumeric(value) {
  if (!value) return null;
  const match = String(value).match(/(\d+\.?\d*)/);
  return match ? parseFloat(match[1]) : null;
}

async function getTableColumns(tableName) {
  const result = await pool.query(`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = $1
  `, [tableName]);
  
  return result.rows.map(row => row.column_name);
}

async function importFoodDatabase() {
  try {
    console.log('📖 Reading Excel file - Sheet 2 (Food Items)...');
    
    const workbook = XLSX.readFile('./Dataset.xlsx');
    const sheetName = 'Food Items';
    const worksheet = workbook.Sheets[sheetName];
    
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    console.log(`✅ Found ${data.length} rows in "Food Items" sheet`);
    console.log('📋 Sample row:', data[0]);
    
    // Check which columns exist in the table
    console.log('\n🔍 Checking database schema...');
    const columns = await getTableColumns('food_database');
    console.log(`   Available columns: ${columns.join(', ')}`);
    
    // Build dynamic query based on available columns
    const availableColumns = [];
    const placeholders = [];
    let paramIndex = 1;
    
    // Map of column names to their order
    const columnMap = {
      'food_category': paramIndex++,
      'food_item': paramIndex++,
      'serving_size': paramIndex++,
      'calories': paramIndex++,
    };
    
    availableColumns.push('food_category', 'food_item', 'serving_size', 'calories');
    placeholders.push('$1', '$2', '$3', '$4');
    
    // Add optional columns if they exist
    if (columns.includes('calories_unit')) {
      columnMap['calories_unit'] = paramIndex++;
      availableColumns.push('calories_unit');
      placeholders.push(`$${paramIndex - 1}`);
    }
    
    if (columns.includes('kilojoules')) {
      columnMap['kilojoules'] = paramIndex++;
      availableColumns.push('kilojoules');
      placeholders.push(`$${paramIndex - 1}`);
    }
    
    if (columns.includes('protein')) {
      columnMap['protein'] = paramIndex++;
      availableColumns.push('protein');
      placeholders.push(`$${paramIndex - 1}`);
    }
    
    if (columns.includes('carbohydrates')) {
      columnMap['carbohydrates'] = paramIndex++;
      availableColumns.push('carbohydrates');
      placeholders.push(`$${paramIndex - 1}`);
    }
    
    if (columns.includes('fat')) {
      columnMap['fat'] = paramIndex++;
      availableColumns.push('fat');
      placeholders.push(`$${paramIndex - 1}`);
    }
    
    console.log(`   Will insert into: ${availableColumns.join(', ')}\n`);
    
    let inserted = 0;
    let updated = 0;
    let skipped = 0;
    let errors = 0;
    
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      
      // Skip header rows
      if (!row.Column2 || 
          row.Column2 === 'FoodItem' || 
          row.Column1 === 'FoodCategory') {
        skipped++;
        continue;
      }
      
      try {
        const foodCategory = row.Column1 || 'Unknown';
        const foodItem = row.Column2;
        const servingSize = row.Column3 || '100g';
        const calories = parseNumeric(row.Column4);
        const kilojoules = parseNumeric(row.Column5);
        
        // Build values array based on available columns
        const values = [
          foodCategory,
          foodItem,
          servingSize,
          calories
        ];
        
        if (columns.includes('calories_unit')) {
          values.push('kcal');
        }
        if (columns.includes('kilojoules')) {
          values.push(kilojoules);
        }
        if (columns.includes('protein')) {
          values.push(0);
        }
        if (columns.includes('carbohydrates')) {
          values.push(0);
        }
        if (columns.includes('fat')) {
          values.push(0);
        }
        
        // Build UPDATE clause for conflict
        const updateClauses = availableColumns
          .filter(col => col !== 'food_item') // Don't update the unique key
          .map(col => `${col} = EXCLUDED.${col}`)
          .join(', ');
        
        const query = `
          INSERT INTO food_database (${availableColumns.join(', ')})
          VALUES (${placeholders.join(', ')})
          ON CONFLICT (food_item) 
          DO UPDATE SET ${updateClauses}
          RETURNING (xmax = 0) AS inserted
        `;
        
        const result = await pool.query(query, values);
        
        if (result.rows[0].inserted) {
          inserted++;
        } else {
          updated++;
        }
        
        if ((inserted + updated) % 100 === 0) {
          console.log(`   Processed ${inserted + updated} items...`);
        }
        
      } catch (err) {
        if (err.message.includes('duplicate key')) {
          // This shouldn't happen with ON CONFLICT, but just in case
          updated++;
        } else {
          console.error(`❌ Error row ${i + 1} (${row.Column2}):`, err.message);
          errors++;
        }
        
        if (errors > 20) {
          console.log('⚠️  Too many errors, stopping...');
          break;
        }
      }
    }
    
    console.log('\n📊 Import Summary:');
    console.log(`   ✅ Inserted: ${inserted}`);
    console.log(`   🔄 Updated: ${updated}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   ❌ Errors: ${errors}`);
    
    // Verify import
    const countResult = await pool.query('SELECT COUNT(*) FROM food_database');
    console.log(`\n🗄️  Total items in database: ${countResult.rows[0].count}`);
    
    // Show categories
    const categoryResult = await pool.query(`
      SELECT food_category, COUNT(*) as count
      FROM food_database
      GROUP BY food_category
      ORDER BY count DESC
      LIMIT 10
    `);
    
    if (categoryResult.rows.length > 0) {
      console.log('\n📂 Top 10 categories:');
      categoryResult.rows.forEach(row => {
        console.log(`   ${row.food_category}: ${row.count}`);
      });
    }
    
    // Show samples
    const sampleResult = await pool.query(`
      SELECT food_item, food_category, serving_size, calories
      FROM food_database
      ORDER BY id DESC
      LIMIT 5
    `);
    
    if (sampleResult.rows.length > 0) {
      console.log('\n📝 Latest 5 items:');
      sampleResult.rows.forEach(row => {
        console.log(`   ${row.food_item} (${row.food_category})`);
        console.log(`      ${row.serving_size}: ${row.calories} cal`);
      });
    }
    
  } catch (error) {
    console.error('❌ Import failed:', error.message);
    console.error(error.stack);
  } finally {
    await pool.end();
  }
}

importFoodDatabase();