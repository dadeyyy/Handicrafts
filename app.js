if (process.env.NODE_env !== 'production') {
  require('dotenv').config();
}


const express = require('express');
const app = express();
const PORT = 3000;
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./helpers/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const handicraftRoutes = require('./routes/handicrafts');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Handicraft = require('./models/handicraft')
const mongoSanitize = require('express-mongo-sanitize');

mongoose.set('strictQuery', true);
async function main() {
  await mongoose.connect('mongodb://localhost:27017/geolocation');
  console.log('CONNECTION OPEN');
}

main().catch((err) => console.log(err));



const sessionConfig = {
  name: 'session',
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
app.use(mongoSanitize())


passport.use(new LocalStrategy(User.authenticate()));
// passport.use(new GoogleStrategy({
//   clientID: process.env.CLIENT_ID,
//   clientSecret:process.env.CLIENT_SECRET,
//   callbackURL:'http://localhost:3000/handicrafts',
//   scope: ['profile', 'email']
// },
// (accessToken, refreshToken, profile, done) =>{

// }
// ))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  console.log(req.query);
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/handicrafts', handicraftRoutes);
app.use('/handicrafts/:id/reviews', reviewRoutes);
app.use('/', userRoutes);
app.use('/', adminRoutes);

// app.get('/display',async (req,res)=>{
//   const handicraft = await Handicraft.find({});
//   for(let i = 0 ; i< handicraft.length; i ++){
//     handicraft[i].isValidated = false;
//     await handicraft[i].save();
//   }
//   res.redirect('/')
// })



app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Something went wrong';
  res.status(statusCode).render('error', { err });
});

app.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
});
