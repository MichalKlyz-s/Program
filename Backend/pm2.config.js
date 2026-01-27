const { Script } = require("vm");

module.exports = {
    apps: [
        {
            name: 'pipeOrgans_backend',
            script: 'dist/index.js',
            instances: 1,
            exec_mode: 'fork',
            node_args: '--max-old-space-size=20000 --stack-size=1024 --stack-trace-limit=1000',
            autorestart: true,
            watch: false,
            max_memory_restart: '6G',
            env: {
                NODE_ENV: 'development'
            },
            env_production: {
                NODE_ENV: 'production',
            },
        }
    ]
}