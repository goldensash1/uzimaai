-- UzimaAI Admin Dashboard - Bulk Data Insertion
-- This script adds 10 rows of sample data to each table

-- Clear existing data (except admin users)
DELETE FROM medecineReviews;
DELETE FROM searchHistory;
DELETE FROM userHistory;
DELETE FROM userContext;
DELETE FROM users WHERE userid > 2;
DELETE FROM medecines WHERE medicineId > 3;

-- Reset auto-increment counters
ALTER TABLE users AUTO_INCREMENT = 3;
ALTER TABLE medecines AUTO_INCREMENT = 4;
ALTER TABLE medecineReviews AUTO_INCREMENT = 1;
ALTER TABLE searchHistory AUTO_INCREMENT = 1;
ALTER TABLE userHistory AUTO_INCREMENT = 1;
ALTER TABLE userContext AUTO_INCREMENT = 1;

-- Insert 10 sample users
INSERT INTO users (username, useremail, phone, emergencyphone, userpassword, userstatus) VALUES
('Alice Johnson', 'alice@example.com', '+1234567891', '+1234567892', '$2a$12$h6dBAx2AbzFSDwJImGwAe.1lzWQfAHtbk1mKeX9Dy9xLvvJBwdsjy', 'active'),
('Bob Smith', 'bob@example.com', '+1234567893', '+1234567894', '$2a$12$h6dBAx2AbzFSDwJImGwAe.1lzWQfAHtbk1mKeX9Dy9xLvvJBwdsjy', 'active'),
('Carol Davis', 'carol@example.com', '+1234567895', '+1234567896', '$2a$12$h6dBAx2AbzFSDwJImGwAe.1lzWQfAHtbk1mKeX9Dy9xLvvJBwdsjy', 'active'),
('David Wilson', 'david@example.com', '+1234567897', '+1234567898', '$2a$12$h6dBAx2AbzFSDwJImGwAe.1lzWQfAHtbk1mKeX9Dy9xLvvJBwdsjy', 'active'),
('Emma Brown', 'emma@example.com', '+1234567899', '+1234567900', '$2a$12$h6dBAx2AbzFSDwJImGwAe.1lzWQfAHtbk1mKeX9Dy9xLvvJBwdsjy', 'active'),
('Frank Miller', 'frank@example.com', '+1234567901', '+1234567902', '$2a$12$h6dBAx2AbzFSDwJImGwAe.1lzWQfAHtbk1mKeX9Dy9xLvvJBwdsjy', 'active'),
('Grace Taylor', 'grace@example.com', '+1234567903', '+1234567904', '$2a$12$h6dBAx2AbzFSDwJImGwAe.1lzWQfAHtbk1mKeX9Dy9xLvvJBwdsjy', 'active'),
('Henry Anderson', 'henry@example.com', '+1234567905', '+1234567906', '$2a$12$h6dBAx2AbzFSDwJImGwAe.1lzWQfAHtbk1mKeX9Dy9xLvvJBwdsjy', 'active'),
('Ivy Martinez', 'ivy@example.com', '+1234567907', '+1234567908', '$2a$12$h6dBAx2AbzFSDwJImGwAe.1lzWQfAHtbk1mKeX9Dy9xLvvJBwdsjy', 'active'),
('Jack Thompson', 'jack@example.com', '+1234567909', '+1234567910', '$2a$12$h6dBAx2AbzFSDwJImGwAe.1lzWQfAHtbk1mKeX9Dy9xLvvJBwdsjy', 'active');

