import configMongoose from './configMongoose';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import jwtSecret from './configSecret';
let User = configMongoose.User;

export default [
  {
    route: ['login'] ,
    call: (callPath, args) =>
    {
      let { username, password } = args[0];
      let saltedPassword = password+"pubApp"; // pubApp is our salt string
      let saltedPassHash = crypto.createHash('sha256').update(saltedPassword).digest('hex');
      let userStatementQuery = {
        $and: [
          { 'username': username },
          { 'password': saltedPassHash }
        ]
      }
      return User.find(userStatementQuery, function(err, user) {
        if (err) throw err;
      }).then((result) => {
          if(result.length) {
            let role = result[0].role;
            let userDetailsToHash = username+role;
            let token = jwt.sign(userDetailsToHash, jwtSecret.secret);
            return [
              {
                path: ['login', 'token'],
                value: token
              },
              {
                path: ['login', 'username'],
                value: username
              },
              {
                path: ['login', 'role'],
                value: role
              },
                {path: ['login', 'error'],
                value: false
              }
            ]; 
          } else {
          // INVALID LOGIN
          return [
            {
              path: ['login', 'token'],
              value: "INVALID"
            },
            {
              path: ['login', 'error'],
              value: "NO USER FOUND, incorrect login information"
            }
          ];
        }
        return result;
      });
    }
  },
  {
    route: ['register'],
    call: (callPath, args) =>
    {
      let newUserObj = args[0];
      newUserObj.password = newUserObj.password+"pubApp";
      newUserObj.password =
      crypto.createHash('sha256').update(newUserObj.password).digest('hex');
      let newUser = new User(newUserObj);
      return newUser.save((err, data) => { if (err) return err; })
      .then ((newRes) => {
          /*
          got new obj data, now let's get count:
          */
        let newUserDetail = newRes.toObject();
        if(newUserDetail._id) {
          let newUserId = newUserDetail._id.toString();
          return [
            {
              path: ['register', 'newUserId'],
              value: newUserId
            },
            {
              path: ['register', 'error'],
              value: false
            }
          ];
        }else {
          // registration failed
          return [
            {
              path: ['register', 'newUserId'],
              value: 'INVALID'
            },
            {
              path: ['register', 'error'],
              value: 'Registration failed - no id has been created'
            }
          ];
        }
        return;
      }).catch((reason) => console.error(reason));
    }
  }

];