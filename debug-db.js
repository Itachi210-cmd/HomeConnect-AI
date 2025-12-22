const mariadb = require('mariadb');
const pool = mariadb.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    port: 3306,
    connectionLimit: 5,
    database: 'homeconnect'
});

console.log('Attempting connection...');
pool.getConnection()
    .then(conn => {
        console.log("✅ Successfully connected to MariaDB!");
        conn.release(); // release to pool
        process.exit(0);
    })
    .catch(err => {
        console.error("❌ Connection failed:", err);
        process.exit(1);
    });