-- Insert 10 sample medicines
INSERT INTO medecines (medicineName, medicineUses, medicineSideEffects, medicineAlternatives, medicineStatus, updatedDate) VALUES
('Aspirin', 'Pain relief, fever reduction, blood thinning', 'Stomach irritation, bleeding risk, allergic reactions', 'Ibuprofen, Acetaminophen, Naproxen', 1, NOW()),
('Lisinopril', 'High blood pressure, heart failure treatment', 'Dry cough, dizziness, low blood pressure', 'Enalapril, Ramipril, Captopril', 1, NOW()),
('Metformin', 'Type 2 diabetes management', 'Nausea, diarrhea, lactic acidosis risk', 'Sulfonylureas, DPP-4 inhibitors, SGLT2 inhibitors', 1, NOW()),
('Atorvastatin', 'High cholesterol treatment', 'Muscle pain, liver problems, digestive issues', 'Simvastatin, Rosuvastatin, Pravastatin', 1, NOW()),
('Omeprazole', 'Acid reflux, stomach ulcer treatment', 'Headache, diarrhea, vitamin B12 deficiency', 'Lansoprazole, Pantoprazole, Esomeprazole', 1, NOW()),
('Amlodipine', 'High blood pressure, chest pain treatment', 'Swelling, dizziness, flushing', 'Nifedipine, Diltiazem, Verapamil', 1, NOW()),
('Losartan', 'High blood pressure, kidney protection', 'Dizziness, fatigue, high potassium', 'Valsartan, Irbesartan, Candesartan', 1, NOW()),
('Sertraline', 'Depression, anxiety treatment', 'Nausea, insomnia, sexual dysfunction', 'Fluoxetine, Escitalopram, Paroxetine', 1, NOW()),
('Albuterol', 'Asthma, breathing problems relief', 'Tremors, increased heart rate, nervousness', 'Salmeterol, Formoterol, Levalbuterol', 1, NOW()),
('Warfarin', 'Blood clot prevention', 'Bleeding risk, bruising, drug interactions', 'Dabigatran, Rivaroxaban, Apixaban', 1, NOW());

-- Insert 10 sample medicine reviews (using existing medicine IDs)
INSERT INTO medecineReviews (UserId, medicineId, ReviewMessage, rating, reviewStatus, reviewDate) VALUES
(3, 1, 'Great pain relief, works quickly for headaches', 5, 1, NOW()),
(4, 1, 'Effective but causes stomach upset', 3, 1, NOW()),
(5, 2, 'Helped lower my blood pressure significantly', 5, 1, NOW()),
(6, 2, 'Good medication but causes dry cough', 4, 0, NOW()),
(7, 3, 'Excellent for diabetes management', 5, 1, NOW()),
(8, 3, 'Works well but causes some digestive issues', 4, 1, NOW()),
(9, 4, 'Lowered my cholesterol effectively', 5, 1, NOW()),
(10, 4, 'Good results but some muscle pain', 3, 1, NOW()),
(11, 5, 'Relieved my acid reflux completely', 5, 1, NOW()),
(12, 5, 'Effective but expensive', 4, 1, NOW());

-- Insert 10 sample search history entries
INSERT INTO searchHistory (userid, searchContent, searchTime) VALUES
(3, 'headache medicine', NOW()),
(4, 'blood pressure medication', NOW()),
(5, 'diabetes treatment', NOW()),
(6, 'cholesterol lowering drugs', NOW()),
(7, 'acid reflux relief', NOW()),
(8, 'asthma inhaler', NOW()),
(9, 'depression medication', NOW()),
(10, 'pain relief options', NOW()),
(11, 'blood thinner alternatives', NOW()),
(12, 'side effects of metformin', NOW());

-- Insert 10 sample user history entries
INSERT INTO userHistory (userId, actionType, actionContent, actionTime) VALUES
(3, 'login', 'User logged in successfully', NOW()),
(3, 'search', 'Searched for headache medicine', NOW()),
(4, 'login', 'User logged in successfully', NOW()),
(4, 'review', 'Posted review for aspirin', NOW()),
(5, 'login', 'User logged in successfully', NOW()),
(5, 'search', 'Searched for blood pressure medication', NOW()),
(6, 'login', 'User logged in successfully', NOW()),
(6, 'review', 'Posted review for lisinopril', NOW()),
(7, 'login', 'User logged in successfully', NOW()),
(7, 'search', 'Searched for diabetes treatment', NOW());

-- Insert 10 sample user context entries
INSERT INTO userContext (userId, contextContent, contextTime) VALUES
(3, 'User has frequent headaches and looking for pain relief', NOW()),
(4, 'User has high blood pressure and seeking medication', NOW()),
(5, 'User has type 2 diabetes and managing treatment', NOW()),
(6, 'User has high cholesterol and exploring options', NOW()),
(7, 'User has acid reflux and seeking relief', NOW()),
(8, 'User has asthma and managing symptoms', NOW()),
(9, 'User has depression and seeking treatment', NOW()),
(10, 'User has chronic pain and exploring options', NOW()),
(11, 'User has blood clot risk and seeking prevention', NOW()),
(12, 'User has diabetes and managing side effects', NOW());

-- Display summary of inserted data
SELECT 'Bulk data insertion completed successfully!' as status;
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_medicines FROM medecines;
SELECT COUNT(*) as total_reviews FROM medecineReviews;
SELECT COUNT(*) as total_searches FROM searchHistory;
SELECT COUNT(*) as total_history FROM userHistory;
SELECT COUNT(*) as total_context FROM userContext; 