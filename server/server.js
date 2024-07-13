const cors = require('cors');
const express = require('express');
const app = express();
const morgan = require('morgan');
const dotenv = require('dotenv')
const path = require('path')
dotenv.config({ path: 'config.env' })

require('../database/db');
const authRoutes = require('./routes/authRoutes');
const taskRouter = require('./routes/taskRoutes');
const APIRoutes = require('./routes/APIRoutes');

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

//app.use('/uploads', express.static(path.resolve('uploads')))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// console.log(express.static(path.join(__dirname, 'uploads')))

app.use('/auth', authRoutes);
app.use('/task', taskRouter);
app.use('/api', APIRoutes);

const port = 4000;

app.listen(port, () => {
	console.log(`server is running on port`, port);
});
