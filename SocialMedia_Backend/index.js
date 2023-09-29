const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json({ limit: '5mb' }));
app.use(cors());
app.use(cors({
    origin: 'http://localhost:4200'
  }));

app.use(express.static('./uploads'))

//routes
app.use('/api/user', require('./routes/user'))
app.use('/api/subscription', require('./routes/subscription'))
app.use('/api/category', require('./routes/category'))
app.use('/api/package', require('./routes/package'))
app.use('/api/post', require('./routes/post'))
app.use('/api/comment', require('./routes/comment'))


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port: ${PORT}`);
});