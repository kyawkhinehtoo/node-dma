const express = require('express');
const router = express.Router();
const db  = require('./dbConnection');
const { signupValidation, loginValidation,accountValidation,createValidation,updateValidation } = require('./validation');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const md5 = require('md5');
const jwt = require('jsonwebtoken');

// router.post('/register', signupValidation, (req, res, next) => {

//   db.query(
//     `SELECT * FROM users WHERE LOWER(name) = LOWER(${db.escape(
//       req.body.name
//     )});`,
//     (err, result) => {
//       if (result.length) {
//         return res.status(409).send({
//           msg: 'This user is already in use!'
//         });
//       } else {
//         // username is available
//         bcrypt.hash(req.body.password, 10, (err, hash) => {
//           if (err) {
//             return res.status(500).send({
//               msg: err
//             });
//           } else {
//             // has hashed pw => add to database
//             db.query(
//               `INSERT INTO users (name, password) VALUES ('${req.body.name}', ${db.escape(hash)})`,
//               (err, result) => {
//                 if (err) {
//                   throw err;
//                   return res.status(400).send({
//                     msg: err
//                   });
//                 }
//                 return res.status(201).send({
//                   msg: 'The user has been registerd with us!'
//                 });
//               }
//             );
//           }
//         });
//       }
//     }
//   );
// });


router.post('/login', loginValidation, (req, res, next) => {
  db.query(`SELECT * FROM rm_managers WHERE managername = ${db.escape(req.body.name)} and enablemanager=1; `, (err, result) => {
    // user does not exists
    if (err) {
      throw err;
      return res.status(400).send({
        msg: err
      });
    }
    if (!result.length) {
      return res.status(401).send({
        msg: 'Username or password is incorrect!'
      });
    }
    if (result[0]['password'] != md5(req.body.password)) {
      // wrong password
      return res.status(401).send({
                msg: 'Username or password is incorrect!'
      });
    } else {
        const token = jwt.sign({id:result[0].id},'the-super-strong-secrect',{ expiresIn: '1h' });
        //db.query(`UPDATE users SET last_login = now() WHERE id = '${result[0].id}'`);
        return res.status(200).send({
          msg: 'Logged in!',
          token,
          user: result[0]
        });
    }
      // check password
      // bcrypt.compare(
      //   req.body.password,
      //   result[0]['password'],
      //   (bErr, bResult) => {
      //     // wrong password
      //     if (bErr) {
      //       throw bErr;
      //       return res.status(401).send({
      //         msg: 'Username or password is incorrect!'
      //       });
      //     }
      //     if (bResult) {
      //       const token = jwt.sign({id:result[0].id},'the-super-strong-secrect',{ expiresIn: '1h' });
      //       db.query(
      //         `UPDATE users SET last_login = now() WHERE id = '${result[0].id}'`
      //       );
      //       return res.status(200).send({
      //         msg: 'Logged in!',
      //         token,
      //         user: result[0]
      //       });
      //     }
      //     return res.status(401).send({
      //       msg: 'Username or password is incorrect!'
      //     });
      //   }
      // );

    }
  );
});
router.post('/auth-api', signupValidation, (req, res, next) => {
  if(
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer') ||
    !req.headers.authorization.split(' ')[1]
    ){
        return res.status(422).json({
            message: "Please provide the token",
        });
  }
  const theToken = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(theToken, 'the-super-strong-secrect');

  return res.send({ error: false, message: 'Login Successfully.' });
});
router.post('/get-user', signupValidation, (req, res, next) => {


    if(
        !req.headers.authorization ||
        !req.headers.authorization.startsWith('Bearer') ||
        !req.headers.authorization.split(' ')[1]
    ){
        return res.status(422).json({
            message: "Please provide the token",
        });
    }

    const theToken = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(theToken, 'the-super-strong-secrect');

    db.query('SELECT * FROM users where id=?', decoded.id, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results[0], message: 'Fetch Successfully.' });
    });


});

