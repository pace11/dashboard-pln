module.exports = {
    apps: [
      {
        name: 'dashboard-app', 
        script: 'node_modules/next/dist/bin/next', 
        args: 'start', 
        instances: 'max', 
        exec_mode: 'cluster', 
      },
    ],
  };