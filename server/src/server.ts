import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { app } from './app';
import { AppDataSource } from './config/data-source';

async function main() {
  await AppDataSource.initialize();
  const server = http.createServer(app);
  const io = new SocketIOServer(server, { cors: { origin: '*' } });
  io.on('connection', socket => console.log('WS connected', socket.id));
  
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => console.log(`Listening on ${PORT}`));
}

main().catch(console.error);