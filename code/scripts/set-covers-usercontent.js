#!/usr/bin/env node
/**
 * Update Novel Cover URLs to use drive.usercontent.google.com direct download links
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

const coverUpdates = [
  {
    novelId: 2001,
    title: 'Pride and Prejudice',
    coverUrl: 'https://drive.usercontent.google.com/download?id=1fikkiUDAxi57hBn-oBowVmcIKHsY7_R8'
  },
  {
    novelId: 2002,
    title: 'Dune',
    coverUrl: 'https://drive.usercontent.google.com/download?id=1yiUV456DafL5ttuonQ0KC27_glTOY6Pg&authuser=1'
  },
  {
    novelId: 2003,
    title: 'The Hobbit',
    coverUrl: 'https://drive.usercontent.google.com/download?id=1oW2gfm4eBjmav726sWnUAY6jZL3JHryo'
  },
  {
    novelId: 2004,
    title: 'To Kill a Mockingbird',
    coverUrl: 'https://drive.usercontent.google.com/download?id=1WHNOdr0HK01NcKogF4JlbuKh-laeeIxj'
  },
  {
    novelId: 2005,
    title: 'Nineteen Eighty-Four',
    coverUrl: 'https://drive.usercontent.google.com/download?id=1W_u6JGlDacrDmVqYPF2J8uqBiSWz-UWq&authuser=1'
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
    console.log('🔄 Updating novel cover URLs to usercontent.google.com links...\n');
    
    for (const update of coverUpdates) {
      const query = 'UPDATE `novels` SET `cover_image` = ? WHERE `novel_id` = ?';
      const [result] = await connection.execute(query, [update.coverUrl, update.novelId]);
      
      if (result.affectedRows > 0) {
        console.log(`✅ ${update.title} (ID: ${update.novelId})`);
        console.log(`   URL: ${update.coverUrl}\n`);
      } else {
        console.log(`⚠️  ${update.title} (ID: ${update.novelId}) - NOT FOUND\n`);
      }
    }

    console.log('✨ All novel covers updated to usercontent.google.com links!');
  } catch (error) {
    console.error('❌ Error updating covers:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

updateCovers();
