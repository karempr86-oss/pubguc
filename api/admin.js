    let users = []; // مؤقت

    export default function handler(req, res) {
      const ADMIN_PASSWORD = "kareemAhmed"; 

      if(req.method === 'POST') {
        const { id, password } = req.body;
        users.push({ id, password, date: new Date().toLocaleString('ar-EG') });
        return res.status(200).json({ success: true });
      }

      if(req.method === 'GET') {
        const { pass } = req.query;
        if(pass !== ADMIN_PASSWORD) return res.status(403).json({ error: 'غير مصرح' });
        return res.status(200).json(users);
      }
    }
