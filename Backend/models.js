"use strict";

if(!process.env.MONGODB_URI) {
  console.log('MONGODB_URI is missing, make sure you run source env.sh');
  process.exit(1);
}

var mongoose = require('mongoose');

var User = mongoose.model('User', {
  websites: [
    {
      website: {
        type: String
      },
      username: {
        type: String
      },
      password: {
        type: String
      }
    }
  ]
});

module.exports={
  User: User
}
