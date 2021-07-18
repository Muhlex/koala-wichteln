import passport from 'passport';
import { Strategy as SteamStrategy } from 'passport-steam';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/user.model.js';
import { updateSteamUserData } from '../util.js';

export default () => {
	// Use Steam to create/retrieve user data
	passport.use(new SteamStrategy({
		returnURL: `${process.env.BASE_URL}/auth/steam/return`,
		realm: `${process.env.BASE_URL}/`,
		apiKey: process.env.STEAM_API_KEY
	}, async (identifier, profile, done) => {
		let user = await User.findOne({ steamId: profile.id });

		if (user) {
			await updateSteamUserData(user);
		} else {
			user = await new User({
				steamId: profile.id,
				name: profile._json.personaname,
				avatar: profile._json.avatar,
			}).save();
		}

		return done(null, user);
	}));

	// Use JWT to authorize further REST API requests
	passport.use(new JWTStrategy({
		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		secretOrKey: process.env.JWT_SECRET_KEY
	}, async ({ id }, done) => {
		try {
			const user = await User.findById(id);
			done(null, user);
		} catch (err) {
			done(err);
		}
	}));
}
