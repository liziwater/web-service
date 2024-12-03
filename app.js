// 連接到MySQL資料庫
/* const db = mysql.createConnection({
    host: 'localhost', // 資料庫主機
    user: 'liziweb',    // 資料庫用戶名
    password: 'zxcvb920526',  // 資料庫密碼
    database: 'liziweb'  // 資料庫名稱
});

// 資料庫連接成功後的回調函數
db.connect((err) => {
    if (err) throw err; // 如果連接失敗，拋出錯誤
    console.log('資料庫連接成功'); // 顯示資料庫連接成功訊息
}); */

// 註冊邏輯處理
app.post('/register', (req, res) => {
    const { username, password, department, email } = req.body;

    // 檢查帳號或電子郵件是否已存在於資料庫中
    /* const checkQuery = 'SELECT * FROM employees WHERE username = ? OR email = ?';
    db.query(checkQuery, [username, email], (err, results) => {
        if (err) {
            console.error(err); // 顯示資料庫錯誤
            return res.status(500).send('資料庫錯誤');
        }

        if (results.length > 0) {
            return res.status(400).send('帳號或電子郵件已存在'); // 如果資料庫已經有相同帳號或郵件，返回錯誤訊息
        }

        // 密碼加密
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error(err); // 顯示密碼加密錯誤
                return res.status(500).send('密碼加密錯誤');
            }

            // 插入新員工資料到資料庫
            const insertQuery = 'INSERT INTO employees (username, password, department, email) VALUES (?, ?, ?, ?)';
            db.query(insertQuery, [username, hashedPassword, department, email], (err, result) => {
                if (err) {
                    console.error(err); // 顯示資料庫錯誤
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
                    to: email, // 發送通知的電子郵件地址
                    subject: '註冊成功',
                    text: '您的帳號已成功註冊！'
                };

                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        console.error(err); // 顯示發送郵件錯誤
                    } else {
                        console.log('電子郵件已發送：' + info.response); // 顯示郵件發送成功訊息
                    }
                });

                res.send('註冊成功！'); // 註冊成功後顯示成功訊息
            });
        });
    }); */

    res.send('註冊功能已停用'); // 假設這是回應訊息，註明功能已停用
});

// 登入邏輯處理
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // 查詢資料庫中的使用者
    /* const query = 'SELECT * FROM employees WHERE username = ?';
    db.query(query, [username], (err, results) => {
        if (err) {
            console.error('資料庫查詢錯誤:', err); // 顯示資料庫查詢錯誤
            return res.status(500).send('伺服器錯誤');
        }

        if (results.length === 0) {
            console.log('用戶不存在:', username); // 顯示用戶不存在訊息
            return res.render('login', { message: '帳號或密碼錯誤' }); // 顯示錯誤訊息
        }

        const user = results[0];

        // 比對密碼
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error('密碼比對錯誤:', err); // 顯示密碼比對錯誤
                return res.status(500).send('伺服器錯誤');
            }

            if (!isMatch) {
                console.log('密碼錯誤:', username); // 顯示密碼錯誤訊息
                return res.render('login', { message: '帳號或密碼錯誤' }); // 顯示錯誤訊息
            }

            // 登入成功，設定會話
            req.session.userId = user.id;
            req.session.username = user.username;
            console.log('登入成功:', username); // 顯示登入成功訊息

            res.redirect('/employee-dashboard'); // 轉向員工儀表板
        });
    }); */

    res.send('登入功能已停用'); // 假設這是回應訊息，註明功能已停用
});

// 員工儀表板頁面
app.get('/employee-dashboard', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login'); // 如果使用者未登入，重定向到登入頁面
    }

    const userId = req.session.userId;
    // 資料庫查詢部分已停用
    res.send('員工儀表板功能已停用'); // 顯示功能已停用訊息
});

// 顯示公告頁面
app.get('/announcements', (req, res) => {
    // 查詢資料庫中的公告
    /* const query = 'SELECT * FROM announcements ORDER BY created_at DESC';  // 假設您的公告表格叫做 'announcements'
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('資料庫查詢錯誤:', err); // 顯示資料庫查詢錯誤
            return res.status(500).send('伺服器錯誤');
        }

        // 將查詢結果傳遞給 EJS 模板
        res.render('announcements', { announcements: results }); // 顯示公告頁面
    }); */

    res.send('公告頁面功能已停用'); // 顯示功能已停用訊息
});
