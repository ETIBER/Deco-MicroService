const net = require('net');

const LOG_HOST = process.env.LOG_HOST || "logStash"
const sender = require('os').hostname()

function getLogStream(logPort) {
	return _connect(logPort).then((conn) => {
	  	return conn
	})
}

function _connect(logPort) {
	return new Promise((resolve,reject) => {
    const conn = net.createConnection({host: LOG_HOST, port: logPort}, function() {
      console.log(`connected to server ${LOG_HOST}:${logPort}`)
      resolve(conn);
    })
    conn.on('error', () => {
      console.log(`error during connection to ${LOG_HOST}:${logPort}`);
      setTimeout(function() {
        console.log(`retry`);
        resolve (_connect(logPort));
      }, 2000);
    })
    conn.on('end', () => {
        console.log('disconnected from server');
      })
  })
}




module.exports = {
	getLogStream
}
