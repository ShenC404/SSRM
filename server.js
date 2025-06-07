const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 连接阿里云 PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
});

// 中间件
app.use(cors());
app.use(express.json());

// 测试数据库连接
app.get('/api/test', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: '数据库连接失败' });
  }
});

// 获取所有软件
app.get('/api/software', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM software');
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: '获取软件列表失败' });
  }
});

// 获取用户订阅
app.get('/api/subscriptions/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const query = `
      SELECT s.*, sw.name as software_name, sw.category, sw.icon 
      FROM subscriptions s
      JOIN software sw ON s.software_id = sw.id
      WHERE s.user_id = $1
      ORDER BY s.expiry_date ASC
    `;
    const { rows } = await pool.query(query, [userId]);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: '获取订阅列表失败' });
  }
});

// 添加新订阅
app.post('/api/subscriptions', async (req, res) => {
  try {
    const { 
      userId, 
      softwareId, 
      renewalDate, 
      expiryDate, 
      cost, 
      type, 
      notes,
      status 
    } = req.body;
    
    const query = `
      INSERT INTO subscriptions (
        user_id, software_id, renewal_date, expiry_date, cost, type, notes, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    
    const values = [
      userId, 
      softwareId, 
      renewalDate, 
      expiryDate, 
      cost, 
      type, 
      notes,
      status
    ];
    
    const { rows } = await pool.query(query, values);
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: '添加订阅失败' });
  }
});

// 更新订阅
app.put('/api/subscriptions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      renewalDate, 
      expiryDate, 
      cost, 
      type, 
      notes,
      status 
    } = req.body;
    
    const query = `
      UPDATE subscriptions 
      SET 
        renewal_date = $1, 
        expiry_date = $2, 
        cost = $3, 
        type = $4, 
        notes = $5,
        status = $6,
        updated_at = NOW()
      WHERE id = $7
      RETURNING *
    `;
    
    const values = [
      renewalDate, 
      expiryDate, 
      cost, 
      type, 
      notes,
      status,
      id
    ];
    
    const { rows } = await pool.query(query, values);
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: '更新订阅失败' });
  }
});

// 删除订阅
app.delete('/api/subscriptions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'DELETE FROM subscriptions WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: '订阅不存在' });
    }
    
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: '删除订阅失败' });
  }
});

app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});