const path = require('path');
// const mbd = require('mdbootstrap');
// const jquery = require('jquery');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mySQLStore = require('express-mysql-session')(session);
const flash = require('connect-flash');
const multer = require('multer');
const uniqid = require('uniqid');
const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyBCvv9q-ZdyaCTDx1BTXbs3qpMFX6HWr30',
    Promise: Promise
});

//   googleMapsClient.geocode({address: '1600 Amphitheatre Parkway, Mountain View, CA'}).asPromise()
//   .then((response) => {
//     console.log(response.json.results);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
const adminRoutes = require('./routes/admin');
const mainData = require('./routes/main');
const errorCon = require('./controllers/error');
const db = require('./util/database');
const auth = require('./routes/auth');
const app = express();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        cb(null, uniqid.time() + '-' + file.originalname)
    }
});
const fileFilter = (req, file, cb) => {
    if(
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/png' || 
        file.mimetype === 'image/jpeg'
    ) {
        cb(null ,true);
    } else {
        cb(null ,false);
    }

}
const option = {
    host: 'localhost',
    user: 'root',
    database: 'fyProject',
    password: 'Allahisgreat'
};
const sessionStore = new mySQLStore(option);

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('profilePicture'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(session({
    secret: 'my secret key',
    resave: false, 
    saveUninitialized: false, 
    store: sessionStore 
}));
app.use(flash());

app.use('/admin', adminRoutes);
app.use(mainData.routes);
app.use(auth);


app.use(errorCon.get404);

app.listen(3000);