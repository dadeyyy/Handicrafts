const Handicraft = require('../models/handicraft');

module.exports.viewPendingHandicrafts = async (req,res) =>{
    const pendingHandicrafts = await Handicraft.find({isValidated: false});

    res.render('admin/pendingHandicrafts',{handicraft: pendingHandicrafts});
}

module.exports.validateHandicraft = async (req,res) =>{
    const {id} = req.params;
    const handicraft = await Handicraft.findById(id);

    if (!handicraft) {
        req.flash('error', 'Handicraft not found');
        return res.redirect('/admin/pendingHandicrafts');
      }
    
      handicraft.isValidated = true;
      
      await handicraft.save();
    
      req.flash('success', 'Handicraft store validated successfully');
      res.redirect('/handicrafts');
}

module.exports.cancelHandicraft = async (req,res) =>{
    const {id} = req.params;
    const handicraft = await Handicraft.findById(id);

    if (!handicraft) {
        req.flash('error', 'Handicraft not found');
        return res.redirect('/admin/pendingHandicrafts');
      }

    await handicraft.remove();

    req.flash('success', 'Handicraft store canceled successfully');
    res.redirect('/handicrafts');
}