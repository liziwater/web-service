const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();

// 連接到MySQL資料庫
const db = mysql.createConnection({
    host: 'localhost',
    user: 'liziweb',
    password: 'zxcvb920526',
    database: 'liziweb'
});

db.connect((err) => {
    if (err) throw err;
    console.log('資料庫連接成功');
});

// 設定EJS作為模板引擎
app.set('view engine', 'ejs');
app.use(express.static('public'));

// 使用body-parser處理POST請求
app.use(bodyParser.urlencoded({ extended: true }));

// 設定會話
app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: true
}));

// 設定首頁路由
app.get('/', (req, res) => {
    // 從資料庫查詢公告
    const query = 'SELECT * FROM announcements ORDER BY created_at DESC';  // 假設您的公告表格叫做 'announcements'
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('資料庫查詢錯誤:', err);
            return res.status(500).send('伺服器錯誤');
        }

        // 將查詢結果傳遞給 EJS 模板
        res.render('index', { announcements: results });
    });
});

// 顯示登入頁面
app.get('/login', (req, res) => {
    res.render('login');
});

// 顯示註冊頁面
app.get('/register', (req, res) => {
    res.render('register');
});

// 註冊邏輯處理
app.post('/register', (req, res) => {
    const { username, password, department, email } = req.body;

    // 檢查帳號是否已存在
    const checkQuery = 'SELECT * FROM employees WHERE username = ? OR email = ?';
    db.query(checkQuery, [username, email], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('資料庫錯誤');
        }

        if (results.length > 0) {
            return res.status(400).send('帳號或電子郵件已存在');
        }

        // 加密密碼
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error(err);
                return res.status(500).send('密碼加密錯誤');
            }

            // 插入新員工資料到資料庫
            const insertQuery = 'INSERT INTO employees (username, password, department, email) VALUES (?, ?, ?, ?)';
            db.query(insertQuery, [username, hashedPassword, department, email], (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('註冊失敗');
                }

                // 註冊成功，發送電子郵件通知
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'your-email@gmail.com',  // 替換為有效的郵箱地址
                        pass: 'your-email-password'    // 替換為有效的郵箱密碼或使用應用程式密碼
                    }
                });

                const mailOptions = {
                    from: 'your-email@gmail.com',
                    to: email,
                    subject: '註冊成功',
                    text: '您的帳號已成功註冊！'
                };

                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log('電子郵件已發送：' + info.response);
                    }
                });

                res.send('註冊成功！');
            });
        });
    });
});

// 登入 API
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // 查詢資料庫中的使用者
    const query = 'SELECT * FROM employees WHERE username = ?';
    db.query(query, [username], (err, results) => {
        if (err) {
            console.error('資料庫查詢錯誤:', err);
            return res.status(500).send('伺服器錯誤');
        }

        if (results.length === 0) {
            console.log('用戶不存在:', username);
            return res.render('login', { message: '帳號或密碼錯誤' });
        }

        const user = results[0];

        // 比對密碼
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error('密碼比對錯誤:', err);
                return res.status(500).send('伺服器錯誤');
            }

            if (!isMatch) {
                console.log('密碼錯誤:', username);
                return res.render('login', { message: '帳號或密碼錯誤' });
            }

            // 登入成功，設定會話
            req.session.userId = user.id;
            req.session.username = user.username;
            console.log('登入成功:', username);

            res.redirect('/employee-dashboard');
        });
    });
});

// 員工儀表板頁面
app.get('/employee-dashboard', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }

    const userId = req.session.userId;
    const query = 'SELECT * FROM employees WHERE id = ?';
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('資料庫查詢錯誤:', err);
            return res.status(500).send('伺服器錯誤');
        }

        if (results.length === 0) {
            return res.status(404).send('員工資料未找到');
        }

        const user = results[0];
        res.render('employee-dashboard', { user: user });
    });
});

// 登出 API
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('登出錯誤');
        }
        res.redirect('/login');
    });
});

// 其他頁面
app.get('/travel', (req, res) => {
    res.render('travel');
});
app.get('/support', (req, res) => {
    res.render('support');
});
app.get('/nofunction', (req, res) => {
    res.render('nofunction');  // 使用已存在的錯誤頁面
});

// 顯示公告頁面
app.get('/announcements', (req, res) => {
    const query = 'SELECT * FROM announcements ORDER BY created_at DESC';  // 假設您的公告表格叫做 'announcements'
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('資料庫查詢錯誤:', err);
            return res.status(500).send('伺服器錯誤');
        }

        // 將查詢結果傳遞給 EJS 模板
        res.render('announcements', { announcements: results });
    });
});

app.listen(3000, () => {
    console.log('伺服器運行在 http://localhost:3000');
});
