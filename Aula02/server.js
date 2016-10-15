const http = require('http')

const fs = require('fs')
const index = fs.readFileSync('./index.html');

const app = http.createServer((req, res)  => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(index);
}).listen(8080)

const io = require('socket.io').listen(app)

const users = []

const rooms = ['chat da uol']

io.on('connection', (socket) => {
  console.log('conexão com o Socket.io')

  socket.on('disconnect', () => {
    console.log('disconnect no socket')
    removeUser(socket.user)

  })
  socket.on('adduser', (user) => {
    console.log('user', user)
    users.push(user)
    socket.join(rooms[0])
    socket.room = rooms[0]
    socket.broadcast.to(rooms[0]).emit('enterroom', user)
    socket.broadcast.to(rooms[0]).emit('listUsers', users);
    socket.emit('listUsers', users);
    socket.user = user;
  })
  function removeUser(user){
    let key = users.indexOf(user)
    if (users[key] === socket.user) {
      users.splice(key, 1);
    }
    socket.broadcast.to(rooms[0]).emit('listUsers', users);
    socket.emit('listUsers', users);
  }
  socket.on('leavechat', (user) => {
    users.filter(removeUser)
  })
  socket.on('message', (msg) => {
    console.log('message', msg)
    socket.broadcast.emit('message', msg)
  })

  socket.on('connect-client', (data) => {
    const d1 = new Date(data)
    console.log('connect do client em', d1.toGMTString())
  })
})

// Entre em localhost:8080
