#!/usr/bin/env node
/**
 * Helper script to update novel covers to use local public folder images
 * After running this, copy your images to code/public/covers/ with these names:
 * - pride-and-prejudice.jpg
 * - dune.jpg  
 * - the-hobbit.jpg
 * - to-kill-a-mockingbird.jpg
 * - nineteen-eighty-four.jpg
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

const coverUpdates = [
  {
    novelId: 2001,
    title: 'Pride and Prejudice',
    filename: 'pride-and-prejudice.jpg'
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
    console.log('🔄 Updating novel cover URLs to use local public folder...\n');
    
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

    console.log('✨ All novel covers updated to use local public folder!\n');
    console.log('📁 Next steps:');
    console.log('   1. Create folder: code/public/covers/');
    console.log('   2. Download your images from Google Drive');
    console.log('   3. Save them with these names in code/public/covers/:');
    coverUpdates.forEach(u => console.log(`      - ${u.filename}`));
    console.log('   4. Restart your dev server\n');
  } catch (error) {
    console.error('❌ Error updating covers:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

updateCovers();
