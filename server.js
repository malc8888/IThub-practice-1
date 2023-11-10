const fs = require('fs');
const WebSocket = require('ws');

const keywords = {
    'cat': ['https://img.freepik.com/free-photo/red-white-cat-i-white-studio_155003-13189.jpg', 
            'https://img.freepik.com/free-photo/cute-cat-relaxing-studio_23-2150692717.jpg', 
            'https://img.freepik.com/premium-photo/british-shorthair-kitten-sitting-looking_191971-4588.jpg'],
    'dog': ['https://img.freepik.com/free-photo/isolated-happy-smiling-dog-white-background-portrait-4_1562-693.jpg', 
            'https://img.freepik.com/free-photo/beautiful-pet-portrait-dog_23-2149218450.jpg', 
            'https://img.freepik.com/free-photo/front-view-cute-dog_23-2148423553.jpg'],
    'bird': ['https://img.freepik.com/free-photo/selective-focus-shot-hummingbird-flight_181624-56855.jpg', 
            'https://img.freepik.com/free-photo/beautiful-shot-cute-mallard-walking-grass_181624-28020.jpg', 
            'https://img.freepik.com/free-photo/bee-eater-sitting-tree-branch-clouded-sky_181624-30671.jpg'],    
  // Другие ключевые слова с соответствующими URL
};

let MAX_CONCURRENT_THREADS = 1; 
fs.readFile('config.txt', 'utf8', function(err, data) {
  if (!err) {
    MAX_CONCURRENT_THREADS = Number(data);
    console.log('MAX_CONCURRENT_THREADS set to', MAX_CONCURRENT_THREADS);
  } else {
    console.error('Failed to read config.txt:', err);
  }
}); 

const server = new WebSocket.Server({ port: 8080 });

server.on('connection', (socket) => {
  console.log('Client connected');
  let threadCount = 0; 

  socket.on('message', (message) => {
    console.log(`Received message: ${message}`);
    const urls = keywords[message];
    if (threadCount < MAX_CONCURRENT_THREADS) {
      threadCount++;

      if (urls) {
        socket.send(JSON.stringify(urls));
      } else {
        socket.send(JSON.stringify(new String('empty')));
      }

      console.log('Started stream');
    } else {
      console.log('Maximum concurrent streams reached');
    }
  });

  socket.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log("Server started on port 8080");