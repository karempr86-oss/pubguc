import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const USERS_FILE = path.join('/tmp', 'users.json');
  if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, '[]');
  
  let users = JSON.parse(fs.readFileSync(USERS_FILE));

  if (req.method === 'POST' && req.url === '/api/login') {
    const { id, password } = req.body;
    const user = users.find(u => u.id === id && u.password === password);
    return res.status(200).json({ success: !!user });
  }

  if (req.method === 'POST' && req.url === '/api/signup') {
    const { id, password } = req.body;
    if (users.find(u => u.id === id)) return res.status(200).json({ success: false });
    users.push({ id, password });
    fs.writeFileSync(USERS_FILE, JSON.stringify(users));
    return res.status(200).json({ success: true });
  }
  
  res.status(404).json({ error: 'Not Found' });
}
