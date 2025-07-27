# First Aid System Documentation

## Overview
The First Aid System provides comprehensive emergency procedures and first aid practices through a database-driven application. Users can search, filter, and view detailed step-by-step instructions for various medical emergencies.

## Database Schema

### Table: `firstAidPractices`
```sql
CREATE TABLE firstAidPractices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  steps TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  severity VARCHAR(50) NOT NULL,
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Fields Description:
- **id**: Unique identifier for each practice
- **title**: Name of the first aid procedure
- **description**: Brief description of the procedure
- **steps**: Step-by-step instructions (stored as newline-separated string)
- **category**: Category classification (Emergency, Wound Care, Burns, etc.)
- **severity**: Severity level (Critical, High, Medium, Low)
- **image_url**: Optional image URL for visual aid
- **created_at**: Timestamp when record was created
- **updated_at**: Timestamp when record was last updated

## API Endpoints

### GET `/api/endpoints/first_aid_practices.php`
Fetches first aid practices with optional filtering.

#### Query Parameters:
- `category` (optional): Filter by category
- `severity` (optional): Filter by severity level

#### Response Format:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "CPR (Cardiopulmonary Resuscitation)",
      "description": "Emergency procedure to restore blood circulation...",
      "steps": [
        "1. Check for responsiveness and breathing",
        "2. Call emergency services (911)",
        "3. Position person on back on firm surface"
      ],
      "category": "Emergency",
      "severity": "Critical",
      "image_url": null,
      "created_at": "2025-07-27 08:09:37"
    }
  ],
  "count": 15
}
```

## Available Categories
1. **Emergency** - Life-threatening situations (CPR, Choking)
2. **Wound Care** - Bleeding control and wound management
3. **Burns** - Thermal, chemical, and electrical burns
4. **Injuries** - Fractures, sprains, and strains
5. **Environmental** - Heat exhaustion, hypothermia
6. **Neurological** - Seizures and neurological emergencies
7. **Allergic** - Anaphylaxis and allergic reactions
8. **Poisoning** - Chemical and substance poisoning
9. **Eye Care** - Eye injuries and foreign objects
10. **Minor Injuries** - Nosebleeds and minor cuts
11. **Dental** - Dental emergencies and injuries
12. **Animal Bites** - Snake bites and animal attacks

## Severity Levels
- **Critical** (Red): Life-threatening, requires immediate medical attention
- **High** (Orange): Serious injury, medical attention needed soon
- **Medium** (Yellow): Moderate injury, may need medical attention
- **Low** (Green): Minor injury, can be treated at home

## First Aid Practices Included

### Critical Severity:
1. **CPR (Cardiopulmonary Resuscitation)** - Emergency procedure for cardiac arrest
2. **Choking - Heimlich Maneuver** - Airway obstruction relief
3. **Allergic Reaction** - Anaphylaxis treatment
4. **Poisoning** - General poisoning first aid
5. **Snake Bite** - Venomous snake bite treatment

### High Severity:
1. **Bleeding Control** - Severe bleeding management
2. **Eye Injury** - Eye trauma and foreign objects
3. **Fracture Management** - Bone fracture handling
4. **Hypothermia** - Low body temperature treatment
5. **Seizure First Aid** - Epileptic seizure assistance

### Medium Severity:
1. **Burn Treatment** - Various burn types
2. **Dental Emergency** - Tooth injuries and pain
3. **Heat Exhaustion** - Heat-related illness
4. **Sprain and Strain** - Muscle and ligament injuries

### Low Severity:
1. **Nosebleed** - Nasal bleeding control

## Mobile App Features

### Main Screen:
- **Emergency Call Button**: Prominent 911 call button
- **Search Bar**: Search practices by title, description, or category
- **Category Filter**: Horizontal scrollable category chips
- **Practice Cards**: Display title, description, severity, and step count

### Practice Detail Modal:
- **Full Description**: Complete procedure explanation
- **Step-by-Step Instructions**: Numbered steps with clear formatting
- **Severity Indicator**: Color-coded severity badge
- **Category Information**: Practice classification

### User Experience Features:
- **Loading States**: Activity indicators during data fetching
- **Error Handling**: Retry buttons and error messages
- **Empty States**: Helpful messages when no results found
- **Responsive Design**: Works on various screen sizes
- **Accessibility**: Clear typography and touch targets

## Technical Implementation

### Frontend (React Native):
- **State Management**: React hooks for data and UI state
- **API Integration**: Uses `apiRequest` utility for HTTP calls
- **Component Structure**: Modular components for reusability
- **Styling**: StyleSheet with consistent design system

### Backend (PHP):
- **Database Connection**: MySQL with prepared statements
- **Error Handling**: Comprehensive error responses
- **CORS Support**: Cross-origin resource sharing headers
- **Input Validation**: Parameter sanitization and validation

### Security Features:
- **SQL Injection Prevention**: Prepared statements
- **Input Sanitization**: Parameter validation
- **Error Information**: Limited error details in production
- **CORS Configuration**: Controlled cross-origin access

## Usage Instructions

### For Users:
1. Open the First Aid tab in the mobile app
2. Use the search bar to find specific procedures
3. Filter by category using the horizontal chips
4. Tap on any practice card to view detailed instructions
5. Follow the step-by-step guide for emergency situations
6. Call 911 for life-threatening emergencies

### For Developers:
1. Database practices are automatically loaded on app start
2. API supports filtering by category and severity
3. Steps are returned as arrays for easy rendering
4. Modal provides detailed view with proper formatting
5. Error states handle network and server issues

## Emergency Contact Integration
The first aid system works alongside the emergency contacts feature, allowing users to:
- Quickly access emergency procedures
- Call 911 for immediate assistance
- Contact saved emergency contacts
- Follow proper first aid protocols

## Future Enhancements
- **Image Support**: Add visual aids for procedures
- **Video Integration**: Step-by-step video demonstrations
- **Offline Mode**: Cache practices for offline access
- **User Favorites**: Save frequently used procedures
- **Multi-language Support**: Internationalization
- **Voice Instructions**: Audio guidance for hands-free use
- **Emergency Location**: GPS integration for emergency services
- **Practice History**: Track viewed procedures
- **Rating System**: User feedback on procedure effectiveness 