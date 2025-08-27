<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../config/db.php';
require_once '../utils/response.php';
require_once '../config/ai_config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get input data
    $input_data = [];
    $content_type = isset($_SERVER['CONTENT_TYPE']) ? $_SERVER['CONTENT_TYPE'] : '';

    if (strpos($content_type, 'application/json') !== false) {
        $json_data = file_get_contents('php://input');
        $input_data = json_decode($json_data, true);
    } else {
        $input_data = $_POST;
    }

    // Validate input
    if (!isset($input_data['message']) || empty($input_data['message'])) {
        send_json(['error' => 'Message is required'], 400);
        exit;
    }

    if (!isset($input_data['userid']) || empty($input_data['userid'])) {
        send_json(['error' => 'User ID is required'], 400);
        exit;
    }

    $message = strtolower(trim($input_data['message']));
    $userid = $input_data['userid'];
    $message_type = isset($input_data['type']) ? $input_data['type'] : 'chat';

    // Try real AI first if API key is valid
    $ai_response = null;
    $ai_source = 'enhanced_local';
    
    if (isApiKeyValid($GROQ_API_KEY)) {
        $ai_response = tryRealAI($message, $message_type);
        if ($ai_response) {
            $ai_source = 'groq_ai';
        }
    }

    // If real AI failed, use enhanced local responses
    if (!$ai_response) {
        $ai_response = getEnhancedLocalResponse($message, $message_type);
    }

    // Add medicine recommendations
    $medicine_recommendations = getMedicineRecommendations($message);
    
    // Add diagnostic information
    $diagnostic_info = getDiagnosticInfo($message);

    // Save the conversation to database
    $timestamp = date('Y-m-d H:i:s');
    
    // Save user message
    $stmt = $conn->prepare("INSERT INTO chatHistory (userid, message, response, timestamp, type) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("issss", $userid, $input_data['message'], $ai_response, $timestamp, $message_type);
    
    if ($stmt->execute()) {
        send_json([
            'success' => true,
            'message' => $input_data['message'],
            'response' => $ai_response,
            'timestamp' => $timestamp,
            'type' => $message_type,
            'ai_source' => $ai_source,
            'medicine_recommendations' => $medicine_recommendations,
            'diagnostic_info' => $diagnostic_info,
            'note' => $ai_source === 'enhanced_local' ? 'Using enhanced local AI with medicine database. For real-time AI, please check API key configuration.' : 'Using real AI service.'
        ]);
    } else {
        send_json(['error' => 'Failed to save conversation'], 500);
    }
    
    $stmt->close();
} else {
    send_json(['error' => 'Method not allowed'], 405);
}

function tryRealAI($message, $message_type) {
    global $GROQ_API_KEY, $DEFAULT_MODEL, $TEMPERATURE, $MAX_TOKENS, $TOP_P;
    
    // Determine system message based on type
    if ($message_type === 'symptom') {
        $system_message = [
            "role" => "system",
            "content" => "You are a medical AI assistant. Analyze the symptoms described and provide a brief assessment. Keep responses concise (2-3 sentences maximum) as this is a free trial. Focus on common causes and when to seek medical attention. Do not provide definitive diagnoses."
        ];
    } else {
        $system_message = [
            "role" => "system",
            "content" => "You are a helpful medical AI assistant. Provide brief, informative responses to medical questions. Keep responses concise (2-3 sentences maximum) as this is a free trial. Focus on general health information and when to consult healthcare professionals."
        ];
    }

    $messages = [
        $system_message,
        [
            "role" => "user",
            "content" => $message
        ]
    ];

    $request_data = [
        "model" => $DEFAULT_MODEL,
        "messages" => $messages,
        "temperature" => $TEMPERATURE,
        "max_tokens" => $MAX_TOKENS,
        "top_p" => $TOP_P,
        "stream" => false
    ];

    $ch = curl_init('https://api.groq.com/openai/v1/chat/completions');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($request_data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $GROQ_API_KEY
    ]);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);

    $response = curl_exec($ch);
    $http_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($http_status === 200) {
        $response_data = json_decode($response, true);
        if (isset($response_data['choices'][0]['message']['content'])) {
            return $response_data['choices'][0]['message']['content'];
        }
    }
    
    return null;
}

