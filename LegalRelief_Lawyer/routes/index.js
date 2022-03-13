const { Router } = require('express');
const router = Router();

const lawyers = require('./lawyers.js');
const active_cases = require('./active_cases.js');
const accepted_cases = require('./accepted_cases.js');

const cors = require('cors')
router.use(cors())

router.use('/lawyers', lawyers);
router.use('/active', active_cases);
router.use('/accepted', accepted_cases);

module.exports = router;
