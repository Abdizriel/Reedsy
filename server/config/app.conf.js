'use strict';

const path = require('path');
const logger = require('logfmt');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const contentLength = require('express-content-length-validator');
const helmet = require('helmet');
const express = require('express');
const kue = require('kue');

/**
 * @function ApplicationConfig
 * @description Application configuration
 * @constructor
 * @returns {Object}
 */
const ApplicationConfig = () => {
	/**
	 * @function init
	 * @description Init application configuration
	 * @param {Object} app - Express application
	 */
	const init = app => {
		const _root = process.cwd();
		const _nodeModules = '/node_modules/';

		app.use(express.static(path.join(_root, '.tmp')));
		app.use(express.static(_root + _nodeModules));
		app.set('appPath', path.join(_root, 'client'));
		app.use(express.static(app.get('appPath')));
		app.use(bodyParser.json());
		app.use(morgan('dev'));
		app.use(contentLength.validateMax({ max: 999 }));
		app.use(helmet());
		app.use('/api', kue.app);

		logger.log({ type: 'info', msg: 'configured', service: 'application' });
	};

	return { init };
};

module.exports = ApplicationConfig;
