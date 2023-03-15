import express from 'express';
const app = express();
const router = express.Router();
app.use('/', router);

import shifts from './routes/shifts.js';
import jobs from './routes/jobs.js';

router.use('/shifts', shifts);
router.use('/jobs', jobs);

app.use((err, req, res, next) => {
	console.log(err.stack);
	res.status(500).send('Something broke!');
});

app.listen(3000, () => console.log('Server running'));