function getEnhancedLocalResponse($message, $message_type) {
    $responses = [
        'headache' => [
            'symptom' => "Headaches can be caused by stress, dehydration, lack of sleep, or underlying conditions. Monitor frequency and severity. Seek medical attention if headaches are severe, persistent, or accompanied by other symptoms like vision changes or confusion.",
            'chat' => "Headaches are common and usually not serious. Try resting in a quiet, dark room, staying hydrated, and managing stress. Over-the-counter pain relievers like acetaminophen or ibuprofen may help."
        ],
        'fever' => [
            'symptom' => "Fever indicates your body is fighting an infection. Monitor temperature and other symptoms. Seek immediate medical attention if fever is above 103°F (39.4°C), persists for more than 3 days, or is accompanied by severe symptoms.",
            'chat' => "A fever is often a sign of infection. Rest, stay hydrated, and monitor your temperature. Acetaminophen or ibuprofen can help reduce fever. See a doctor if fever is high or persistent."
        ],
        'cold' => [
            'symptom' => "Common cold symptoms include runny/stuffy nose, sore throat, cough, and mild fatigue. Symptoms typically last 7-10 days. Seek medical attention if symptoms are severe or persist beyond 2 weeks.",
            'chat' => "Common cold symptoms include runny nose, sore throat, cough, and fatigue. Rest, drink plenty of fluids, and consider over-the-counter decongestants or pain relievers."
        ],
        'flu' => [
            'symptom' => "Flu symptoms include high fever, body aches, fatigue, and respiratory symptoms. Flu can be serious, especially for high-risk groups. Seek medical attention if symptoms are severe or you're in a high-risk group.",
            'chat' => "Flu symptoms include fever, body aches, fatigue, and respiratory issues. Rest, stay hydrated, and consider antiviral medications if caught early. See a doctor if symptoms are severe."
        ],
        'pain' => [
            'symptom' => "Pain can have many causes including injury, inflammation, or underlying conditions. Note location, intensity, and duration. Seek medical attention if pain is severe, persistent, or accompanied by other concerning symptoms.",
            'chat' => "Pain can have many causes. Rest the affected area, apply ice or heat as appropriate, and consider over-the-counter pain relievers like acetaminophen or ibuprofen."
        ],
        'sleep' => [
            'symptom' => "Sleep issues can affect overall health and may indicate underlying conditions. Track sleep patterns and symptoms. Consult a healthcare provider if sleep problems persist or significantly impact daily life.",
            'chat' => "Good sleep is essential for health. Maintain a regular sleep schedule, create a relaxing bedtime routine, avoid screens before bed, and ensure your sleep environment is comfortable and dark."
        ],
        'stress' => [
            'symptom' => "Stress can manifest physically and mentally, affecting overall health. Monitor stress levels and coping mechanisms. Seek professional help if stress becomes overwhelming or affects daily functioning.",
            'chat' => "Stress and anxiety are common. Try deep breathing, meditation, regular exercise, and maintaining a healthy sleep schedule. Talk to friends or family, and consider professional help if needed."
        ],
        'anxiety' => [
            'symptom' => "Anxiety can cause physical and mental symptoms including rapid heartbeat, sweating, and excessive worry. Monitor frequency and severity. Seek professional help if anxiety interferes with daily life or becomes overwhelming.",
            'chat' => "Anxiety is treatable. Practice relaxation techniques, maintain a healthy lifestyle, and consider talking to a mental health professional. Support groups and therapy can be very helpful."
        ],
        'depression' => [
            'symptom' => "Depression symptoms include persistent sadness, loss of interest, changes in sleep/appetite, and feelings of hopelessness. This is a serious condition requiring professional treatment. Seek help immediately if you have thoughts of self-harm.",
            'chat' => "Depression is a serious but treatable condition. Talk to a healthcare provider or mental health professional. Support from friends, family, and professionals is crucial for recovery."
        ],
        'diabetes' => [
            'symptom' => "Diabetes symptoms include increased thirst, frequent urination, fatigue, and blurred vision. This requires medical diagnosis and management. Seek immediate medical attention if you suspect diabetes.",
            'chat' => "Diabetes requires medical diagnosis and ongoing management. Symptoms include increased thirst, frequent urination, and fatigue. See a doctor for proper testing and treatment."
        ],
        'hypertension' => [
            'symptom' => "High blood pressure often has no symptoms but can cause headaches, shortness of breath, and chest pain. Regular monitoring is important. Seek medical attention if you experience severe symptoms.",
            'chat' => "High blood pressure is a serious condition that requires medical management. Regular check-ups, lifestyle changes, and medication may be needed. Monitor your blood pressure regularly."
        ],
        'allergy' => [
            'symptom' => "Allergic reactions can range from mild (sneezing, itching) to severe (anaphylaxis). Monitor symptoms and triggers. Seek immediate medical attention for severe reactions or difficulty breathing.",
            'chat' => "Allergies can be managed with avoidance, medications, and sometimes immunotherapy. Antihistamines can help with mild symptoms. See an allergist for proper diagnosis and treatment."
        ]
    ];

    foreach ($responses as $keyword => $response_types) {
        if (strpos($message, $keyword) !== false) {
            return $response_types[$message_type] ?? $response_types['chat'];
        }
    }

    return "I'm here to help with your health questions. Please provide more details about your symptoms or concern. Remember, I provide general information only - always consult healthcare professionals for medical advice.";
}

