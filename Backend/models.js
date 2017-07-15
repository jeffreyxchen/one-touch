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
