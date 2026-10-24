// const mongoose = require('mongoose');
// module.exports = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log('MongoDB connected');
//   } catch (e) {
//     console.error('MongoDB connection failed:', e.message);
//     process.exit(1);
//   }
// };



const mongoose = require('mongoose');
const dns = require('dns');

// Some networks block SRV lookups; use public DNS for Node's resolver
dns.setServers(['8.8.8.8', '1.1.1.1']);

module.exports = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 15000 });
    console.log('MongoDB connected');
  } catch (e) {
    console.error('MongoDB connection failed:', e.message);
    process.exit(1);
  }
};