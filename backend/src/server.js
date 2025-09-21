import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import { createServer } from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'

// Import routes
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import moodRoutes from './routes/moods.js'
import gameRoutes from './routes/games.js'
import recommendationRoutes from './routes/recommendations.js'
import wellnessRoutes from './routes/wellness.js'
import communityRoutes from './routes/community.js'
import integrationRoutes from './routes/integrations.js'
import aiRoutes from './routes/ai.js'

// Import middleware
import { errorHandler } from './middleware/errorHandler.js'
import { notFound } from './middleware/notFound.js'
import { authenticateToken } from './middleware/auth.js'

// Import services
import { initializeDatabase } from './config/database.js'
import { initializeRedis } from './config/redis.js'
import { initializeSocketIO } from './services/socketService.js'
import { initializeCronJobs } from './services/cronService.js'

dotenv.config()

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

const PORT = process.env.PORT || 5000

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})
app.use('/api/', limiter)

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}))

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Compression middleware
app.use(compression())

// Logging middleware
app.use(morgan('combined'))

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  })
})

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/users', authenticateToken, userRoutes)
app.use('/api/moods', authenticateToken, moodRoutes)
app.use('/api/games', gameRoutes)
app.use('/api/recommendations', authenticateToken, recommendationRoutes)
app.use('/api/wellness', authenticateToken, wellnessRoutes)
app.use('/api/community', authenticateToken, communityRoutes)
app.use('/api/integrations', authenticateToken, integrationRoutes)
app.use('/api/ai', authenticateToken, aiRoutes)

// Error handling middleware
app.use(notFound)
app.use(errorHandler)

// Initialize services
const initializeServices = async () => {
  try {
    // Initialize database
    await initializeDatabase()
    console.log('✅ Database initialized')

    // Initialize Redis
    await initializeRedis()
    console.log('✅ Redis initialized')

    // Initialize Socket.IO
    initializeSocketIO(io)
    console.log('✅ Socket.IO initialized')

    // Initialize cron jobs
    initializeCronJobs()
    console.log('✅ Cron jobs initialized')

    // Start server
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`)
      console.log(`🔗 Health check: http://localhost:${PORT}/health`)
    })
  } catch (error) {
    console.error('❌ Failed to initialize services:', error)
    process.exit(1)
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully')
  server.close(() => {
    console.log('Process terminated')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully')
  server.close(() => {
    console.log('Process terminated')
    process.exit(0)
  })
})

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})

// Initialize and start the server
initializeServices()

export default app
