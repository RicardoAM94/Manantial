module.exports = {
  apps: [{
    name: 'manantial',
    script: './server.js',
    instances: 1, // Una instancia para Raspberry Pi
    exec_mode: 'fork', // Fork mode para menor uso de memoria
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    // Configuraciones específicas para Raspberry Pi
    max_memory_restart: '200M', // Reiniciar si usa más de 200MB
    node_args: '--max-old-space-size=256', // Limitar memoria V8
    watch: false,
    ignore_watch: ['node_modules', 'logs'],
    
    // Logs
    log_file: './logs/combined.log',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm Z',
    
    // Reinicio automático
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    
    // Configuraciones adicionales
    kill_timeout: 5000,
    listen_timeout: 8000,
    shutdown_with_message: true
  }],

  // Configuración de deployment
  deploy: {
    production: {
      user: 'pi',
      host: ['192.168.1.100'], // Cambiar por la IP de tu Raspberry Pi
      ref: 'origin/main',
      repo: 'git@github.com:usuario/manantial-de-los-secretos.git',
      path: '/home/pi/manantial-de-los-secretos',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};