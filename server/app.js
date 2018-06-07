const  Koa =require('koa');
const validate =require('koa-validate');
const views =require('koa-views');
const json =require('koa-json');
const onerror =require('koa-onerror');
const bodyparser =require('koa-bodyparser');
const logger =require('koa-logger');
const cors =require('koa-cors');
//const session =require('koa-session');
const fs =require('fs');
const path =require('path');
const http =require('http');
const _debug =require('debug');

const restc =require('restc')
const router =require('./routes');


const app = new Koa();
validate(app);
var debug = _debug('demo:server');

// error handler
onerror(app);

// middlewares
app.use(restc.koa2({
  includes: [/^\/test/]
}))

app.use(cors());
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}));
app.use(json());
app.use(logger());

app.use(require('koa-static')(path.join(__dirname ,'/public')));

app.use(views(path.join(__dirname , '/views'), {extension: 'ejs'}));

// logger
app.use(async(ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

//routes
router(app)

/**
 * Get port =require(environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3015');
// app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app.callback());

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  let bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}


const page = new Koa();

page.use(require('koa-static')(path.join(__dirname ,'../build')));

const pageServer = http.createServer(page.callback());

/**
 * Listen on provided port, on all network interfaces.
 */

pageServer.listen(3016);
pageServer.on('error', onError);
pageServer.on('listening', onListening);
