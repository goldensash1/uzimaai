-- Simple UzimaAI Admin Dashboard Database Initialization

-- Create admin user (password: admin123)
INSERT IGNORE INTO admin (adminUsername, adminEmail, adminPassword, adminStatus) 
VALUES ('admin', 'admin@uzimaai.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3ZxQQxq3Hy', 'active');

-- Insert sample medicines
INSERT IGNORE INTO medecines (medicineName, medicineUses, medicineSideEffects, medicineAlternatives, medicineStatus, updatedDate) VALUES
('Paracetamol', 'Pain relief and fever reduction', 'Nausea, stomach upset, allergic reactions', 'Ibuprofen, Aspirin', 1, NOW()),
('Ibuprofen', 'Anti-inflammatory pain relief', 'Stomach irritation, dizziness, rash', 'Paracetamol, Naproxen', 1, NOW()),
('Amoxicillin', 'Antibiotic for bacterial infections', 'Diarrhea, nausea, allergic reactions', 'Penicillin, Erythromycin', 1, NOW());

-- Insert sample users
INSERT IGNORE INTO users (username, useremail, phone, emergencyphone, userpassword, userstatus) VALUES
('John Doe', 'john@example.com', '+1234567890', '+1234567891', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3ZxQQxq3Hy', 'active'),
('Jane Smith', 'jane@example.com', '+1234567892', '+1234567893', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3ZxQQxq3Hy', 'active');

-- Display confirmation
SELECT 'Database initialized successfully!' as status;
SELECT COUNT(*) as admin_count FROM admin;
SELECT COUNT(*) as medicine_count FROM medecines;
SELECT COUNT(*) as user_count FROM users; 