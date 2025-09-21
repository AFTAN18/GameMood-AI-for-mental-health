# GameMood AI Technical Documentation

## 🏗️ Architecture Overview

GameMood AI is a full-stack web application built with modern technologies to provide AI-powered gaming wellness recommendations.

### System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (PostgreSQL)  │
│   Port: 3000    │    │   Port: 5000    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CDN/Static    │    │   Redis Cache   │    │   File Storage  │
│   Assets        │    │   Port: 6379    │    │   (AWS S3)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🎯 Core Features

### 1. Mood Assessment System
- **Dual Input Methods**: Slider-based and text-based mood input
- **AI Analysis**: Natural language processing for mood detection
- **Real-time Processing**: Instant mood analysis and scoring

### 2. Recommendation Engine
- **Collaborative Filtering**: User-based and item-based recommendations
- **Content-Based Filtering**: Game features and mood matching
- **Hybrid Approach**: Combines multiple recommendation strategies

### 3. Wellness Integration
- **Health Data Integration**: Apple Health, Google Fit, Samsung Health
- **Gaming Platform Integration**: Steam, Epic Games, Xbox, PlayStation, Nintendo
- **Social Platform Integration**: Discord, Twitch, YouTube, Twitter

### 4. Accessibility Features
- **Neurodivergent Support**: Customizable interfaces for various needs
- **Screen Reader Compatibility**: Full ARIA support
- **High Contrast Mode**: Enhanced visibility options
- **Keyboard Navigation**: Complete keyboard accessibility

## 🛠️ Technology Stack

### Frontend
- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Type-safe development
- **Redux Toolkit**: State management with RTK Query
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **Recharts**: Data visualization
- **React Router**: Client-side routing

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **PostgreSQL**: Primary database
- **Redis**: Caching and session storage
- **Socket.io**: Real-time communication
- **TensorFlow.js**: Machine learning
- **Natural**: Natural language processing

### DevOps & Deployment
- **Docker**: Containerization
- **Vercel**: Frontend deployment
- **AWS/GCP/Azure**: Cloud infrastructure
- **GitHub Actions**: CI/CD pipeline
- **Jest**: Testing framework
- **Cypress**: E2E testing

## 📊 Database Schema

### Core Tables

#### Users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  display_name VARCHAR NOT NULL,
  avatar_url VARCHAR,
  preferences JSONB DEFAULT '{}',
  accessibility_settings JSONB DEFAULT '{}',
  privacy_settings JSONB DEFAULT '{}',
  notification_preferences JSONB DEFAULT '{}',
  wellness_streak INTEGER DEFAULT 0,
  total_wellness_score INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Mood Entries
```sql
CREATE TABLE mood_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  energy_level INTEGER NOT NULL CHECK (energy_level BETWEEN 1 AND 10),
  stress_level INTEGER NOT NULL CHECK (stress_level BETWEEN 1 AND 10),
  focus_level INTEGER NOT NULL CHECK (focus_level BETWEEN 1 AND 10),
  social_desire INTEGER NOT NULL CHECK (social_desire BETWEEN 1 AND 10),
  challenge_seeking INTEGER NOT NULL CHECK (challenge_seeking BETWEEN 1 AND 10),
  text_description TEXT,
  ai_analysis JSONB DEFAULT '{}',
  time_context VARCHAR,
  weather_mood_factor VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Games
```sql
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR NOT NULL,
  description TEXT,
  genres JSONB NOT NULL,
  platforms JSONB NOT NULL,
  mood_tags JSONB NOT NULL,
  ideal_energy_min INTEGER DEFAULT 1,
  ideal_energy_max INTEGER DEFAULT 10,
  stress_compatibility INTEGER DEFAULT 5,
  session_length_minutes INTEGER DEFAULT 30,
  accessibility_features JSONB DEFAULT '[]',
  wellness_rating INTEGER DEFAULT 5,
  image_url VARCHAR,
  price_range VARCHAR,
  metadata JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🤖 AI/ML Implementation

### Mood Analysis Service

#### Text Analysis
```javascript
async analyzeMoodFromText(text) {
  // 1. Preprocess text
  const cleanedText = this.preprocessText(text)
  
  // 2. Sentiment analysis
  const sentimentResult = this.sentiment.analyze(cleanedText)
  
  // 3. Emotion extraction
  const emotions = this.extractEmotions(cleanedText)
  
  // 4. Mood score calculation
  const moodScore = this.calculateMoodScore(sentimentResult, emotions)
  
  // 5. Generate insights
  const insights = this.generateInsights(moodScore, emotions)
  
  return {
    mood_score: moodScore,
    emotions: emotions,
    insights: insights
  }
}
```

#### Slider Analysis
```javascript
async analyzeMoodFromSliders(moodData) {
  const { energy_level, stress_level, focus_level, social_desire, challenge_seeking } = moodData
  
  // Calculate overall mood score
  const moodScore = Math.round(
    (energy_level + (10 - stress_level) + focus_level + social_desire + challenge_seeking) / 5
  )
  
  // Analyze patterns
  const patterns = this.analyzeMoodPatterns(moodData)
  
  // Generate recommendations
  const recommendations = this.generateMoodRecommendations(moodData)
  
  return {
    mood_score: moodScore,
    patterns: patterns,
    recommendations: recommendations
  }
}
```

### Recommendation Engine

