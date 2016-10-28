
exports.up = function(knex, Promise) {
  return knex.schema.table('users', function (table) {
    table.string('password_digest', 255);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function (table) {
    table.dropColumn('password_digest');
  });
};
