const db = require('../../data/db-config.js')

module.exports = {
  findPosts,
  find,
  findById,
  add,
  remove
}

function findPosts(user_id) {
  /*
    Implement so it resolves this structure:
    [
      {
          "post_id": 10,
          "contents": "Trusting everyone is...",
          "username": "seneca"
      },
      etc
    ]
  */
  return db('posts as p')
    .join('users as u', 'u.id', 'p.user_id')
    .select('p.id as post_id', 'u.username', 'p.contents')
    .where({ user_id })
}

function find() {
  /*
    Improve so it resolves this structure:
    [
        {
            "user_id": 1,
            "username": "lao_tzu",
            "post_count": 6
        },
        {
            "user_id": 2,
            "username": "socrates",
            "post_count": 3
        },
        etc
    ]
  */
  return db('users as u')
    .leftJoin('posts as p', 'u.id', 'p.user_id')
    .groupBy('u.id')
    .select('u.id as user_id', 'u.username')
    .count('p.id as post_count')
}

async function findById(id) {
  // select u.id as id, username, p.id as post_id, contents from users as u
  //   join posts as p on p.user_id = u.id
  //   where u.id = 1;

  const result = await db('users as u')
    .leftJoin('posts as p', 'u.id', 'p.user_id')
    .select('u.id as user_id', 'username', 'p.id as post_id', 'contents')
    .where({ user_id: id })
  
  const user = {
    posts: []
  };

  for(let post of result) {
    user.posts.push({
      post_id: post.post_id,
      content: post.contents
    });
  }
  /*
    Improve so it resolves this structure:
    {
      "user_id": 2,
      "username": "socrates"
      "posts": [
        {
          "post_id": 7,
          "contents": "Beware of the barrenness of a busy life."
        },
        etc
      ]
    }
  */

  return user;
}

function add(user) {
  return db('users')
    .insert(user)
    .then(([id]) => { // eslint-disable-line
      return findById(id)
    })
}

function remove(id) {
  // returns removed count
  return db('users').where({ id }).del()
}