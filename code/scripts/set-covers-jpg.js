#!/usr/bin/env node
/**
 * Update Novel Cover URLs to use JPG/PNG images from public folder
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

const coverUpdates = [
  {
    novelId: 2001,
    title: 'Pride and Prejudice',
    filename: 'pride-and-prejudice.jpg'  // Change to .png if you use PNG
  },
  {
    novelId: 2002,
    title: 'Dune',
    filename: 'dune.jpg'
  },
  {
    novelId: 2003,
    title: 'The Hobbit',
    filename: 'the-hobbit.jpg'
  },
  {
    novelId: 2004,
    title: 'To Kill a Mockingbird',
    filename: 'to-kill-a-mockingbird.jpg'
  },
  {
    novelId: 2005,
    title: 'Nineteen Eighty-Four',
    filename: 'nineteen-eighty-four.jpg'
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
    console.log('🔄 Updating novel cover URLs to use JPG images...\n');
    
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

    console.log('✨ All novel covers updated to use JPG images!');
    console.log('📁 Make sure your images are in: code/public/covers/');
    console.log('🔄 Refresh your browser to see the changes.\n');
  } catch (error) {
    console.error('❌ Error updating covers:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

updateCovers();
