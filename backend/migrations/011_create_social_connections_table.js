exports.up = function(knex) {
  return knex.schema.createTable('social_connections', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE')
    table.string('platform').notNullable() // 'steam', 'discord', 'twitch', 'youtube', 'twitter'
    table.string('platform_user_id').notNullable()
    table.string('username').notNullable()
    table.string('display_name')
    table.string('avatar_url')
    table.jsonb('connection_data').defaultTo('{}')
    table.boolean('is_active').defaultTo(true)
    table.timestamp('last_sync_at')
    table.timestamps(true, true)
    
    table.unique(['user_id', 'platform', 'platform_user_id'])
    table.index(['user_id', 'platform'])
    table.index(['platform'])
    table.index(['is_active'])
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('social_connections')
}
