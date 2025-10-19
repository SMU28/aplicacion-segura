require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
// const userRoutes = require('./routes/users'); // registrar cuando exista

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: 'http://localhost:5500', credentials: true }));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => res.json({ message: 'API funcionando' }));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
// app.use('/api/users', userRoutes);

app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
