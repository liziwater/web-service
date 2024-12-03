const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// 設置 body-parser 以解析 JSON 請求
app.use(bodyParser.json());

// 註冊路由
app.post('/register', (req, res) => {
    const { username, password, department, email } = req.body;

    // 這裡簡化為直接使用密碼，不加密
    const user = {
        username: username,
        password: password, // 密碼直接儲存
        department: department,
        email: email
    };

    // 模擬註冊成功回應
    console.log('User registered:', user);
    res.send('註冊成功！');
});

// 登入路由
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // 模擬登入邏輯
    if (username === 'admin' && password === '1234') {
        res.send('登入成功！');
    } else {
        res.send('帳號或密碼錯誤！');
    }
});

// 啟動伺服器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`伺服器正在運行在 http://localhost:${PORT}`);
});
