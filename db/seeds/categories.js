
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('categories').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('categories').insert({id: 1, name: 'watch'}),
        knex('categories').insert({id: 2, name: 'eat'}),
        knex('categories').insert({id: 3, name: 'read'}),
        knex('categories').insert({id: 4, name: 'buy'})
      ]);
    });
};
