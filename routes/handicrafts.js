const express = require('express');
const router = express.Router();
const catchAsync = require('../helpers/catchAsync')
const Handicraft = require('../models/handicraft');
const {isLoggedIn, isAuthor, validateHandicraft, checkStoreOwnerRole } = require('../middleware');
const handicrafts = require('../controllers/handicrafts');
const multer  = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage});



router.route('/')
    .get(catchAsync(handicrafts.index))
    .post(isLoggedIn, checkStoreOwnerRole, upload.array('image'), validateHandicraft , catchAsync(handicrafts.createStore))
    // .post(upload.array('image'), (req,res)=>{
    //     console.log(req.body, req.files);
    //     res.send('IT WORKED!')
    // })


router.get('/new',isLoggedIn, checkStoreOwnerRole, handicrafts.renderNewForm);
router.get('/search',catchAsync(handicrafts.searchStore));

router.route('/:id')
    .get(catchAsync(handicrafts.showStore))
    .put(isLoggedIn, checkStoreOwnerRole, isAuthor,upload.array('image'), validateHandicraft, catchAsync(handicrafts.editStore))
    .delete(isLoggedIn, checkStoreOwnerRole, catchAsync(handicrafts.deleteStore))



router.get('/:id/edit' , isLoggedIn , isAuthor , catchAsync(handicrafts.editForm))


module.exports = router