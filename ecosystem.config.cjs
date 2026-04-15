const common = {
  script: "node_modules/next/dist/bin/next",
  exec_mode: "fork",
  instances: 1,
  autorestart: true,
  max_restarts: 10,
  min_uptime: "10s",
  kill_timeout: 10000,
  max_memory_restart: "1024M",
};

module.exports = {
  apps: [
    {
      ...common,
      name: "car-zajcon",
      cwd: "/var/www/car.zajcon.cz",
      args: "start -p 3030",
      env: {
        NODE_ENV: "production",
        PORT: "3030",
      },
    },
    {
      ...common,
      name: "carmakler",
      cwd: "/var/www/carmakler",
      args: "start -p 3000",
      env: {
        NODE_ENV: "production",
        PORT: "3000",
      },
    },
  ],
};
