import mongoose from 'mongoose';

const schema = new mongoose.Schema({
	id64: String,
	name: String,
	avatar: String
})

export default mongoose.model('SteamGroup', schema);
