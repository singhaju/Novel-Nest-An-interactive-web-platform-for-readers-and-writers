import type { PrismaClient } from "@prisma/client"

// Installs MySQL stored procedures and triggers required by the project rubric.
// Run via the admin installer API (see app/api/admin/db-features/route.ts).
export async function installAdvancedSqlFeatures(prisma: PrismaClient) {
  const statements = [
    // Stored procedure for upserting reading progress.
    `DROP PROCEDURE IF EXISTS UpdateReadingProgress`,
    `CREATE PROCEDURE UpdateReadingProgress(IN p_user_id INT, IN p_novel_id INT, IN p_episode_id INT)
BEGIN
  INSERT INTO user_reading_progress (user_id, novel_id, last_read_episode_id, updated_at)
  VALUES (p_user_id, p_novel_id, p_episode_id, NOW())
  ON DUPLICATE KEY UPDATE
    last_read_episode_id = VALUES(last_read_episode_id),
    updated_at = NOW();
  SELECT user_id, novel_id, last_read_episode_id, updated_at
  FROM user_reading_progress
  WHERE user_id = p_user_id AND novel_id = p_novel_id;
END`,

    // Trigger to refresh novel rating after a new review is added.
    `DROP TRIGGER IF EXISTS tr_reviews_after_insert`,
    `CREATE TRIGGER tr_reviews_after_insert
AFTER INSERT ON reviews
FOR EACH ROW
UPDATE novels
SET rating = (
  SELECT IFNULL(ROUND(AVG(r.rating), 2), 0)
  FROM reviews r
  WHERE r.novel_id = NEW.novel_id
)
WHERE novel_id = NEW.novel_id`,

    // Trigger to refresh novel rating after a review is updated.
    `DROP TRIGGER IF EXISTS tr_reviews_after_update`,
    `CREATE TRIGGER tr_reviews_after_update
AFTER UPDATE ON reviews
FOR EACH ROW
UPDATE novels
SET rating = (
  SELECT IFNULL(ROUND(AVG(r.rating), 2), 0)
  FROM reviews r
  WHERE r.novel_id = NEW.novel_id
)
WHERE novel_id = NEW.novel_id`,

    // Trigger to refresh novel rating after a review is deleted.
    `DROP TRIGGER IF EXISTS tr_reviews_after_delete`,
    `CREATE TRIGGER tr_reviews_after_delete
AFTER DELETE ON reviews
FOR EACH ROW
UPDATE novels
SET rating = (
  SELECT IFNULL(ROUND(AVG(r.rating), 2), 0)
  FROM reviews r
  WHERE r.novel_id = OLD.novel_id
)
WHERE novel_id = OLD.novel_id`,
  ]

  for (const statement of statements) {
    await prisma.$executeRawUnsafe(statement)
  }
}
