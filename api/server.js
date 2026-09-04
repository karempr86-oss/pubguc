const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname)));

const USERS_FILE = path.join('/tmp', 'users.json');

if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}

app.post('/login', (req, res) => {
  const { id, password } = req.body;
  const users = JSON.parse(fs.readFileSync(USERS_FILE));
  const user = users.find(u => u.id === id && u.password === password);
  if (user) return res.json({ success: true });
  res.json({ success: false });
});

app.post('/signup', (req, res) => {
  const { id, password } = req.body;
  const users = JSON.parse(fs.readFileSync(USERS_FILE));
  if (users.find(u => u.id === id)) return res.json({ success: false });
  users.push({ id, password });
  fs.writeFileSync(USERS_FILE, JSON.stringify(users));
  res.json({ success: true });
});

module.exports = app;
