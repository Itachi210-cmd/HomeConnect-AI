# HomeConnect Backend Architecture

## Overview
HomeConnect uses a hybrid database approach to leverage the strengths of both Relational (SQL) and NoSQL (MongoDB) databases.

- **PostgreSQL / MySQL**: Used for structured, transactional data (Users, Leads, Properties, Financials).
- **MongoDB**: Used for unstructured data, logs, and AI-related content (Documents, Chat History, Activity Logs).

## 1. SQL Database Schema (PostgreSQL/MySQL)

### Users Table
Stores authentication and profile info for all user types.
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  role ENUM('buyer', 'agent', 'admin') NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Agents Table
Extended profile for agents.
```sql
CREATE TABLE agents (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  agency_name VARCHAR(100),
  license_number VARCHAR(50),
  bio TEXT,
  rating DECIMAL(3, 2) DEFAULT 0.0,
  total_sales INT DEFAULT 0,
  commission_rate DECIMAL(5, 2) -- e.g., 2.5%
);
```

### Properties Table
Core property data.
```sql
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(12, 2) NOT NULL,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(50) NOT NULL,
  zip_code VARCHAR(20) NOT NULL,
  beds INT,
  baths DECIMAL(3, 1),
  sqft INT,
  property_type ENUM('house', 'apartment', 'condo', 'land') NOT NULL,
  status ENUM('active', 'pending', 'sold') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Leads Table
Tracks buyer interest and agent assignments.
```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID REFERENCES users(id), -- Can be NULL if guest
  agent_id UUID REFERENCES users(id),
  property_id UUID REFERENCES properties(id),
  status ENUM('new', 'contacted', 'qualified', 'closed', 'lost') DEFAULT 'new',
  source VARCHAR(50), -- e.g., 'website', 'referral'
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Appointments Table
```sql
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id),
  agent_id UUID REFERENCES users(id),
  property_id UUID REFERENCES properties(id),
  scheduled_time TIMESTAMP NOT NULL,
  status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 2. MongoDB Schema (NoSQL)

### PropertyDocuments Collection
Stores images, floor plans, and legal docs.
```json
{
  "_id": "ObjectId",
  "property_id": "UUID (from SQL)",
  "images": [
    { "url": "https://...", "caption": "Living Room", "is_primary": true }
  ],
  "documents": [
    { "name": "Deed.pdf", "url": "https://...", "type": "legal" }
  ],
  "virtual_tour_url": "https://..."
}
```

### ActivityLogs Collection
System-wide audit trail and analytics data.
```json
{
  "_id": "ObjectId",
  "user_id": "UUID",
  "action": "view_property",
  "target_id": "UUID (property_id)",
  "metadata": {
    "device": "mobile",
    "duration_seconds": 45
  },
  "timestamp": "ISODate"
}
```

### AIChatHistory Collection
Stores conversations with the AI assistant.
```json
{
  "_id": "ObjectId",
  "user_id": "UUID",
  "session_id": "string",
  "messages": [
    { "role": "user", "content": "Find me a 3 bed house in Austin", "timestamp": "ISODate" },
    { "role": "assistant", "content": "Here are some options...", "timestamp": "ISODate" }
  ],
  "summary": "User looking for 3 bed in Austin under $500k"
}
```

## 3. API Structure (Next.js API Routes)

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT
- `POST /api/auth/logout` - Logout

### Properties
- `GET /api/properties` - List properties (with filters)
- `GET /api/properties/:id` - Get single property details
- `POST /api/properties` - Create property (Agent only)
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property

### Leads (Agent Protected)
- `GET /api/leads` - Get assigned leads
- `POST /api/leads` - Create new lead (from inquiry)
- `PATCH /api/leads/:id/status` - Update lead status

### AI Integration
- `POST /api/ai/chat` - Send message to AI assistant
- `POST /api/ai/recommend` - Get personalized property recommendations
- `POST /api/ai/score-lead` - Analyze lead quality based on activity

## 4. Technology Stack Recommendations
- **ORM**: Prisma (for SQL) + Mongoose (for MongoDB)
- **Auth**: NextAuth.js (supports Credentials, Google, etc.)
- **File Storage**: AWS S3 or Uploadthing
- **AI**: OpenAI API (GPT-4o)
