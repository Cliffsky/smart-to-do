
exports.up = function(knex, Promise) {
  return knex.schema.table('users', function (table) {
    table.integer('weekdays');
    table.integer('weekends');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function (table) {
    table.dropColumn('weekdays');
    table.dropColumn('weekends');
  });
};
