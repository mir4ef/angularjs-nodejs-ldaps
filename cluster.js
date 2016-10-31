/**
 * @file cluster.js
 * @author Miroslav Georgiev
 * @version 1.0.0
 */
'use strict';

// load the packages
const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
    const numCPUs = os.cpus().length;

    console.info(`${new Date()}: Starting ${numCPUs} nodes...`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('online', worker => {
        console.info(`${new Date()}: Node ${worker.process.pid} started!`);
    });

    cluster.on('exit', (worker, code, signal) => {
        console.info(`${new Date()}: Node ${worker.process.pid} died with code: ${code}, and signal:`, signal);
        console.info(`${new Date()}: Starting a new node...`);
        cluster.fork();
    });
} else {
    require('./server');
}