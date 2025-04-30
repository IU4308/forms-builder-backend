import { Server } from 'socket.io';

export const initializeSocket = (server) => {
    const io = new Server(server, {
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