function getMedicineRecommendations($message) {
    $recommendations = [];
    
    // Pain and fever
    if (strpos($message, 'headache') !== false || strpos($message, 'pain') !== false) {
        $recommendations[] = [
            'category' => 'Pain Relief',
            'medicines' => [
                'Acetaminophen (Tylenol)' => '500-1000mg every 4-6 hours, max 4000mg/day',
                'Ibuprofen (Advil, Motrin)' => '200-400mg every 4-6 hours, max 1200mg/day',
                'Aspirin' => '325-650mg every 4-6 hours (not recommended for children)'
            ],
            'notes' => 'Take with food to avoid stomach upset. Do not exceed recommended doses.'
        ];
    }
    
    if (strpos($message, 'fever') !== false) {
        $recommendations[] = [
            'category' => 'Fever Reduction',
            'medicines' => [
                'Acetaminophen (Tylenol)' => '500-1000mg every 4-6 hours',
                'Ibuprofen (Advil, Motrin)' => '200-400mg every 4-6 hours'
            ],
            'notes' => 'Alternate between acetaminophen and ibuprofen if needed. Stay hydrated.'
        ];
    }
    
    // Cold and flu
    if (strpos($message, 'cold') !== false || strpos($message, 'flu') !== false) {
        $recommendations[] = [
            'category' => 'Cold & Flu Relief',
            'medicines' => [
                'Pseudoephedrine (Sudafed)' => '30-60mg every 4-6 hours for congestion',
                'Dextromethorphan (Robitussin)' => '15-30mg every 4-6 hours for cough',
                'Guaifenesin (Mucinex)' => '200-400mg every 4 hours for mucus',
                'Zinc lozenges' => '13-23mg every 2 hours while awake'
            ],
            'notes' => 'Stay hydrated and get plenty of rest. These medications treat symptoms only.'
        ];
    }
    
    // Sleep
    if (strpos($message, 'sleep') !== false || strpos($message, 'insomnia') !== false) {
        $recommendations[] = [
            'category' => 'Sleep Aid',
            'medicines' => [
                'Diphenhydramine (Benadryl)' => '25-50mg 30 minutes before bed',
                'Melatonin' => '1-5mg 30 minutes before bed',
                'Valerian root' => '300-600mg 30 minutes before bed'
            ],
            'notes' => 'Use only occasionally. Practice good sleep hygiene for long-term improvement.'
        ];
    }
    
    // Anxiety and stress
    if (strpos($message, 'anxiety') !== false || strpos($message, 'stress') !== false) {
        $recommendations[] = [
            'category' => 'Anxiety Relief',
            'medicines' => [
                'L-Theanine' => '100-200mg daily',
                'Magnesium' => '200-400mg daily',
                'Chamomile tea' => '1-2 cups daily',
                'Lavender oil' => 'Aromatherapy or topical use'
            ],
            'notes' => 'These are natural supplements. For severe anxiety, consult a healthcare provider.'
        ];
    }
    
    // Allergies
    if (strpos($message, 'allergy') !== false || strpos($message, 'sneezing') !== false) {
        $recommendations[] = [
            'category' => 'Allergy Relief',
            'medicines' => [
                'Cetirizine (Zyrtec)' => '10mg once daily',
                'Loratadine (Claritin)' => '10mg once daily',
                'Fexofenadine (Allegra)' => '180mg once daily',
                'Diphenhydramine (Benadryl)' => '25-50mg every 4-6 hours'
            ],
            'notes' => 'Non-drowsy options available. Take as directed and avoid driving if drowsy.'
        ];
    }
    
    return $recommendations;
}

function getDiagnosticInfo($message) {
    $diagnostics = [];
    
    // Emergency symptoms
    $emergency_symptoms = ['chest pain', 'difficulty breathing', 'severe bleeding', 'unconscious', 'seizure'];
    foreach ($emergency_symptoms as $symptom) {
        if (strpos($message, $symptom) !== false) {
            $diagnostics[] = [
                'type' => 'emergency',
                'message' => 'This may be a medical emergency. Call emergency services immediately.',
                'urgency' => 'high'
            ];
        }
    }
    
    // Common conditions
    if (strpos($message, 'headache') !== false) {
        $diagnostics[] = [
            'type' => 'condition',
            'condition' => 'Tension Headache / Migraine',
            'common_causes' => ['Stress', 'Dehydration', 'Lack of sleep', 'Eye strain'],
            'when_to_seek_care' => 'Severe pain, vision changes, confusion, or persistent headaches'
        ];
    }
    
    if (strpos($message, 'fever') !== false) {
        $diagnostics[] = [
            'type' => 'condition',
            'condition' => 'Fever',
            'common_causes' => ['Viral infection', 'Bacterial infection', 'Inflammation'],
            'when_to_seek_care' => 'Temperature above 103°F (39.4°C), persistent fever, or severe symptoms'
        ];
    }
    
    if (strpos($message, 'cold') !== false || strpos($message, 'flu') !== false) {
        $diagnostics[] = [
            'type' => 'condition',
            'condition' => 'Upper Respiratory Infection',
            'common_causes' => ['Viral infection', 'Seasonal changes', 'Weakened immune system'],
            'when_to_seek_care' => 'Severe symptoms, difficulty breathing, or symptoms lasting more than 2 weeks'
        ];
    }
    
    return $diagnostics;
}

$conn->close();
?> 