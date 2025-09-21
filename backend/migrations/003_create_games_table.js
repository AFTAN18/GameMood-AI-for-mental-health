exports.up = function(knex) {
  return knex.schema.createTable('games', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.string('title').notNullable()
    table.text('description')
    table.jsonb('genres').notNullable()
    table.jsonb('platforms').notNullable()
    table.jsonb('mood_tags').notNullable()
    table.integer('ideal_energy_min').defaultTo(1)
    table.integer('ideal_energy_max').defaultTo(10)
    table.integer('stress_compatibility').defaultTo(5)
    table.integer('session_length_minutes').defaultTo(30)
    table.jsonb('accessibility_features').defaultTo('[]')
    table.integer('wellness_rating').defaultTo(5)
    table.string('image_url')
    table.string('price_range')
    table.jsonb('metadata').defaultTo('{}')
    table.boolean('is_active').defaultTo(true)
    table.timestamps(true, true)
    
    table.index(['title'])
    table.index(['genres'])
    table.index(['platforms'])
    table.index(['mood_tags'])
    table.index(['wellness_rating'])
    table.index(['is_active'])
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('games')
}
