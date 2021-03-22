const express = require('express');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: {origin: "*"}
});



const rooms = new Map();

app.use(express.json());



app.get('/rooms/:id', (request, response) => {
    const roomId = request.params.id;
    const users = [...rooms.get(roomId).get('users').values()];
    response.send(users);   
});



app.post('/rooms', (request, response) => {
    const {roomId, userName} = request.body;
    if(!rooms.has(roomId)) {
        rooms.set(roomId, new Map([
            ['users', new Map()],
            ['messages', []]
        ]));
    }
    response.send();
});



io.on('connection', socket => { 

    socket.on('ROOM:JOIN', ({roomId, userName}) => {
        socket.join(roomId);
        rooms.get(roomId).get('users').set(socket.id, userName); //add new property socket.id
    })

    socket.on('ROOM:SET_USERS', ({roomId, data}) => {
        socket.to(roomId).emit('CLIENT:SET_USERS', data);
    })

    socket.on('ROOM:NEW_MESSAGE', ({text, userName, roomId}) => {
        const obj = {text, userName};
        rooms.get(roomId).get('messages').push(obj);
        socket.broadcast.to(roomId).emit('CLIENT:SET_MESSAGE', obj); //socket event who send message to all users without user who send this message (because broadcast) || check client*
    })

    socket.on('disconnect', () => {
        rooms.forEach((room, roomId) => {
            if(room.get('users').delete(socket.id)) {
                const users = [...room.get('users').values()];
                socket.to(roomId).emit('CLIENT:SET_USERS', users);
            }
        })
        
    })

    console.log('User connected', socket.id)
});



http.listen(5000, error => {
    if(error) throw new Error("Server was crashed.")
    console.log("Server is up in port 5000")
});