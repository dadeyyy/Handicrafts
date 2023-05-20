if (process.env.NODE_env !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const app = express();
const PORT = 3000;
const ejs = require('ejs');
const path = require('path');
const catchAsync = require('./helpers/catchAsync');
const mongoose = require('mongoose');
var methodOverride = require('method-override');
const Handicraft = require('./models/handicraft');
const ejsMate = require('ejs-mate');
const ExpressError = require('./helpers/ExpressError');
const Joi = require('joi');
const { handicraftSchema, reviewSchema } = require('./schemas.js');
const Review = require('./models/review');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const sessionConfig = {
  secret: 'thisshouldbeabettersecret!',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.get('/fakeUser', async (req, res) => {
  const user = new User({ email: 'andrei@gmail.com', username: ' dadey' });
  const newUser = await User.register(user, 'dog');
  res.send(newUser);
});

const handicraftRoutes = require('./routes/handicrafts');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

const validateHandicraft = (req, res, next) => {
  const { error } = handicraftSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

mongoose.set('strictQuery', true);
async function main() {
  await mongoose.connect('mongodb://localhost:27017/geolocation');
  console.log('CONNECTION OPEN');
}

main().catch((err) => console.log(err));

app.put('/handicrafts/:id/reviews/:author', async (req, res) => {
  const { author, id } = req.params;
  const newReview = await Review.findByIdAndUpdate(author, {
    ...req.body.review,
  });
  await newReview.save();
  req.flash('success', 'Successfully updated review');
  res.redirect(`/handicrafts/${id}`);
});

app.use('/handicrafts', handicraftRoutes);
app.use('/handicrafts/:id/reviews', reviewRoutes);
app.use('/', userRoutes);

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/search', async (req, res) => {
  const value = req.query.val;
  const data = await Handicraft.findOne({
    $or: [{ title: { $regex: value } }, { location: { $regex: value } }],
  });

  res.render('search', { data });
});

app.get('/hahahahahha',(req,res)=>{
  res.send("HAHAHAHAHAHAHAHHAHAHAHAH siraulo")
})
app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh no! Something went wrong';
  res.status(statusCode).render('error', { err });
});

app.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
});
