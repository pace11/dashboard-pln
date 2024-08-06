module.exports = {
    apps: [
      {
        name: 'dashboard-app', 
        script: 'node_modules/next/dist/bin/next', 
        args: 'start', 
        instances: 2, 
        exec_mode: 'cluster',
      },
    ],
  };