
exports.up = function(knex, Promise) {

  return knex.schema.createTable('todos', function (table) {
    table.increments();
    table.integer('user_id').unsigned()
    table.foreign('user_id').references('Users.id')

    table.integer('category_id').unsigned()
    table.foreign('category_id').references('Categories.id')

    table.string('name');
    table.integer('length');
    table.integer('order');
    table.boolean('isComplete');
    table.timestamp('starting_at');

    table.timestamps();
  });

};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('todos');
};