router.post('/get-all-account', signupValidation, (req, res, next) => {
  if(
      !req.headers.authorization ||
      !req.headers.authorization.startsWith('Bearer') ||
      !req.headers.authorization.split(' ')[1]
  ){
      return res.status(422).json({
          message: "Please provide the token",
      });
  }

  const theToken = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(theToken, 'the-super-strong-secrect');

  db.query('SELECT username FROM rm_users', function (error, results) {
      if (error) throw error;
      return res.send({ error: false, data: results, message: 'Fetch Successfully.' });
  });


});

router.post('/get-services', signupValidation, (req, res, next) => {
  if(
      !req.headers.authorization ||
      !req.headers.authorization.startsWith('Bearer') ||
      !req.headers.authorization.split(' ')[1]
  ){
      return res.status(422).json({
          message: "Please provide the token",
      });
  }

  const theToken = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(theToken, 'the-super-strong-secrect');

  db.query('SELECT srvid,srvname FROM rm_services WHERE enableservice=1', function (error, results) {
      if (error) throw error;
      return res.send({ error: false, data: results, message: 'Fetch Successfully.' });
  });


});

router.post('/get-account', accountValidation, (req, res, next) => {
if(
      !req.headers.authorization ||
      !req.headers.authorization.startsWith('Bearer') ||
      !req.headers.authorization.split(' ')[1]
  ){
      return res.status(422).json({
          message: "Please provide the token",
      });
  }

  const theToken = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(theToken, 'the-super-strong-secrect');
  let sql = `SELECT u.username,u.srvid,u.enableuser,u.createdon,u.createdby,a.framedipaddress,a.acctstarttime,a.acctsessiontime,a.acctstoptime,a.callingstationid,u.expiration,s.srvname FROM rm_users u LEFT JOIN radacct a ON u.username = a.username JOIN rm_services s ON u.srvid = s.srvid WHERE u.username = ? ORDER BY a.acctstarttime DESC LIMIT 1`;
  db.query(sql,req.body.pppoe_account,function (error, results,fields) {
    if (error) throw error;
    
    console.log(req.body.pppoe_account);
      return res.send({ error: false, data: results, message: 'Fetch Successfully.' });
  });


});
router.post('/check-online', accountValidation, (req, res, next) => {
  console.log(req.body);
  if(
        !req.headers.authorization ||
        !req.headers.authorization.startsWith('Bearer') ||
        !req.headers.authorization.split(' ')[1]
    ){
        return res.status(422).json({
            message: "Please provide the token",
        });
    }
  
    const theToken = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(theToken, 'the-super-strong-secrect');
    let sql = `SELECT * FROM rm_users WHERE username = ?`;
    db.query(sql,req.body.pppoe_account,function (error, results,fields) {
      if (error) { throw error; }
      if (results.length > 0) {
        //account exists

        //check expired
        db.query('SELECT * FROM rm_users WHERE username = ? and expiration < NOW() and enableuser = 1', req.body.pppoe_account, function (error, results, fields) { 
          if (error)
            throw error;
          if (results.length > 0) { 
            return res.send({ error: false, data: results, message: 'expired' });
          } else {
            let sql = `SELECT * FROM rm_users WHERE username = ? and enableuser = 1`;
            db.query(sql, req.body.pppoe_account, function (error, results, fields) { 
              if (error)
                throw error;
              if (results.length > 0) { 
                // account enabled 
                let sql = `SELECT * FROM radacct WHERE username = ? and acctstoptime is null`;
                db.query(sql,req.body.pppoe_account,function (error, results,fields) {
                  if (error)
                    throw error;
                  if (results.length > 0) {
                    return res.send({ error: false, data: results, message: 'online' });
                  } else {
                    return res.send({ error: false, data: results, message: 'offline' });
                  }
                });
              } else {
                return res.send({ error: false, data: results, message: 'disabled' });
              }
            });
          }
        });
        
         

        

       
      }
      else {
        return res.send({ error: false, data: results, message: 'not found' });
      }
    });
  
  
});
router.post('/enable', accountValidation, (req, res, next) => {
  console.log(req.body);
  if(
        !req.headers.authorization ||
        !req.headers.authorization.startsWith('Bearer') ||
        !req.headers.authorization.split(' ')[1]
    ){
        return res.status(422).json({
            message: "Please provide the token",
        });
    }
  
    const theToken = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(theToken, 'the-super-strong-secrect');
    let sql = `UPDATE rm_users SET enableuser=1 WHERE username = ? `;
    db.query(sql,req.body.pppoe_account,function (error, results,fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Fetch Successfully.' });
    });
});
router.post('/disable', accountValidation, (req, res, next) => {
  console.log(req.body);
  if(
        !req.headers.authorization ||
        !req.headers.authorization.startsWith('Bearer') ||
        !req.headers.authorization.split(' ')[1]
    ){
        return res.status(422).json({
            message: "Please provide the token",
        });
    }
  
    const theToken = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(theToken, 'the-super-strong-secrect');
    let sql = `UPDATE rm_users SET enableuser=0 WHERE username = ? `;
    db.query(sql,req.body.pppoe_account,function (error, results,fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Fetch Successfully.' });
    });
});
router.post('/data', accountValidation, (req, res, next) => {
  console.log(req.body);
    if(
        !req.headers.authorization ||
        !req.headers.authorization.startsWith('Bearer') ||
        !req.headers.authorization.split(' ')[1]
    ){
        return res.status(422).json({
            message: "Please provide the token",
        });
    }
    const theToken = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(theToken, 'the-super-strong-secrect');
    let args = [
      req.body.enableuser,
      req.body.srvid,
    ];
    let sql = 'update rm_users set ' 
            +'enableuser =?,'
            + 'srvid =?';
    if(typeof req.body.expiration !== 'undefined'){
      args.push(req.body.expiration);
      sql += ', expiration =? ';
    }
    

    args.push(req.body.username);
    sql += 'where username =? ';
    db.query(sql,args,function (error, results) {
      if (error)
        throw error;
      console.log(results);
        return res.send({ error: false, data: results, message: 'User Updated Successfully.' });
    });
});
router.post('/create', createValidation, (req, res, next) => {
  console.log(req.body);
  if(
        !req.headers.authorization ||
        !req.headers.authorization.startsWith('Bearer') ||
        !req.headers.authorization.split(' ')[1]
    ){
        return res.status(422).json({
            message: "Please provide the token",
        });
    }
  
    const theToken = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(theToken, 'the-super-strong-secrect');
  let args = {
    'username':req.body.username,
    'password':req.body.password, 
    'groupid': req.body.groupid,
    'enableuser':req.body.enableuser, 
    'uplimit':req.body.uplimit, 
    'downlimit':req.body.downlimit, 
    'comblimit':req.body.comblimit, 
    'firstname':req.body.firstname, 
    'lastname':req.body.lastname, 
    'company':req.body.company, 
    'phone':req.body.phone, 
    'mobile':req.body.mobile, 
    'address':req.body.address, 
    'city':req.body.city, 
    'country':req.body.country, 
    'gpslat':req.body.gpslat, 
    'gpslong':req.body.gpslong, 
    'usemacauth':req.body.usemacauth, 
    'expiration':req.body.expiration, 
    'uptimelimit':req.body.uptimelimit, 
    'srvid':req.body.srvid, 
    'ipmodecm':req.body.ipmodecm, 
    'ipmodecpe':req.body.ipmodecpe, 
    'poolidcm':req.body.poolidcm, 
    'poolidcpe':req.body.poolidcpe, 
    'createdon':req.body.createdon, 
    'acctype':req.body.acctype, 
    'credits':req.body.credits, 
    'cardfails':req.body.cardfails, 
    'createdby':req.body.createdby, 
    'owner':req.body.owner, 
    'email':req.body.email, 
    'warningsent':req.body.warningsent, 
    'verified':req.body.verified, 
    'selfreg':req.body.selfreg, 
    'verifyfails':req.body.verifyfails, 
    'verifysentnum':req.body.verifysentnum, 
    'contractvalid':req.body.contractvalid, 
    'pswactsmsnum':req.body.pswactsmsnum, 
    'alertemail':req.body.alertemail, 
    'alertsms':req.body.alertsms, 
    'lang':req.body.lang, 
    'zip':req.body.zip, 
    'macpswmode':0,
    'autorenew':0,
    'state':0,
    'comment':'',
    'mac':'',
    'staticipcm':'',
    'staticipcpe':'',
    'taxid':'',
    'cnic':'',
    'maccm':'',
    'custattr':'',
    'verifycode':'',
    'verifymobile':'',
    'contractid':'',
    'actcode':'',
    };
    if(typeof req.body.srvid !== 'undefined'){
      args.srvid = req.body.srvid;
    }

    db.query('insert into rm_users SET ?', args,function (error, results) {
      if (error)
        throw error;
        return res.send({ error: false, data: results, message: 'User Created Successfully.' });
    });
});
router.post('/update', updateValidation, (req, res, next) => {
  console.log('updating user');
  console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array())
    return res.status(400).json({ errors: errors.array() });
  }

  if(
        !req.headers.authorization ||
        !req.headers.authorization.startsWith('Bearer') ||
        !req.headers.authorization.split(' ')[1]
    ){
        return res.status(422).json({
            message: "Please provide the token",
        });
    }
  
    const theToken = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(theToken, 'the-super-strong-secrect');
  let args = [
    req.body.username,
    req.body.groupid,
    req.body.enableuser,
    req.body.firstname,
    req.body.lastname,
    req.body.phone,
    req.body.mobile,
    req.body.address,
    req.body.city,
    req.body.country,
    req.body.gpslat,
    req.body.gpslong,
    req.body.zip,
 
  ];

  let sql = 'update rm_users set ' 
            +'username =?,'
            + 'groupid =?,'
            + 'enableuser =?,'
            + 'firstname =?,'
            + 'lastname =?,'
            + 'phone =?,'
            + 'mobile =?,'
            + 'address =?,'
            + 'city =?,'
            + 'country =?,'
            + 'gpslat =?,'
            + 'gpslong =?,'
            + 'zip =?';
            
  if(typeof req.body.srvid !== 'undefined'){
      args.push(req.body.srvid);
      sql += ', srvid =? ';
  }
  if(typeof req.body.password !== 'undefined'){
    args.push(req.body.password);
    sql += ', password =? ';
}
  args.push(req.body.username);
  sql += 'where username =? ';
  db.query(sql,args,function (error, results) {
      if (error)
        throw error;
      console.log(results);
        return res.send({ error: false, data: results, message: 'User Updated Successfully.' });
    });
});

