const express = require('express');
const router = express.Router();
const catchAsync = require('../helpers/catchAsync');
const Handicraft = require('../models/handicraft');
const User = require('../models/user')
const { isLoggedIn, isAdmin } = require('../middleware');
const admin = require('../controllers/admin');

router.get('/handicrafts/admin/pending', isLoggedIn, isAdmin, catchAsync(admin.viewPendingHandicrafts));
router.post('/handicrafts/:id/validate', isLoggedIn, isAdmin, catchAsync(admin.validateHandicraft));
router.post('/handicrafts/:id/cancel', isLoggedIn, isAdmin, catchAsync(admin.cancelHandicraft));


router.get('/handicrafts/admin/users', isLoggedIn, isAdmin, catchAsync(admin.showUser))

router.delete('/handicrafts/admin/users/:id', isLoggedIn, isAdmin, async (req,res)=>{
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
          return res.status(404).json({ error: 'User not found' });
        }
        req.flash('success', 'User was successfully deleted!');
        res.status(200).json({ message: 'User deletion successful' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
      }
})

module.exports = router;