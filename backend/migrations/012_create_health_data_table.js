exports.up = function(knex) {
  return knex.schema.createTable('health_data', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE')
    table.string('platform').notNullable() // 'apple_health', 'google_fit', 'samsung_health'
    table.date('date').notNullable()
    table.integer('steps').defaultTo(0)
    table.integer('heart_rate_avg').defaultTo(0)
    table.integer('sleep_hours').defaultTo(0)
    table.integer('stress_level').checkBetween([1, 10])
    table.string('mood')
    table.jsonb('additional_data').defaultTo('{}')
    table.timestamps(true, true)
    
    table.unique(['user_id', 'platform', 'date'])
    table.index(['user_id', 'date'])
    table.index(['platform'])
    table.index(['date'])
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('health_data')
}
