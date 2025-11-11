#!/usr/bin/env node
require('dotenv').config();
const mysql = require('mysql2/promise');

async function checkCovers() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Johnny2005!',
    database: process.env.DB_NAME || 'novel_nest'
  });

  try {
    const [rows] = await connection.execute('SELECT novel_id, title, cover_image FROM novels WHERE novel_id BETWEEN 2001 AND 2005');
    console.log('\n📚 Novel Cover URLs in Database:\n');
    rows.forEach((row) => {
      console.log(`ID ${row.novel_id}: ${row.title}`);
      console.log(`  Cover: ${row.cover_image}\n`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
  }
}

checkCovers();
