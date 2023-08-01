
var mysql = require('mysql2');
var db_config = {
  connectionLimit : 10,
  host            : 'localhost', // Replace with your host name
  user            : 'kkh',      // Replace with your database username
  password        : 'kkh',      // Replace with your database password
  database        : 'lmn_radius' // // Replace with your database Name
};
var pool;
function handleDisconnect() {
  pool = mysql.createPool(db_config); // Recreate the connection, since
  // the old one cannot be reused.

  pool.getConnection(function (err,connection) {              // The server is either down
    if (err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 60000); // We introduce a delay before attempting to reconnect,
    }    
                                     // to avoid a hot loop, and to allow our node script to
                                    // process asynchronous requests in the meantime.
  
  });                                    
  // If you're also serving http, display a 503 error.
  pool.on('error', function (err) {
    console.log('db error', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
  
}

handleDisconnect();
module.exports = pool; 

