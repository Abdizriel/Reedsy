'use strict';

const logger = require('logfmt');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const contentLength = require('express-content-length-validator');
const helmet = require('helmet');
const express = require('express');
const kue = require('kue');

const ApplicationConfig = () => {
	const init = app => {
		const _root = process.cwd();
		const _nodeModules = '/node_modules/';

		app.use(express.static(_root + _nodeModules));
		app.use(bodyParser.json());
		app.use(morgan('dev'));
		app.use(contentLength.validateMax({ max: 999 }));
		app.use(helmet());
		app.use(kue.app);

		logger.log({ type: 'info', msg: 'configured', service: 'application' });
	};

	return { init };
};

module.exports = ApplicationConfig;
