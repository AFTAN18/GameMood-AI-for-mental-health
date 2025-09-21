exports.up = function(knex) {
  return knex.schema.createTable('mood_entries', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE')
    table.integer('energy_level').notNullable().checkBetween([1, 10])
    table.integer('stress_level').notNullable().checkBetween([1, 10])
    table.integer('focus_level').notNullable().checkBetween([1, 10])
    table.integer('social_desire').notNullable().checkBetween([1, 10])
    table.integer('challenge_seeking').notNullable().checkBetween([1, 10])
    table.text('text_description')
    table.jsonb('ai_analysis').defaultTo('{}')
    table.string('time_context')
    table.string('weather_mood_factor')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    
    table.index(['user_id', 'created_at'])
    table.index(['created_at'])
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('mood_entries')
}
