import mongoose from 'mongoose';

export default mongoose.model('User', new mongoose.Schema({
	steamId: String,
	name: String,
	avatar: String
}));
