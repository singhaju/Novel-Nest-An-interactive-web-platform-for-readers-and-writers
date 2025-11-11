#!/usr/bin/env node
/**
 * Update Novel Cover URLs to use Google Drive direct image links
 * This uses the open.php endpoint which sometimes works better than thumbnail
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

// Extract file IDs from your links
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

// Try using the open.php direct link format
function getDirectImageUrl(fileId) {
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

async function updateCovers() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Johnny2005!',
    database: process.env.DB_NAME || 'novel_nest'
  });

  try {
    console.log('🔄 Updating novel cover URLs to Google Drive direct links...\n');
    
    for (const update of coverUpdates) {
      const coverUrl = getDirectImageUrl(update.fileId);
      const query = 'UPDATE `novels` SET `cover_image` = ? WHERE `novel_id` = ?';
      const [result] = await connection.execute(query, [coverUrl, update.novelId]);
      
      if (result.affectedRows > 0) {
        console.log(`✅ ${update.title} (ID: ${update.novelId})`);
        console.log(`   URL: ${coverUrl}\n`);
      } else {
        console.log(`⚠️  ${update.title} (ID: ${update.novelId}) - NOT FOUND\n`);
      }
    }

    console.log('✨ All novel covers updated!');
    console.log('\n⚠️  IMPORTANT: Google Drive images may still not display due to:');
    console.log('   - Authentication requirements');
    console.log('   - CORS restrictions');
    console.log('   - Rate limiting\n');
    console.log('💡 For reliable image hosting, consider:');
    console.log('   1. Uploading images to your server\'s public folder');
    console.log('   2. Using Cloudinary, Imgur, or AWS S3');
    console.log('   3. Using a proper CDN service\n');
  } catch (error) {
    console.error('❌ Error updating covers:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

updateCovers();
