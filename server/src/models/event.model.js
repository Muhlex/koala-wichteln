import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

export default mongoose.model('Event', new mongoose.Schema({
	title: String,
	dates: {
		start: Date,
		match: Date,
		deadline: Date,
		end: Date
	},
	// Participants need to fulfill ALL requirements of ANY of the array's entries
	entryRequirements: [{
		steamGroups: [{ type: ObjectId, ref: 'SteamGroup' }],
	}],
	participants: [{
		user: { type: ObjectId, ref: 'User' },
		matchedUser: ObjectId,
		gift: String
	}]
}));
