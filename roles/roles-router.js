const knex = require('knex');
const router = require('express').Router();

const knexConfig = {
  client: 'sqlite3',
  connection: {
    filename: './data/rolex.db3'
  },
  useNullAsDefault: true,
};

const db = knex(knexConfig);



router.get('/', (req, res) => {
  db('roles')
  .then(roles => {
    res.status(200).json(roles)
  })
  .catch(err => {
    console.log(err);
  })
});

router.get('/:id', (req, res) => {
  db('roles')
  .where({ id: req.params.id })
  .first() //goes into the results and takes the first element. (gives an {object} instead of [{}])
  .then(role => {
    if(role) {
      res.status(200).json(role)
    } else {
      res.status(404).json({ message: 'ruh-roh shaggy.'})
    }
  })
  .catch(err => {
    res.status(500).json(err)
  })
});

router.post('/', (req, res) => {
  // simple validation
  if(!req.body.name) {
    res.status(400).json({ message: 'Need a name for this stuff!'})
  } else {
    db('roles')
    .insert(req.body, 'id')
    .then(ids => {
      db('roles')
        .where({ id: ids[0] })
        .first()
        .then(role => {
          res.status(201).json(role)
        })
        .catch(err => {
          res.status(500).json(err)
        })
    })
    .catch(err => {
      res.status(500).json(err)
    })
  }
});

router.put('/:id', (req, res) => {
  db('roles')
  .where({ id: req.params.id })
  .update(req.body)
  .then(count => {
    if(count > 0) {
      res.status(200).json({ message: `${count} updated`})
    } else {
      res.status(404).json({ message: 'record not found'})
    }
  })
  .catch(err => {
    res.status(500).json(err)
  })
});

router.delete('/:id', (req, res) => {
  db('roles')
  .where({ id: req.params.id })
  .delete()
  .then(count => {
    if(count > 0) {
      res.status(200).json({ message: `${count} deleted`})
    } else {
      res.status(404).json({ message: 'record not found'})
    }
  })
  .catch(err => {
    res.status(500).json(err)
  })
});

module.exports = router;
