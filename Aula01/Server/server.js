const http = require('http');

const fs = require('fs')
const index = fs.readFileSync('./index.html');

const app = http.createServer((req, res) => {
  res.end(index);
}).listen(8080);

const io = require('socket.io').listen(app);

io.on('connection', (socket) => {
  console.log('connection no Socket.io', socket.handshake)

  socket.on('disconnect', () => {
    console.log('disconnect no socket', socket.handshake)
  })

  socket.on('connect-client', (data) => {
    const d1 = new Date(data)
    console.log('connect do client em', d1.toGMTString())
    socket.emit('return-client', d1.toGMTString())
  })

})
