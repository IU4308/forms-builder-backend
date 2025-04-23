import { Server } from 'socket.io';

let io;

export const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: '*', 
        }
    });

    io.on('connection', (socket) => {
        console.log('New client connected');
        
        socket.on('publishComment', (commentData) => {
            console.log('Broadcasting newComment:', commentData);
            io.emit('newComment', commentData);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });

    return io; 
};

export const getSocket = () => io;