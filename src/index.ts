import { startServer } from './app';
import { devConfig } from './config/environment'; 

// Start the server using the configuration
// const PORT = devConfig.serverPort;
const PORT = process.env.PORT || devConfig.serverPort;

startServer(PORT);

 