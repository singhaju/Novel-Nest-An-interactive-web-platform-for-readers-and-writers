#!/usr/bin/env node
/**
 * Update Novel Cover URLs to use Imgur links
 * 
 * INSTRUCTIONS:
 * 1. Upload your images to https://imgur.com/upload
 * 2. Right-click each image → "Copy image address"
 * 3. Paste the URLs below (replace the placeholder URLs)
 * 4. Run: node scripts/set-covers-imgur.js
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

const coverUpdates = [
  {
    novelId: 2001,
    title: 'Pride and Prejudice',
    imageUrl: 'https://i.ibb.co/VYHcwFGX/Pride-and-Prejudice.jpg'
  },
  {
    novelId: 2002,
    title: 'Dune',
    imageUrl: 'https://i.ibb.co/xSPk0Q2c/Dune.webp'
  },
  {
    novelId: 2003,
    title: 'The Hobbit',
    imageUrl: 'https://i.ibb.co/ZZnMQjm/The-Hobbit.jpg'
  },
  {
    novelId: 2004,
    title: 'To Kill a Mockingbird',
    imageUrl: 'https://i.ibb.co/bMJy6KL4/To-Kill-a-Mockingbird.jpg'
  },
  {
    novelId: 2005,
    title: 'Nineteen Eighty-Four',
    imageUrl: 'https://i.ibb.co/HTqnTZc9/Nineteen-Eighty-Four.jpg'
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
    console.log('🔄 Updating novel cover URLs to use Imgur links...\n');
    
    for (const update of coverUpdates) {
      if (update.imageUrl.includes('YOUR_IMAGE')) {
        console.log(`⚠️  ${update.title} - PLEASE UPDATE THE URL IN THE SCRIPT FIRST!\n`);
        continue;
      }
      
      const query = 'UPDATE `novels` SET `cover_image` = ? WHERE `novel_id` = ?';
      const [result] = await connection.execute(query, [update.imageUrl, update.novelId]);
      
      if (result.affectedRows > 0) {
        console.log(`✅ ${update.title} (ID: ${update.novelId})`);
        console.log(`   URL: ${update.imageUrl}\n`);
      } else {
        console.log(`⚠️  ${update.title} (ID: ${update.novelId}) - NOT FOUND\n`);
      }
    }

    console.log('✨ Novel covers updated with Imgur links!');
    console.log('🔄 Refresh your browser to see the changes.\n');
  } catch (error) {
    console.error('❌ Error updating covers:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

updateCovers();
