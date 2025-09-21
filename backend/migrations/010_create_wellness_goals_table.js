exports.up = function(knex) {
  return knex.schema.createTable('wellness_goals', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE')
    table.string('title').notNullable()
    table.text('description')
    table.string('goal_type').notNullable() // 'mood_tracking', 'gaming_balance', 'social_gaming', 'wellness_score'
    table.integer('target_value').notNullable()
    table.integer('current_value').defaultTo(0)
    table.string('unit').notNullable()
    table.date('target_date')
    table.boolean('is_achieved').defaultTo(false)
    table.timestamp('achieved_at')
    table.timestamps(true, true)
    
    table.index(['user_id', 'is_achieved'])
    table.index(['goal_type'])
    table.index(['target_date'])
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('wellness_goals')
}
