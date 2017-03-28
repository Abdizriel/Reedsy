const QueueRoutes = require('../api/queue');

const RoutesConfig = () => {
	const init = app => {
		const startTime = new Date();

		// Insert routes below
		app.use('/api/queue', QueueRoutes);

		app.route('/*')
			.get((req, res) => {
				const uptime = `${new Date() - startTime}ms`;
				res.status(200).json({ startTime, uptime });
			});
	};

	return { init };
};

module.exports = RoutesConfig;
