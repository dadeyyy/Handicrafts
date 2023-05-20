const Handicraft = require('../models/handicraft');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
  const handicrafts = await Handicraft.find({});
  res.render('handicrafts/index', { handicrafts });
};

module.exports.renderNewForm = (req, res) => {
  res.render('handicrafts/new');
};

module.exports.createStore = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query:req.body.handicraft.location,
        limit: 1
    }).send()

  const handicraft = new Handicraft(req.body.handicraft);
  handicraft.geometry = geoData.body.features[0].geometry

  handicraft.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));

  handicraft.author = req.user._id;
  await handicraft.save();

  req.flash('success', 'Successfully made a new handicraft store!');

  res.redirect(`/handicrafts/${handicraft._id}`);
};

module.exports.showStore = async (req, res) => {
  const id = req.params.id;
  const handicraft = await Handicraft.findById(id)
    .populate({
      path: 'reviews',
      populate: {
        path: 'author',
      },
    })
    .populate('author');

  if (!handicraft) {
    req.flash('error', 'Cannot find');
    return res.redirect('/handicrafts');
  }
  res.render('handicrafts/show', { handicraft });
};

module.exports.editForm = async (req, res) => {
  const id = req.params.id;
  const handicraft = await Handicraft.findById(id);

  if (!handicraft) {
    req.flash('error', 'Cannot find!!');
    return res.redirect('/handicrafts');
  }

  res.render('handicrafts/edit', { handicraft });
};

module.exports.editStore = async (req, res) => {
  const { id } = req.params;
  const handicraft = await Handicraft.findByIdAndUpdate(id, {
    ...req.body.handicraft,
  });
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  handicraft.images.push(...imgs);
  await handicraft.save();
  req.flash('success', 'Successfully updated handicraft');
  res.redirect(`/handicrafts/${handicraft._id}`);
};

module.exports.deleteStore = async (req, res) => {
  const { id } = req.params;
  await Handicraft.findByIdAndDelete(id);
  req.flash('success', 'Successfully Deleted');
  res.redirect('/handicrafts');
};

module.exports.searchStore = async (req, res) => {
  const value = req.query.val;
  const data = await Handicraft.findOne({
    $or: [{ title: { $regex: value } }, { location: { $regex: value } }],
  });

  res.render('search', { data });
}
