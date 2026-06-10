// PM2 ecosystem config
// Usage: pm2 start ecosystem.config.cjs --env production
module.exports = {
  apps: [
    {
      name: "spiritans",
      script: "npm",
      args: "run start",
      cwd: "/var/www/spiritans",   // ← your deploy path on VPS
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      out_file: "~/.pm2/logs/spiritans-out.log",
      error_file: "~/.pm2/logs/spiritans-err.log",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    },
  ],
};
