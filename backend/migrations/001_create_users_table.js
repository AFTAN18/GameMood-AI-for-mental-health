exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.string('email').unique().notNullable()
    table.string('password_hash').notNullable()
    table.string('display_name').notNullable()
    table.string('avatar_url')
    table.jsonb('preferences').defaultTo('{}')
    table.jsonb('accessibility_settings').defaultTo('{}')
    table.jsonb('privacy_settings').defaultTo('{}')
    table.jsonb('notification_preferences').defaultTo('{}')
    table.integer('wellness_streak').defaultTo(0)
    table.integer('total_wellness_score').defaultTo(0)
    table.boolean('is_verified').defaultTo(false)
    table.timestamp('last_login_at')
    table.timestamps(true, true)
    
    table.index(['email'])
    table.index(['display_name'])
    table.index(['created_at'])
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('users')
}
