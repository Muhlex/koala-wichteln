import User from '../models/user.model.js';
import SteamGroup from '../models/steamGroup.model.js';
import { updateSteamUserData, updateSteamGroupData } from '../util.js';

const updateCacheData = async () => {
	// TODO: Reduce Steam API calls here (only retrieve data of semi-active events?)
	const users = await User.find({});
	users.forEach(user => updateSteamUserData(user));

	const groups = await SteamGroup.find({});
	groups.forEach(group => updateSteamGroupData(group));
};

export default () => {
	updateCacheData();
	setInterval(() => {
		updateCacheData();
	}, 4 * 60 * 60 * 1000);
};
