// scripts/check_excel_structure.js
const XLSX = require('xlsx');

const workbook = XLSX.readFile('./Dataset.xlsx');

console.log('📊 Excel File Structure:\n');
console.log(`Total sheets: ${workbook.SheetNames.length}\n`);

workbook.SheetNames.forEach((sheetName, index) => {
  console.log(`Sheet ${index + 1}: "${sheetName}"`);
  
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  // Show headers (first row)
  console.log('  Headers:', data[0]);
  
  // Show first data row
  if (data[1]) {
    console.log('  Sample data:', data[1]);
  }
  
  // Show total rows
  console.log(`  Total rows: ${data.length - 1}`);
  console.log('');
});