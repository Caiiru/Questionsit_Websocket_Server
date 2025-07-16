import {startServer} from './app';
import { devConfig } from './config/environment';

// Start the server using the configuration
const PORT = devConfig.serverPort;      

startServer(PORT);