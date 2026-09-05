export default function handler(req, res) {
  global.users = global.users || [];

  const ADMIN_PASSWORD = "kareemAhmed";

  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if(req.method === 'OPTIONS') return res.status(200).end();

  // التعديل المهم: نقرا الـ body
  let body = '';
  if(req.method === 'POST') {
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const { id, password } = JSON.parse(body);
        if(!id || !password) return res.status(400).json({ error: 'ناقص بيانات' });
        global.users.push({ id, password, date: new Date().toLocaleString('ar-EG') });
        return res.status(200).json({ success: true });
      } catch(e) {
        return res.status(400).json({ error: 'JSON غلط' });
      }
    });
    return; // مهم نعمل return هنا
  }

  // GET
  if(req.method === 'GET') {
    const { pass } = req.query;
    if(pass !== ADMIN_PASSWORD) return res.status(403).json({ error: 'غير مصرح' });
    return res.status(200).json(global.users);
  }

  // DELETE
  if(req.method === 'DELETE') {
    const { pass } = req.query;
    if(pass !== ADMIN_PASSWORD) return res.status(403).json({ error: 'غير مصرح' });
    global.users = [];
    return res.status(200).json({ success: true });
  }
}
