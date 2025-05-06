/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('threads', {
      id: {
        type: 'VARCHAR(50)',
        primaryKey: true,
      },
      title: {
        type: 'VARCHAR',
        notNull: true,
      },
      body: {
        type: 'TEXT',
        notNull: true,
      },
      date: {
        type: 'TEXT',
        notNull: true,
        default: pgm.func('current_timestamp'),
      },
      owner: {
        type: 'VARCHAR(50)',
        notNull: true,
      },
    });
  
    // Menambahkan constraints Foreign key owner reference ke user.id
    pgm.addConstraint('threads','fk_threads.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
  };
  
  exports.down = (pgm) => {
    pgm.dropTable('threads');
  };
