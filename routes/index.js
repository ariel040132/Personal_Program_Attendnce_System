const express = require("express");
const router = express.Router();
const recordController = require('../controllers/record-controller')
const admin = require('../routes/modules/admin')
// const { authenticator } = require("../middleware/auth");

router.use('/admin', admin)

router.post('/punchin', recordController.punchIn)
router.put('/punchout', recordController.punchOut)
router.get('/', recordController.getHomePage)

module.exports = router;