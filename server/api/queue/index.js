'use strict';

const { Router } = require('express');
const QueueController = require('./queue.controller');

const router = new Router();

router.post('/', QueueController.create);

module.exports = router;