router.post('/get-online', signupValidation, (req, res, next) => {
  if(
        !req.headers.authorization ||
        !req.headers.authorization.startsWith('Bearer') ||
        !req.headers.authorization.split(' ')[1]
    ){
        return res.status(422).json({
            message: "Please provide the token",
        });
    }
  
    const theToken = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(theToken, 'the-super-strong-secrect');
    console.log('expiration from = ' + req.body.from);
    console.log('expiration to = ' + req.body.to);
    let sql = `SELECT rm_users.username FROM rm_users JOIN radacct ON rm_users.username = radacct.username WHERE rm_users.enableuser=1 AND radacct.acctstoptime is null AND rm_users.expiration > NOW() AND rm_users.expiration between ${db.escape(req.body.from)}  and ${db.escape(req.body.to)} `;
    db.query(sql,function (error, results,fields) {
      if (error) { throw error; }
      if (results.length > 0) {
        return res.send({ error: false, data: results, message: 'success' });
      }
      else {
        return res.send({ error: false, data: results, message: 'no data' });
      }
    });
 });
 router.post('/get-offline', signupValidation, (req, res, next) => {
  if(
        !req.headers.authorization ||
        !req.headers.authorization.startsWith('Bearer') ||
        !req.headers.authorization.split(' ')[1]
    ){
        return res.status(422).json({
            message: "Please provide the token",
        });
    }
    console.log('expiration from = ' + req.body.from);
    console.log('expiration to = ' + req.body.to);
    const theToken = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(theToken, 'the-super-strong-secrect');
    let sql = `SELECT rm_users.username FROM rm_users WHERE rm_users.username NOT IN (SELECT rm_users.username FROM rm_users JOIN radacct ON rm_users.username = radacct.username WHERE rm_users.enableuser=1 AND radacct.acctstoptime is null) AND rm_users.enableuser=1 and  rm_users.expiration >= NOW() AND rm_users.expiration between ${db.escape(req.body.from)}  and ${db.escape(req.body.to)} `;
    db.query(sql,req.body.pppoe_account,function (error, results,fields) {
      if (error) { throw error; }
      if (results.length > 0) {
        return res.send({ error: false, data: results, message: 'success' });
      }
      else {
        return res.send({ error: false, data: results, message: 'no data' });
      }
    });
 });
