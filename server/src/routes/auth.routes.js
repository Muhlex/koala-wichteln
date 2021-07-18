import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = Router();

router.get('/steam', passport.authenticate('steam', { session: false }));

router.get('/steam/return', passport.authenticate('steam', { session: false }),
	(req, res) => {
		// Return JWT token for further REST API requests
		const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET_KEY, {
			expiresIn: '2d',
		});
		res.status(200).send(`
		<body>
			Authentication successful.
			<script>
				window.opener && window.opener.postMessage({ token: '${token}' }, '*');
				window.close();
			</script>
		</body>
		`);
	},
);

export default router;
