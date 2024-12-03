const express = require('express');  // 引入 express 模組
const bcrypt = require('bcrypt');    // 引入 bcrypt 模組進行密碼加密
const nodemailer = require('nodemailer'); // 引入 nodemailer 模組發送郵件
const session = require('express-session'); // 引入 express-session 用來管理會話

const app = express(); // 初始化 express 應用程式

// 中介軟體設置
app.use(express.json()); // 用來解析 application/json
app.use(express.urlencoded({ extended: true })); // 用來解析 application/x-www-form-urlencoded
app.use(session({ secret: 'your-session-secret', resave: false, saveUninitialized: true }));

// 註冊邏輯
app.post('/register', (req, res) => {
    const { username, password, department, email } = req.body;

    // 這裡原本應該查詢資料庫的部分，我們已經刪除
    // 假設不檢查重複的帳號或郵件

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            console.error(err);
            return res.status(500).send('密碼加密錯誤');
        }

        // 在這裡原本是要插入資料庫的部分，我們已經刪除
        // 假設成功註冊

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'your-email@gmail.com',
                pass: 'your-email-password'
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

// 登入邏輯處理
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // 這裡原本應該查詢資料庫的部分，我們已經刪除
    // 假設帳號和密碼正確

    // 密碼檢查邏輯
    bcrypt.compare(password, '預設密碼哈希', (err, isMatch) => {
        if (err) {
            console.error('密碼比對錯誤:', err);
            return res.status(500).send('伺服器錯誤');
        }

        if (!isMatch) {
            console.log('密碼錯誤:', username);
            return res.render('login', { message: '帳號或密碼錯誤' });
        }

        // 登入成功，設定會話
        req.session.userId = 1; // 假設登入的用戶ID
        req.session.username = username;
        console.log('登入成功:', username);

        res.redirect('/employee-dashboard'); // 轉向員工儀表板
    });
});

// 員工儀表板頁面
app.get('/employee-dashboard', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login'); // 如果使用者未登入，重定向到登入頁面
    }

    // 假設員工資訊靜態顯示
    const user = { id: req.session.userId, username: req.session.username };
    res.render('employee-dashboard', { user: user }); // 顯示員工儀表板頁面
});

// 顯示公告頁面
app.get('/announcements', (req, res) => {
    // 假設這裡顯示靜態公告
    const announcements = [
        { id: 1, title: '公司公告 1', content: '內容 1' },
        { id: 2, title: '公司公告 2', content: '內容 2' }
    ];

    res.render('announcements', { announcements: announcements }); // 顯示公告頁面
});

// 啟動伺服器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`伺服器運行在 ${PORT} 端口`);
});