#### Collaborative Filtering
```javascript
async findSimilarUsers(userId, moodData) {
  // Find users with similar mood patterns
  const similarUsers = await db.raw(`
    SELECT 
      u.id,
      u.preferences,
      AVG(
        CASE 
          WHEN me.energy_level BETWEEN ? - 2 AND ? + 2 THEN 1 
          ELSE 0 
        END
      ) as energy_similarity,
      -- Additional similarity calculations
    FROM users u
    JOIN mood_entries me ON u.id = me.user_id
    WHERE u.id != ? AND me.created_at >= NOW() - INTERVAL '30 days'
    GROUP BY u.id, u.preferences
    HAVING (energy_similarity + stress_similarity + focus_similarity) / 3 > 0.6
    ORDER BY (energy_similarity + stress_similarity + focus_similarity) / 3 DESC
    LIMIT 20
  `, [moodData.energy_level, moodData.energy_level, userId])
  
  return similarUsers.rows
}
```

#### Content-Based Filtering
```javascript
calculateMoodMatch(game, moodData) {
  let match = 0.5 // Base match
  
  // Energy level matching
  const energyMatch = 1 - Math.abs(game.ideal_energy_min - moodData.energy_level) / 10
  match += energyMatch * 0.3
  
  // Stress compatibility
  const stressMatch = 1 - Math.abs(game.stress_compatibility - moodData.stress_level) / 10
  match += stressMatch * 0.3
  
  // Social desire
  if (moodData.social_desire > 7 && game.genres.includes('Multiplayer')) {
    match += 0.2
  }
  
  return Math.max(0, Math.min(1, match))
}
```

## 🔌 API Endpoints

### Authentication
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
```

### Mood Management
```
GET    /api/moods
POST   /api/moods
GET    /api/moods/:id
PUT    /api/moods/:id
DELETE /api/moods/:id
```

### Recommendations
```
GET /api/recommendations
POST /api/recommendations/generate
GET /api/recommendations/:id
PUT /api/recommendations/:id/feedback
```

### Wellness
```
GET  /api/wellness/metrics
POST /api/wellness/metrics
GET  /api/wellness/goals
POST /api/wellness/goals
PUT  /api/wellness/goals/:id
```

### Community
```
GET    /api/community/posts
POST   /api/community/posts
GET    /api/community/posts/:id
PUT    /api/community/posts/:id
DELETE /api/community/posts/:id
POST   /api/community/posts/:id/like
POST   /api/community/posts/:id/comment
```

## 🧪 Testing Strategy

### Unit Tests
- Component testing with React Testing Library
- Service testing with Jest
- Utility function testing

### Integration Tests
- API endpoint testing
- Database integration testing
- Third-party service integration testing

### End-to-End Tests
- User journey testing with Cypress
- Cross-browser compatibility testing
- Performance testing

### Test Coverage
- Target: 80% code coverage
- Critical paths: 95% coverage
- New features: 100% coverage

## 📈 Performance Optimization

### Frontend Optimization
- Code splitting with React.lazy()
- Image optimization with WebP format
- Bundle size optimization
- Service worker for caching

### Backend Optimization
- Database query optimization
- Redis caching strategy
- Connection pooling
- Rate limiting

### CDN Strategy
- Static asset delivery
- Global edge locations
- Compression and minification
- Browser caching

## 🔒 Security Implementation

### Authentication & Authorization
- JWT-based authentication
- Role-based access control
- OAuth2 integration
- Session management

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF protection

### API Security
- Rate limiting
- CORS configuration
- HTTPS enforcement
- API key management

## 🚀 Deployment Architecture

### Production Environment
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Load Balancer │    │   CDN           │    │   Database      │
│   (Nginx)       │    │   (CloudFlare)  │    │   (RDS)         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Cache         │
│   (Vercel)      │    │   (ECS)         │    │   (ElastiCache) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### CI/CD Pipeline
1. **Code Push**: Triggered on main branch push
2. **Build**: Compile and test application
3. **Deploy**: Deploy to staging environment
4. **Test**: Run automated tests
5. **Promote**: Deploy to production
6. **Monitor**: Monitor application health

## 📊 Monitoring & Analytics

### Application Monitoring
- **Error Tracking**: Sentry integration
- **Performance Monitoring**: Real User Monitoring (RUM)
- **Uptime Monitoring**: Health check endpoints
- **Log Aggregation**: Centralized logging

### Business Analytics
- **User Behavior**: Google Analytics 4
- **Conversion Tracking**: Goal and funnel analysis
- **A/B Testing**: Feature flag management
- **Custom Events**: User interaction tracking

## 🔄 Maintenance & Updates

### Regular Maintenance
- **Security Updates**: Monthly security patches
- **Dependency Updates**: Weekly dependency updates
- **Database Maintenance**: Monthly optimization
- **Performance Reviews**: Quarterly performance analysis

### Monitoring Alerts
- **Error Rate**: > 1% error rate
- **Response Time**: > 2s average response time
- **Uptime**: < 99.9% uptime
- **Database**: Connection pool exhaustion

## 📚 Additional Resources

- [API Documentation](./API_DOCS.md)
- [Database Schema](./DATABASE_SCHEMA.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Contributing Guidelines](./CONTRIBUTING.md)
- [Code of Conduct](./CODE_OF_CONDUCT.md)

---

For questions or support, please contact the development team or create an issue in the repository.
