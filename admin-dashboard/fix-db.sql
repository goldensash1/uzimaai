-- Fix database schema for UzimaAI Admin Dashboard

-- Add medicineId column to medecineReviews table if it doesn't exist
ALTER TABLE medecineReviews ADD COLUMN IF NOT EXISTS medicineId int;

-- Add foreign key constraint if it doesn't exist
-- ALTER TABLE medecineReviews ADD CONSTRAINT fk_medicine_review FOREIGN KEY (medicineId) REFERENCES medecines(medicineId);

-- Add auto-increment to primary keys if not already set
ALTER TABLE admin MODIFY adminId int AUTO_INCREMENT;
ALTER TABLE users MODIFY userid int AUTO_INCREMENT;
ALTER TABLE medecines MODIFY medicineId int AUTO_INCREMENT;
ALTER TABLE medecineReviews MODIFY riviewId int AUTO_INCREMENT;
ALTER TABLE searchHistory MODIFY searchId int AUTO_INCREMENT;
ALTER TABLE userHistory MODIFY historyId int AUTO_INCREMENT;
ALTER TABLE userContext MODIFY contextId int AUTO_INCREMENT;

-- Display table structures
SELECT 'Database schema fixed successfully!' as status; 