router.post('/get-disabled', signupValidation, (req, res, next) => { 
  if(
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer') ||
    !req.headers.authorization.split(' ')[1]
){
    return res.status(422).json({
        message: "Please provide the token",
    });
}
console.log('expiration from = ' + req.body.from);
console.log('expiration to = ' + req.body.to);
const theToken = req.headers.authorization.split(' ')[1];
const decoded = jwt.verify(theToken, 'the-super-strong-secrect');
let sql = `SELECT username FROM rm_users WHERE rm_users.enableuser=0 AND rm_users.expiration between ${db.escape(req.body.from)}  and ${db.escape(req.body.to)} `;
db.query(sql,req.body.pppoe_account,function (error, results,fields) {
  if (error) { throw error; }
  if (results.length > 0) {
    return res.send({ error: false, data: results, message: 'success' });
  }
  else {
    return res.send({ error: false, data: results, message: 'no data' });
  }
});
});
router.post('/set-expiry', accountValidation, (req, res, next) => {
  console.log(req.body);
  if(
        !req.headers.authorization ||
        !req.headers.authorization.startsWith('Bearer') ||
        !req.headers.authorization.split(' ')[1]
    ){
        return res.status(422).json({
            message: "Please provide the token",
        });
    }
  
    const theToken = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(theToken, 'the-super-strong-secrect');
    let sql = `UPDATE rm_users SET expiration=${db.escape(req.body.expiration)} WHERE username = ${db.escape(req.body.username)} AND expiration < ${db.escape(req.body.expiration)} `;
    db.query(sql,function (error, results,fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Fetch Successfully.' });
    });
});
router.post('/get-expiry', signupValidation, (req, res, next) => { 
  if(
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer') ||
    !req.headers.authorization.split(' ')[1]
){
    return res.status(422).json({
        message: "Please provide the token",
    });
}
console.log('expiration from = ' + req.body.from);
console.log('expiration to = ' + req.body.to);
const theToken = req.headers.authorization.split(' ')[1];
const decoded = jwt.verify(theToken, 'the-super-strong-secrect');
let sql = `SELECT username,expiration FROM rm_users WHERE  rm_users.expiration < NOW() AND rm_users.enableuser = 1 HAVING expiration between ${db.escape(req.body.from)}  and ${db.escape(req.body.to)}` ;
db.query(sql,req.body.pppoe_account,function (error, results,fields) {
  if (error) { throw error; }
  if (results.length > 0) {
    return res.send({ error: false, data: results, message: 'success' });
  }
  else {
    return res.send({ error: false, data: results, message: 'no data' });
  }
});
});
module.exports = router;

