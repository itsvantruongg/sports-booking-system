const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

const fixOwnerPhone = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    const ownerId = '69ff59a36439796a2774e566';
    const result = await User.findByIdAndUpdate(ownerId, { phone: '0397263588' }, { new: true });

    if (result) {
      console.log(`Success! Updated Owner ${result.name} with phone ${result.phone}`);
    } else {
      console.log('Owner not found');
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixOwnerPhone();
