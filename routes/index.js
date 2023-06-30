const express = require("express");
const router = express.Router();
const recordController = require('../controllers/record-controller')
const userController = require('../controllers/user-controller')

const admin = require('../routes/modules/admin')
// const { authenticator } = require("../middleware/auth");

router.use('/admin', admin)

router.post('/punchin', recordController.punchIn)
router.put('/punchout', recordController.punchOut)
router.get('/login', userController.logIn)
router.get('/punchout', recordController.getHome2Page)
router.get('/punchin', recordController.getHomePage)

module.exports = router;