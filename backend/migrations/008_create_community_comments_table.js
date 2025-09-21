exports.up = function(knex) {
  return knex.schema.createTable('community_comments', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.uuid('post_id').references('id').inTable('community_posts').onDelete('CASCADE')
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE')
    table.text('content').notNullable()
    table.uuid('parent_comment_id').references('id').inTable('community_comments')
    table.integer('likes').defaultTo(0)
    table.boolean('is_approved').defaultTo(true)
    table.timestamps(true, true)
    
    table.index(['post_id', 'created_at'])
    table.index(['user_id'])
    table.index(['parent_comment_id'])
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('community_comments')
}
