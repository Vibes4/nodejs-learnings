// Run:  node express-specific/mongodb/index.js
// Needs:  npm install mongoose   AND a MongoDB running at MONGO_URL (default localhost).
// If mongoose isn't installed or no DB is reachable, this prints the patterns and exits cleanly.

let mongoose;
try { mongoose = require('mongoose'); }
catch {
  console.log('mongoose not installed. Run:  npm install mongoose');
  console.log('Below is the code you would run — read it as reference:\n');
  printReference();
  process.exit(0);
}

const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/learnings';

// 1) Schema = shape + validation + indexes
const userSchema = new mongoose.Schema({
  name:  { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  age:   { type: Number, min: 0, max: 150 },
  tags:  [String],
}, { timestamps: true });

userSchema.index({ name: 1, createdAt: -1 });   // compound index (ESR)

const orderSchema = new mongoose.Schema({
  user:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // reference
  total: Number,
});

const User = mongoose.model('User', userSchema);
const Order = mongoose.model('Order', orderSchema);

async function main() {
  await mongoose.connect(MONGO_URL, { serverSelectionTimeoutMS: 2000 });
  console.log('connected to', MONGO_URL);

  await User.deleteMany({}); await Order.deleteMany({});

  // CREATE
  const ada = await User.create({ name: 'Ada', email: 'ada@x.com', age: 36, tags: ['math'] });
  await Order.create({ user: ada._id, total: 99 });

  // READ + projection + lean (fast plain objects)
  const found = await User.findOne({ email: 'ada@x.com' }).select('name email').lean();
  console.log('found:', found);

  // populate (Mongoose "join" via reference)
  const orders = await Order.find().populate('user', 'name');
  console.log('orders w/ user:', JSON.stringify(orders));

  // aggregation pipeline
  const stats = await Order.aggregate([
    { $group: { _id: null, totalRevenue: { $sum: '$total' }, count: { $sum: 1 } } },
  ]);
  console.log('aggregate:', stats);

  // explain — see whether an index is used
  const plan = await User.find({ email: 'ada@x.com' }).explain('queryPlanner');
  console.log('winning plan stage:', plan.queryPlanner.winningPlan.inputStage?.stage || plan.queryPlanner.winningPlan.stage);

  await mongoose.disconnect();
  console.log('done.');
}

main().catch((e) => {
  console.log('Could not run live demo:', e.message);
  console.log('(Start MongoDB or set MONGO_URL.) Patterns above are still valid reference.');
  process.exit(0);
});

function printReference() {
  console.log("const s = new mongoose.Schema({ email: { type:String, unique:true, index:true }});");
  console.log("await User.find({ age: { $gt: 18 } }).sort('-createdAt').limit(10).lean();");
  console.log("await Order.aggregate([{ $match }, { $group }, { $lookup }]);");
}
