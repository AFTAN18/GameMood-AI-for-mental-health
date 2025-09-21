exports.up = function(knex) {
  return knex.schema.createTable('game_sessions', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE')
    table.uuid('game_id').references('id').inTable('games').onDelete('CASCADE')
    table.timestamp('started_at').notNullable()
    table.timestamp('ended_at')
    table.integer('duration_minutes')
    table.integer('mood_before').checkBetween([1, 10])
    table.integer('mood_after').checkBetween([1, 10])
    table.integer('enjoyment_rating').checkBetween([1, 10])
    table.text('notes')
    table.jsonb('session_data').defaultTo('{}')
    table.timestamps(true, true)
    
    table.index(['user_id', 'started_at'])
    table.index(['game_id'])
    table.index(['started_at'])
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('game_sessions')
}
