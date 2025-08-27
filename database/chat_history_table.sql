-- Chat History Table for AI Chat Functionality
-- This table stores user messages and AI responses

CREATE TABLE IF NOT EXISTS `chatHistory` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(11) NOT NULL,
  `message` text NOT NULL,
  `response` text NOT NULL,
  `timestamp` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `type` varchar(20) DEFAULT 'chat',
  PRIMARY KEY (`id`),
  KEY `userid` (`userid`),
  CONSTRAINT `chathistory_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Add some sample chat history for testing
INSERT INTO `chatHistory` (`userid`, `message`, `response`, `timestamp`, `type`) VALUES
(1, 'Hello, how are you?', 'Hello! I am doing well, thank you for asking. I am here to help you with any health-related questions you may have. How can I assist you today?', NOW(), 'chat'),
(1, 'What are the symptoms of a cold?', 'Common cold symptoms include runny or stuffy nose, sore throat, cough, mild fever, and fatigue. These usually develop 1-3 days after exposure and can last 7-10 days. Rest, fluids, and over-the-counter medications can help manage symptoms.', NOW(), 'chat'); 