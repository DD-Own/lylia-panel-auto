const fs = require('fs');
const path = require('path');

const dbPath = path.resolve('./database.json');
function readDB() {
  if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, '[]');
  return JSON.parse(fs.readFileSync(dbPath));
}
function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

module.exports = (req, res) => {
  if (req.method === 'GET') return res.status(200).json(readDB());

  if (req.method === 'POST') {
    const { whatsapp_number, role } = req.body;
    if (!whatsapp_number || !role) return res.status(400).json({ message: 'Data tidak lengkap' });

    const db = readDB();
    const idx = db.findIndex(u => u.whatsapp_number === whatsapp_number);
    if (idx >= 0) db[idx].role = role;
    else db.push({ whatsapp_number, role });

    writeDB(db);
    return res.status(200).json({ message: 'Tersimpan' });
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
};
