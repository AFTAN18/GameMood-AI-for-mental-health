import knex from 'knex'
import dotenv from 'dotenv'

dotenv.config()

const config = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'gamemood_ai',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    directory: './migrations'
  },
  seeds: {
    directory: './seeds'
  }
}

const db = knex(config)

export const initializeDatabase = async () => {
  try {
    // Test database connection
    await db.raw('SELECT 1')
    console.log('Database connection established')
    
    // Run migrations
    await db.migrate.latest()
    console.log('Database migrations completed')
    
    // Run seeds in development
    if (process.env.NODE_ENV === 'development') {
      await db.seed.run()
      console.log('Database seeds completed')
    }
  } catch (error) {
    console.error('Database initialization failed:', error)
    throw error
  }
}

export default db
