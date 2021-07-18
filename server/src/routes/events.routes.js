import { Router } from 'express';
import passport from 'passport';
import Event from '../models/event.model.js';
import { validateUserEntryRequirements } from '../util.js'

const router = Router();

router.get('/current', async (req, res) => {
	const event = await Event
		.findOne({ 'dates.end': { $gt: Date.now() } })
		.select('-participants.matchedUser -participants.gift')
		.populate('participants.user entryRequirements.steamGroups')

	const { participants } = event;
	participants.sort((a, b) => a.user.name.localeCompare(b.user.name));

	res.status(200).send(event);
});

router.patch('/current/participate',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		const event = await Event
			.findOne({ 'dates.start': { $lt: Date.now() }, 'dates.match': { $gt: Date.now() } })
			.populate('entryRequirements.steamGroups');

		if (!event) {
			res.sendStatus(403);
			return;
		}

		const { participants, entryRequirements } = event;

		const userParticipantIndex = participants.findIndex(({ user }) => {
			return user.toString() === req.user._id.toString()
		});

		if (userParticipantIndex > -1) {
			participants.splice(userParticipantIndex, 1);
		} else {
			console.log(await validateUserEntryRequirements(req.user, entryRequirements));
			// if (entryRequirements && entryRequirements.length) {
			// 	// let userSteamGroups;
			// 	try {
			// 		// userSteamGroups = await steam.getUserGroups(req.user.steamId);
			// 	} catch (err) {
			// 		console.error(err);
			// 		res.status(503).send({ error: `Could not fetch Steam groups for user ${req.user.steamId}` });
			// 		return;
			// 	}

			// 	const requirementsMet = entryRequirements.some(({ steamGroups }) => {
			// 		return !steamGroups || !steamGroups.length
			// 			|| steamGroups.every(steamGroup => userSteamGroups.includes(steamGroup));
			// 	});

			// 	if (!requirementsMet) {
			// 		res.send(401).send({ error: 'Entry requirements not met.' });
			// 		return;
			// 	}
			// }
			participants.push({ user: req.user._id });
		}

		event.save();
		res.sendStatus(200);
	}
);

// router.get('/generate-event', /*passport.authenticate('jwt', { session: false }),*/(req, res) => {
// 	new Event({
// 		title: 'Testevent 2021',
// 		dates: {
// 			start: new Date('2021-11-10T00:00:00'),
// 			deadline: new Date('2021-12-15T00:00:00'),
// 			end: new Date('2021-12-24T00:00:00')
// 		},
// 		participants: [
// 			{ user: new mongoose.Types.ObjectId('60eb72eccaa29511a48f7eb9') },
// 			{ user: new mongoose.Types.ObjectId('60edfd44996526c9976ea64a') }
// 		]
// 	}).save();
// 	res.status(200).send({ digga: 'geil' });
// });

export default router;
