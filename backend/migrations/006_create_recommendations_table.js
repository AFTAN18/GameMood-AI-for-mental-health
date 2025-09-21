exports.up = function(knex) {
  return knex.schema.createTable('recommendations', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE')
    table.uuid('game_id').references('id').inTable('games').onDelete('CASCADE')
    table.string('recommendation_type').notNullable() // 'mood_based', 'wellness', 'trending', 'similar'
    table.integer('confidence_score').checkBetween([1, 100])
    table.text('reasoning')
    table.jsonb('mood_context').defaultTo('{}')
    table.boolean('is_viewed').defaultTo(false)
    table.boolean('is_acted_upon').defaultTo(false)
    table.timestamp('viewed_at')
    table.timestamp('acted_upon_at')
    table.timestamps(true, true)
    
    table.index(['user_id', 'created_at'])
    table.index(['game_id'])
    table.index(['recommendation_type'])
    table.index(['confidence_score'])
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('recommendations')
}
