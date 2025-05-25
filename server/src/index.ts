import 'dotenv/config';         
import http                   from 'http';
import { Server as IO }       from 'socket.io';
import app                    from './app';
import { AppDataSource }      from './config/data-source';

(async () => {
  await AppDataSource.initialize();
  console.log('DB initialized');

  const server = http.createServer(app);
  const io = new IO(server, { cors: { origin: '*' } });
  io.on('connection', s => console.log('WS connected:', s.id));

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
})();
