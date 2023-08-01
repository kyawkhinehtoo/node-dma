const { check } = require('express-validator');

exports.signupValidation = [
    check('name', 'Name is requied').not().isEmpty(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 })
]

exports.loginValidation = [
  //   check('email', 'Please include a valid email').isEmail().normalizeEmail({ gmail_remove_dots: true }),
     check('name', 'Name is requied').not().isEmpty(),
     check('password', 'Password must be 6 or more characters').isLength({ min: 6 })

]

exports.accountValidation = [
  //   check('email', 'Please include a valid email').isEmail().normalizeEmail({ gmail_remove_dots: true }),
     check('pppoe_account', 'PPPOE Account is requied').not().isEmpty(),
     check('name', 'Name is requied').not().isEmpty(),
     check('password', 'Password must be 6 or more characters').isLength({ min: 6 })

]
exports.createValidation = [
 
  //   check('email', 'Please include a valid email').isEmail().normalizeEmail({ gmail_remove_dots: true }),
  check('username', 'User Name is requied').not().isEmpty(),
  check('password', 'Password is requied').not().isEmpty(),
  check('groupid', 'Group ID is requied').not().isEmpty(),
  check('enableuser', 'Enable User is requied').not().isEmpty(),
  check('uplimit', 'Uplimit is requied').not().isEmpty(),
  check('downlimit', 'Downlimit is requied').not().isEmpty(),
  check('comblimit', 'Comblimit is requied').not().isEmpty(),
  check('firstname', 'Firstname is requied').not().isEmpty(),
  check('phone', 'Phone is requied').not().isEmpty(),
  check('mobile', 'Mobile is requied').not().isEmpty(),
  check('address', 'Address is requied').not().isEmpty(),
  check('city', 'City is requied').not().isEmpty(),
  check('country', 'Country is requied').not().isEmpty(),
  check('gpslat', 'GPS Lat is requied').not().isEmpty(),
  check('gpslong', 'GPS Long is requied').not().isEmpty(),
  check('gpslat','Invalid decimal value').isDecimal(),
  check('gpslong','Invalid decimal value').isDecimal(),
  check('usemacauth', 'Use Mac Auth is requied').not().isEmpty(),
  check('expiration', 'Expiration is requied').not().isEmpty(),
  check('uptimelimit', 'Uptime Limit is requied').not().isEmpty(),
  check('srvid', 'Srv ID is requied').not().isEmpty(),
  check('ipmodecm', 'IP Mode CM is requied').not().isEmpty(),
  check('ipmodecpe', 'IP Mode CPE is requied').not().isEmpty(),
  check('poolidcm', 'Pool ID CM is requied').not().isEmpty(),
  check('poolidcpe', 'Pool ID CPE is requied').not().isEmpty(),
  check('createdon', 'Created On is requied').not().isEmpty(),
  check('acctype', 'Acc Type is requied').not().isEmpty(),
  check('credits', 'Credits is requied').not().isEmpty(),
  check('cardfails', 'Card Fails is requied').not().isEmpty(),
  check('createdby', 'Created By is requied').not().isEmpty(),
  check('owner', 'Owner is requied').not().isEmpty(),
  check('email', 'Email is requied').not().isEmpty(),
  check('warningsent', 'Warning Sent is requied').not().isEmpty(),
  check('verified', 'Verified is requied').not().isEmpty(),
  check('selfreg', 'Self Reg is requied').not().isEmpty(),
  check('verifyfails', 'Verify Fails is requied').not().isEmpty(),
  check('verifysentnum', 'Verify Sent Num is requied').not().isEmpty(),
  check('contractvalid', 'Contract Valid is requied').not().isEmpty(),
  check('pswactsmsnum', 'Psw Act SMS Num is requied').not().isEmpty(),
  check('alertemail', 'Alert Email is requied').not().isEmpty(),
  check('alertsms', 'Alert SMS is requied').not().isEmpty(),
  check('lang', 'Lang is requied').not().isEmpty()
]

exports.updateValidation = [
 
 
  check('username', 'User Name is requied').not().isEmpty(),
  check('groupid', 'Group ID is requied').not().isEmpty(),
  check('enableuser', 'Enable User is requied').not().isEmpty(),
  check('firstname', 'Firstname is requied').not().isEmpty(),
//  check('lastname', 'Lastname is requied').not().isEmpty(),
  // check('company', 'Company is requied').not().isEmpty(),
  check('phone', 'Phone is requied').not().isEmpty(),
//  check('mobile', 'Mobile is requied').not().isEmpty(),
  check('address', 'Address is requied').not().isEmpty(),
  check('city', 'City is requied').not().isEmpty(),
  check('country', 'Country is requied').not().isEmpty(),
  check('gpslat', 'GPS Lat is requied').not().isEmpty(),
  check('gpslong', 'GPS Long is requied').not().isEmpty(),
  check('gpslat','Invalid decimal value').isDecimal(),
  check('gpslong','Invalid decimal value').isDecimal(),
  // check('email', 'Email is requied').not().isEmpty()
 
]
