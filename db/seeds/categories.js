
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('categories').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('categories').insert({id: 1, name: 'watch', created_at: '2016-10-26 10:00:00'}),
        knex('categories').insert({id: 2, name: 'eat', created_at: '2016-10-26 10:00:00'}),
        knex('categories').insert({id: 3, name: 'read', created_at: '2016-10-26 10:00:00'}),
        knex('categories').insert({id: 4, name: 'buy', created_at: '2016-10-26 10:00:00'})
      ]);
    });
};
