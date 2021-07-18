import steam from './config/steamapi.config.js';
import fetch from 'node-fetch';
import xml from 'fast-xml-parser';

export const updateSteamUserData = async user => {
	const userSteamData = await steam.getUserSummary(user.steamId);
	user.name = userSteamData.nickname;
	user.avatar = userSteamData.avatar.small;
	user.save();
};

export const updateSteamGroupData = async group => {
	// Need to use the deprecated XML API because Web APIs don't support group data ("yet")
	const groupDataXml = await fetch(`https://steamcommunity.com/gid/${group.id64}/memberslistxml/?xml=1`);
	const groupDataJson = xml.parse(await groupDataXml.text());
	const { groupDetails } = groupDataJson.memberList;

	group.name = groupDetails.groupName;
	group.avatar = groupDetails.avatarIcon;
	group.save();
};

export const validateUserEntryRequirements = async (user, requirements) => {
	if (!requirements || !requirements.length) return true;

	let userSteamGroups;
	try {
		// Fetch user's steam groups by their groupID64 (API returns group index)
		userSteamGroups = (await steam.getUserGroups(user.steamId))
			.map(id => String(BigInt(id) + 103582791429521408n));
	} catch (err) {
		throw new Error(`Could not fetch Steam groups for user ${user.steamId}`);
	}

	return requirements.some(({ steamGroups }) => {
		return !steamGroups || !steamGroups.length
			|| steamGroups.every(({ id64 }) => userSteamGroups.includes(id64));
	});
};
