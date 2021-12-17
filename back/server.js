const http = require('http'); //pour discuter avec les requetes HTTP
const app = require('./app');

//parametrage de l'utilisation des ports
const normalizePort = val => {
  const port = parseInt(val, 10);
//si la lecture du port est inférieure a 10 ou retourne une mauvaise valeur alors retourner invalide
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
//parametrage du port pour se lancer sur 3000 automatiquement
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

//lecture des erreurs
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  //indique les ports
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);
