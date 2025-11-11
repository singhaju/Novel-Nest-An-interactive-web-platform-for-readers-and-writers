#!/usr/bin/env node
/**
 * Update Novel Cover URLs to use Drive preview format (better for browsers)
 * Changes from usercontent.google.com/download to drive.google.com/uc?export=view
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

const coverUpdates = [
  {
    novelId: 2001,
    title: 'Pride and Prejudice',
    fileId: '1fikkiUDAxi57hBn-oBowVmcIKHsY7_R8'
  },
  {
    novelId: 2002,
    title: 'Dune',
    fileId: '1yiUV456DafL5ttuonQ0KC27_glTOY6Pg'
  },
  {
    novelId: 2003,
    title: 'The Hobbit',
    fileId: '1oW2gfm4eBjmav726sWnUAY6jZL3JHryo'
  },
  {
    novelId: 2004,
    title: 'To Kill a Mockingbird',
    fileId: '1WHNOdr0HK01NcKogF4JlbuKh-laeeIxj'
  },
  {
    novelId: 2005,
    title: 'Nineteen Eighty-Four',
    fileId: '1W_u6JGlDacrDmVqYPF2J8uqBiSWz-UWq'
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
    console.log('🔄 Updating novel cover URLs to Drive preview format...\n');
    
    for (const update of coverUpdates) {
      // Use the drive.google.com/uc?export=view format which works better in browsers
      const coverUrl = `https://drive.google.com/uc?export=view&id=${update.fileId}`;
      const query = 'UPDATE `novels` SET `cover_image` = ? WHERE `novel_id` = ?';
      const [result] = await connection.execute(query, [coverUrl, update.novelId]);
      
      if (result.affectedRows > 0) {
        console.log(`✅ ${update.title} (ID: ${update.novelId})`);
        console.log(`   URL: ${coverUrl}\n`);
      } else {
        console.log(`⚠️  ${update.title} (ID: ${update.novelId}) - NOT FOUND\n`);
      }
    }

    console.log('✨ All novel covers updated to preview format!');
  } catch (error) {
    console.error('❌ Error updating covers:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

updateCovers();
