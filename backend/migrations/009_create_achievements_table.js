exports.up = function(knex) {
  return knex.schema.createTable('achievements', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE')
    table.string('title').notNullable()
    table.text('description')
    table.string('category').notNullable() // 'wellness', 'gaming', 'social', 'streak'
    table.string('icon').defaultTo('🏆')
    table.integer('points').defaultTo(0)
    table.jsonb('requirements').defaultTo('{}')
    table.timestamp('earned_date').notNullable()
    table.timestamps(true, true)
    
    table.index(['user_id', 'earned_date'])
    table.index(['category'])
    table.index(['earned_date'])
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('achievements')
}
