
const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '', // Empty password for XAMPP default
    connectionLimit: 5,
    database: 'homeconnect'
});

async function testConnection() {
    let conn;
    try {
        console.log("Attempting to connect to MariaDB/MySQL...");
        conn = await pool.getConnection();
        console.log("Connected successfully!");
        const rows = await conn.query("SELECT 1 as val");
        console.log("Query result:", rows); // Should be [{ val: 1 }]
    } catch (err) {
        console.error("Connection failed:", err);
    } finally {
        if (conn) conn.end();
        pool.end();
    }
}

testConnection();
