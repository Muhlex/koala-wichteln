import { Router } from 'express';
import passport from 'passport';
import SteamGroup from '../models/steamGroup.model.js';
import { updateSteamGroupData } from '../util.js';

const router = Router();

router.post('/create', passport.authenticate('jwt', { session: false }), async (req, res) => {
	const { id64 } = req.body;

	if (!id64 || await SteamGroup.findOne({ id64 })) {
		res.sendStatus(400);
		return;
	}

	const group = await new SteamGroup({ id64 }).save();
	await updateSteamGroupData(group);

	res.sendStatus(200);
});

export default router;
