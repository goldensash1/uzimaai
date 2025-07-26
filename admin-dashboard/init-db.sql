-- UzimaAI Admin Dashboard Database Initialization
-- Run this script after importing the main database schema

-- Create admin user (password: admin123) - only if not exists
INSERT IGNORE INTO admin (adminUsername, adminEmail, adminPassword, adminStatus) 
VALUES ('admin', 'admin@uzimaai.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3ZxQQxq3Hy', 'active');

-- Create a super admin user (password: superadmin123) - only if not exists
INSERT IGNORE INTO admin (adminUsername, adminEmail, adminPassword, adminStatus) 
VALUES ('superadmin', 'superadmin@uzimaai.com', '$2a$12$8K1p/a0dL1LXMIgoEDFrwOfgqwAG6qYbJhJhJhJhJhJhJhJhJhJhJ', 'super_admin');

-- Insert sample medicines for testing - only if not exists
INSERT IGNORE INTO medecines (medicineName, medicineUses, medicineSideEffects, medicineAlternatives, medicineStatus, updatedDate) VALUES
('Paracetamol', 'Pain relief and fever reduction', 'Nausea, stomach upset, allergic reactions', 'Ibuprofen, Aspirin', 1, NOW()),
('Ibuprofen', 'Anti-inflammatory pain relief', 'Stomach irritation, dizziness, rash', 'Paracetamol, Naproxen', 1, NOW()),
('Amoxicillin', 'Antibiotic for bacterial infections', 'Diarrhea, nausea, allergic reactions', 'Penicillin, Erythromycin', 1, NOW()),
('Omeprazole', 'Reduces stomach acid production', 'Headache, diarrhea, abdominal pain', 'Lansoprazole, Pantoprazole', 1, NOW()),
('Metformin', 'Diabetes medication', 'Nausea, diarrhea, lactic acidosis', 'Sulfonylureas, DPP-4 inhibitors', 1, NOW());

-- Insert sample users for testing - only if not exists
INSERT IGNORE INTO users (username, useremail, phone, emergencyphone, userpassword, userstatus) VALUES
('John Doe', 'john@example.com', '+1234567890', '+1234567891', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3ZxQQxq3Hy', 'active'),
('Jane Smith', 'jane@example.com', '+1234567892', '+1234567893', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3ZxQQxq3Hy', 'active'),
('Mike Johnson', 'mike@example.com', '+1234567894', '+1234567895', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3ZxQQxq3Hy', 'active');

-- Insert sample medicine reviews - only if not exists
INSERT IGNORE INTO medecineReviews (UserId, medicineId, ReviewMessage, rating, reviewStatus, reviewDate) VALUES
(1, 1, 'Great pain relief, works quickly', 5, 1, NOW()),
(2, 1, 'Effective for headaches', 4, 1, NOW()),
(3, 2, 'Good for inflammation', 4, 1, NOW()),
(1, 3, 'Helped with my infection', 5, 1, NOW()),
(2, 4, 'Reduced my acid reflux', 4, 0);

-- Insert sample search history - only if not exists
INSERT IGNORE INTO searchHistory (userid, searchContent, searchTime) VALUES
(1, 'headache medicine', NOW()),
(1, 'fever treatment', NOW()),
(2, 'antibiotics', NOW()),
(3, 'pain relief', NOW()),
(1, 'stomach acid', NOW());

-- Insert sample user history - only if not exists
INSERT IGNORE INTO userHistory (userId, actionType, actionContent, actionTime) VALUES
(1, 'login', 'User logged in', NOW()),
(1, 'search', 'Searched for headache medicine', NOW()),
(2, 'login', 'User logged in', NOW()),
(2, 'review', 'Posted medicine review', NOW()),
(3, 'login', 'User logged in', NOW());

-- Insert sample user context - only if not exists
INSERT IGNORE INTO userContext (userId, contextContent, contextTime) VALUES
(1, 'User has headache symptoms', NOW()),
(2, 'User has fever and looking for treatment', NOW()),
(3, 'User has inflammation pain', NOW());

-- Display confirmation
SELECT 'Database initialized successfully!' as status;
SELECT COUNT(*) as admin_count FROM admin;
SELECT COUNT(*) as medicine_count FROM medecines;
SELECT COUNT(*) as user_count FROM users; 