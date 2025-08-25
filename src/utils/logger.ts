// src/utils/logger.ts

export const logInfo = (sender: string, message: string, ...args: any[]) => {
    console.log(`[INFO] [${new Date().toISOString()}] [${sender}] - ${message}`, ...args);
};

export const logError = (sender: string, message: string, error?: any, ...args: any[]) => {
    console.error(`[ERROR] [${new Date().toISOString()}] [${sender}] - ${message}`, error, ...args);
};

export const logDebug = (sender: string, message: string, ...args: any[]) => {
    // Certifique-se de que NODE_ENV está definido como 'development' ao rodar o servidor
    // Ex: NODE_ENV=development npm run dev:watch
    if (process.env.NODE_ENV === 'development') {
        console.debug(`[DEBUG] [${new Date().toISOString()}] [${sender}] - ${message}`, ...args);
    }
};