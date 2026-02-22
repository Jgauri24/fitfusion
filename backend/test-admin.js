const jwt = require('jsonwebtoken');
require('dotenv').config();
const token = jwt.sign({ id: 'admin1', role: 'ADMIN' }, process.env.JWT_SECRET, { expiresIn: '1h' });
console.log(token);
