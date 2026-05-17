const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const User = require('./src/models/User');
const VenueCluster = require('./src/models/VenueCluster');
const Court = require('./src/models/Court');
const Booking = require('./src/models/Booking');

dotenv.config();

const clean = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB...');

    // 1. Delete all mock bookings
    const result = await Booking.deleteMany({ voucher_code: 'MOCKDATA' });
    console.log(`Deleted ${result.deletedCount} mock bookings.`);

    // 2. Recalculate commissions for all owners
    const owners = await User.find({ role: 'OWNER' });
    for (const owner of owners) {
      const clusters = await VenueCluster.find({ owner_id: owner._id });
      const clusterIds = clusters.map(c => c._id);
      const courts = await Court.find({ cluster_id: { $in: clusterIds } });
      const courtIds = courts.map(c => c._id);

      // Find all remaining non-mock bookings
      const bookings = await Booking.find({
        court_id: { $in: courtIds },
        payment_status: 'PAID',
        status: 'CONFIRMED'
      });

      let commissionDebt = 0;
      let commissionPaid = 0;

      for (const b of bookings) {
        const fee = b.platform_fee || 0;
        if (b.payment_method === 'CASH') {
          if (b.commission_status === 'UNPAID') {
            commissionDebt += fee;
          } else {
            commissionPaid += fee;
          }
        } else {
          commissionPaid += fee;
        }
      }

      await User.findByIdAndUpdate(owner._id, {
        commission_debt: commissionDebt,
        commission_paid: commissionPaid
      });
      console.log(`Updated owner ${owner.email}: debt = ${commissionDebt}, paid = ${commissionPaid}`);
    }

    console.log('Cleanup complete successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during cleanup:', error);
    process.exit(1);
  }
};

clean();
