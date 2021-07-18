import './config/dotenv.config.js';
import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import initPassport from './config/passport.config.js';
import initCronJobs from './config/cronjobs.config.js'
import auth from './routes/auth.routes.js';
import events from './routes/events.routes.js';
import steamGroups from './routes/steamGroups.routes.js';

const app = express();

app.use(express.json());

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

initPassport();
app.use(passport.initialize());

app.use('/auth', auth);
app.use('/events', events);
app.use('/steam-groups', steamGroups);

if (process.env.MONGO_URL) {
	mongoose
		.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
		.then(() => {
			console.log('🗄️ Connected to MongoDB');
			app.listen(process.env.PORT, () => console.log(`✔️ Server live at ${process.env.BASE_URL}`));
			initCronJobs();
		})
		.catch(error => console.error('❌ MongoDB connection error:', error));
} else {
	console.error('❌ No MongoDB URL specified');
}
