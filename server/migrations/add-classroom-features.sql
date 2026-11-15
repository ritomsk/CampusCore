-- ============================================
-- CampusCore - Google Classroom Features Migration
-- Phase 1: Database Schema Updates
-- ============================================

USE campuscore;

-- ============================================
-- Task 1.1: Update batches table
-- ============================================

-- Add new columns to batches table (check if they exist first)
SET @sql = IF((SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE table_schema='campuscore' AND table_name='batches' AND column_name='batch_name') = 0,
              'ALTER TABLE batches ADD COLUMN batch_name VARCHAR(100) COMMENT ''User-friendly batch name''',
              'SELECT ''batch_name already exists''');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = IF((SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE table_schema='campuscore' AND table_name='batches' AND column_name='section') = 0,
              'ALTER TABLE batches ADD COLUMN section VARCHAR(10) DEFAULT ''A'' COMMENT ''Section identifier''',
              'SELECT ''section already exists''');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = IF((SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE table_schema='campuscore' AND table_name='batches' AND column_name='class_code') = 0,
              'ALTER TABLE batches ADD COLUMN class_code VARCHAR(8) UNIQUE COMMENT ''Unique 8-character code''',
              'SELECT ''class_code already exists''');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = IF((SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE table_schema='campuscore' AND table_name='batches' AND column_name='enrollment_mode') = 0,
              'ALTER TABLE batches ADD COLUMN enrollment_mode ENUM(''open'', ''request'', ''invite_only'') DEFAULT ''request''',
              'SELECT ''enrollment_mode already exists''');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Generate unique class codes for existing batches
-- Using a function to generate random 8-character codes
SET @chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

UPDATE batches 
SET class_code = CONCAT(
  SUBSTRING(@chars, FLOOR(1 + (RAND() * 33)), 1),
  SUBSTRING(@chars, FLOOR(1 + (RAND() * 33)), 1),
  SUBSTRING(@chars, FLOOR(1 + (RAND() * 33)), 1),
  SUBSTRING(@chars, FLOOR(1 + (RAND() * 33)), 1),
  SUBSTRING(@chars, FLOOR(1 + (RAND() * 33)), 1),
  SUBSTRING(@chars, FLOOR(1 + (RAND() * 33)), 1),
  SUBSTRING(@chars, FLOOR(1 + (RAND() * 33)), 1),
  SUBSTRING(@chars, FLOOR(1 + (RAND() * 33)), 1)
)
WHERE class_code IS NULL;

-- Set default batch names based on existing data
UPDATE batches b
JOIN courses c ON b.course_code = c.course_code
SET b.batch_name = CONCAT(c.title, ' ', b.semester, ' ', b.academic_year)
WHERE b.batch_name IS NULL;

-- ============================================
-- Task 1.2: Create announcements table
-- ============================================

CREATE TABLE IF NOT EXISTS announcements (
  announcement_id INT AUTO_INCREMENT PRIMARY KEY,
  batch_id VARCHAR(50) NOT NULL,
  prof_id VARCHAR(20) NOT NULL,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  attachment_url VARCHAR(255),
  priority ENUM('normal', 'important', 'urgent') DEFAULT 'normal',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (batch_id) REFERENCES batches(batch_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (prof_id) REFERENCES professors(prof_id) ON DELETE CASCADE ON UPDATE CASCADE,
  
  INDEX idx_batch_announcements (batch_id, created_at),
  INDEX idx_professor_announcements (prof_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Batch announcements and communication';

-- ============================================
-- Task 1.3: Update course_materials table
-- ============================================

-- Add new columns to course_materials
SET @sql = IF((SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE table_schema='campuscore' AND table_name='course_materials' AND column_name='total_points') = 0,
              'ALTER TABLE course_materials ADD COLUMN total_points INT DEFAULT 100 COMMENT ''Total points for assignments''',
              'SELECT ''total_points already exists''');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = IF((SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE table_schema='campuscore' AND table_name='course_materials' AND column_name='topic') = 0,
              'ALTER TABLE course_materials ADD COLUMN topic VARCHAR(200) COMMENT ''Topic/category''',
              'SELECT ''topic already exists''');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Set default total_points for existing assignments
UPDATE course_materials
SET total_points = 100
WHERE type = 'Assignment' AND total_points IS NULL;

-- ============================================
-- Task 1.4: Update submissions table
-- ============================================

-- Add grading columns to submissions
SET @sql = IF((SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE table_schema='campuscore' AND table_name='submissions' AND column_name='obtained_marks') = 0,
              'ALTER TABLE submissions ADD COLUMN obtained_marks DECIMAL(5, 2) COMMENT ''Marks awarded''',
              'SELECT ''obtained_marks already exists''');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = IF((SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE table_schema='campuscore' AND table_name='submissions' AND column_name='graded_at') = 0,
              'ALTER TABLE submissions ADD COLUMN graded_at DATETIME COMMENT ''Grading timestamp''',
              'SELECT ''graded_at already exists''');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = IF((SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE table_schema='campuscore' AND table_name='submissions' AND column_name='graded_by') = 0,
              'ALTER TABLE submissions ADD COLUMN graded_by VARCHAR(20) COMMENT ''prof_id who graded''',
              'SELECT ''graded_by already exists''');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = IF((SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE table_schema='campuscore' AND table_name='submissions' AND column_name='feedback') = 0,
              'ALTER TABLE submissions ADD COLUMN feedback TEXT COMMENT ''Professor feedback''',
              'SELECT ''feedback already exists''');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add foreign key for graded_by
ALTER TABLE submissions
ADD CONSTRAINT fk_submission_grader 
FOREIGN KEY (graded_by) REFERENCES professors(prof_id) 
ON DELETE SET NULL ON UPDATE CASCADE;

-- Add index for faster queries on unmarked submissions
ALTER TABLE submissions
ADD INDEX idx_unmarked_submissions (material_id, obtained_marks);

-- ============================================
-- Verification Queries
-- ============================================

-- Check batches table structure
DESCRIBE batches;

-- Check if class codes are unique
SELECT COUNT(*) as total_batches, COUNT(DISTINCT class_code) as unique_codes 
FROM batches;

-- Check announcements table
DESCRIBE announcements;

-- Check course_materials updates
DESCRIBE course_materials;

-- Check submissions updates
DESCRIBE submissions;

-- ============================================
-- Sample Data for Testing
-- ============================================

-- Insert sample announcements (optional)
INSERT INTO announcements (batch_id, prof_id, title, content, priority) 
SELECT 
  b.batch_id,
  b.prof_id,
  'Welcome to the Course!' as title,
  CONCAT('Welcome to ', c.title, '! This batch has been migrated to the new classroom interface.') as content,
  'important' as priority
FROM batches b
JOIN courses c ON b.course_code = c.course_code
WHERE b.status = 'Active'
LIMIT 5;

-- ============================================
-- Migration Complete
-- ============================================

SELECT 'Migration completed successfully!' as status;
SELECT CONCAT('Total batches updated: ', COUNT(*)) as summary FROM batches WHERE class_code IS NOT NULL;
SELECT CONCAT('Announcements table ready: ', COUNT(*)) as summary FROM announcements;
