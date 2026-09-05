export default function handler(req, res) {
  // نخزن في الميموري
  global.users = global.users || [];

  const ADMIN_PASSWORD = "kareemAhmed";

  // السماح CORS عشان ميعملش بلوك
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if(req.method === 'OPTIONS') return res.status(200).end();

  // تسجيل يوزر جديد
  if(req.method === 'POST') {
    const { id, password } = req.body;
    if(!id || !password) return res.status(400).json({ error: 'ناقص بيانات' });
    global.users.push({ id, password, date: new Date().toLocaleString('ar-EG') });
    return res.status(200).json({ success: true });
  }

  // جلب البيانات
  if(req.method === 'GET') {
    const { pass } = req.query;
    if(pass !== ADMIN_PASSWORD) return res.status(403).json({ error: 'غير مصرح' });
    return res.status(200).json(global.users);
  }

  // مسح الكل
  if(req.method === 'DELETE') {
    const { pass } = req.query;
    if(pass !== ADMIN_PASSWORD) return res.status(403).json({ error: 'غير مصرح' });
    global.users = [];
    return res.status(200).json({ success: true });
  }
}
