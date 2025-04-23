import { Server } from 'socket.io';

export const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: '*', 
        }
    });

    io.on('connection', (socket) => {
        console.log('New client connected');

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });

    return io; 
};