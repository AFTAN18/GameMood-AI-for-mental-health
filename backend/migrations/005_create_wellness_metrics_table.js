exports.up = function(knex) {
  return knex.schema.createTable('wellness_metrics', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE')
    table.date('date').notNullable()
    table.integer('overall_wellness_score').checkBetween([1, 10])
    table.integer('mood_score').checkBetween([1, 10])
    table.integer('energy_score').checkBetween([1, 10])
    table.integer('stress_score').checkBetween([1, 10])
    table.integer('sleep_quality').checkBetween([1, 10])
    table.integer('exercise_minutes')
    table.integer('social_interaction_score').checkBetween([1, 10])
    table.integer('gaming_balance_score').checkBetween([1, 10])
    table.jsonb('additional_metrics').defaultTo('{}')
    table.timestamps(true, true)
    
    table.unique(['user_id', 'date'])
    table.index(['user_id', 'date'])
    table.index(['date'])
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('wellness_metrics')
}
