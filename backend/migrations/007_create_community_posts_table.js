exports.up = function(knex) {
  return knex.schema.createTable('community_posts', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE')
    table.text('content').notNullable()
    table.boolean('is_anonymous').defaultTo(false)
    table.jsonb('mood_context').defaultTo('{}')
    table.jsonb('game_recommendations').defaultTo('[]')
    table.integer('likes').defaultTo(0)
    table.integer('shares').defaultTo(0)
    table.boolean('is_approved').defaultTo(true)
    table.timestamps(true, true)
    
    table.index(['user_id', 'created_at'])
    table.index(['created_at'])
    table.index(['is_approved'])
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('community_posts')
}
