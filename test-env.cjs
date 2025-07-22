const path = require('path');
const fs = require('fs');

const envPath = path.resolve(process.cwd(), '.env');

console.log('Checking for .env file at:', envPath);

try {
  const fileContent = fs.readFileSync(envPath, { encoding: 'utf8' });
  console.log('Successfully read .env file content:');
  console.log('--- START --- ');
  console.log(fileContent);
  console.log('--- END --- ');

  // Basic check if the DATABASE_URL key is in the string
  if (fileContent.includes('DATABASE_URL=')) {
    console.log('File content seems to contain DATABASE_URL key.');
  } else {
    console.warn('File content does NOT seem to contain DATABASE_URL key.');
  }

  // Now try with dotenv again, just in case
  require('dotenv').config({ path: envPath });
  console.log('DATABASE_URL from process.env after dotenv:', process.env.DATABASE_URL);
  if (process.env.DATABASE_URL) {
    console.log('Successfully loaded DATABASE_URL via dotenv.');
  } else {
    console.error('Failed to load DATABASE_URL via dotenv despite file being readable.');
  }

} catch (error) {
  console.error('Error reading .env file:', error.message);
  if (error.code === 'ENOENT') {
    console.error('File not found. Please ensure .env exists at the specified path.');
  } else {
    console.error('File may exist but could not be read (permissions? encoding issues?).');
  }
} 