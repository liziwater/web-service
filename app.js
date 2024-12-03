const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();

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
    // 假設這裡是公告資料的靜態示例
    const announcements = [
        { title: '公告1', content: '這是公告1的內容' },
        { title: '公告2', content: '這是公告2的內容' }
    ];

    // 將公告資料傳遞給 EJS 模板
    res.render('index', { announcements });
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

// 登入 API
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // 這裡不再檢查資料庫，只是做登入處理

    // 假設這裡有一個靜態帳號和密碼
    const user = { username: 'user1', password: 'password123' };  // 靜態明文密碼

    // 比對密碼
    if (password !== user.password) {
        console.log('密碼錯誤:', username);
        return res.render('login', { message: '帳號或密碼錯誤' });
    }

    // 登入成功，設定會話
    req.session.userId = 1;  // 假設ID為1
    req.session.username = user.username;
    console.log('登入成功:', username);

    res.redirect('/employee-dashboard');
});

// 員工儀表板頁面
app.get('/employee-dashboard', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }

    const user = { username: req.session.username };  // 假設已經取得登入的用戶
    res.render('employee-dashboard', { user: user });
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

app.listen(3000, () => {
    console.log('伺服器運行在 http://localhost:3000');
});
