const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDBに接続しました。'))
.catch(err => console.error('MongoDB接続エラー:', err));