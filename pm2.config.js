module.exports = {
  apps: [{
    name: 'manantial-secretos',
    script: 'server.js',
    cwd: '/home/ricardomr/manantial',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000,
      DEVELOPMENT_MODE: false
    },
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_memory_restart: '512M',
    log_file: '/home/ricardomr/logs/manantial-app.log',
    error_file: '/home/ricardomr/logs/manantial-error.log',
    out_file: '/home/ricardomr/logs/manantial-out.log',
    time: true,
    
    // Configuración específica para Raspberry Pi
    node_args: '--max-old-space-size=384',
    
    // Variables de entorno adicionales
    env_vars: {
      TZ: 'America/Argentina/Buenos_Aires'
    },
    
    // Reiniciar si el uso de CPU es muy alto
    max_restarts: 10,
    min_uptime: '10s',
    
    // Configuración de logs
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    
    // Configuración para desarrollo
    ignore_watch: ['node_modules', 'logs', '*.log']
  }]
};