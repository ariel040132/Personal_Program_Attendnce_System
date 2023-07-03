const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
const { authenticated } = require('../../middleware/auth')
const { authenticatedAdmin } = require('../../middleware/auth')

router.patch('/attendances/:id', authenticatedAdmin, adminController.patchRecords)
router.get('/allrecords', authenticatedAdmin, adminController.allRecords)

module.exports = router


