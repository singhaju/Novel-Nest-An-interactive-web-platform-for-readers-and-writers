#!/usr/bin/env node
/**
 * Update Novel Cover URLs to use SVG placeholders from public folder
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

const coverUpdates = [
  {
    novelId: 2001,
    title: 'Pride and Prejudice',
    filename: 'pride-and-prejudice.svg'
  },
  {
    novelId: 2002,
    title: 'Dune',
    filename: 'dune.svg'
  },
  {
    novelId: 2003,
    title: 'The Hobbit',
    filename: 'the-hobbit.svg'
  },
  {
    novelId: 2004,
    title: 'To Kill a Mockingbird',
    filename: 'to-kill-a-mockingbird.svg'
  },
  {
    novelId: 2005,
    title: 'Nineteen Eighty-Four',
    filename: 'nineteen-eighty-four.svg'
  }
];

async function updateCovers() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Johnny2005!',
    database: process.env.DB_NAME || 'novel_nest'
  });

  try {
    console.log('🔄 Updating novel cover URLs to use SVG placeholders...\n');
    
    for (const update of coverUpdates) {
      const coverUrl = `/covers/${update.filename}`;
      const query = 'UPDATE `novels` SET `cover_image` = ? WHERE `novel_id` = ?';
      const [result] = await connection.execute(query, [coverUrl, update.novelId]);
      
      if (result.affectedRows > 0) {
        console.log(`✅ ${update.title} (ID: ${update.novelId})`);
        console.log(`   URL: ${coverUrl}\n`);
      } else {
        console.log(`⚠️  ${update.title} (ID: ${update.novelId}) - NOT FOUND\n`);
      }
    }

    console.log('✨ All novel covers updated with SVG placeholders!');
    console.log('📁 SVG files are in: code/public/covers/');
    console.log('🔄 Restart your dev server to see the changes.\n');
    console.log('💡 To use real images later:');
    console.log('   1. Replace the .svg files with .jpg/.png files');
    console.log('   2. Update the database with the new filenames\n');
  } catch (error) {
    console.error('❌ Error updating covers:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

updateCovers();
