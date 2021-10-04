const express        = require('express'),
      app            = express();
      session        = require('express-session'),
      bodyParser     = require('body-parser'),
      mongoose       = require('mongoose'),
      passport       = require('passport'),
      MongoStore     = require('connect-mongo'),
      dotenv         = require('dotenv').config(),
      morgan         = require('morgan'),
      cors           = require('cors'),

      postsRouter    = require('./route/posts'),
      usersRouter    = require('./route/users'),
      tagsRouter     = require('./route/tags'),
      commentsRouter = require('./route/comments'),

      localStrategy  = require('./passport/localStrategy');

(async function connect(){
    try{
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log("Successfully connected to MongoDB");
    } catch(e){
        console.log("Unable to connect to MongoDB");
        console.log(e);
        process.exit();
    }
})();

if(process.env.NODE_ENV === 'DEV'){
    console.log("Using CORS")
    app.use(cors())
}

passport.use(localStrategy.strat);
passport.serializeUser(localStrategy.serialize);
passport.deserializeUser(localStrategy.deserialize);

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('common'));

app.use((req, res, next) => {
    if(req.query){
        Object.entries(req.query).forEach((key,value) => {
            if(key.includes("_id")){
                try{
                    req.query[key] = mongoose.Types.ObjectId(value)
                } catch {
                    const msg = `Malformed query parameter ${key}: ${value}`;
                    console.log(msg);
                    return res.status(400).send(msg);
                }
            }
        })
    }
    next();
})
app.use(express.static("public"));
app.use(session({ 
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_DB_URI
    })
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/comments', commentsRouter);
app.use('/posts',    postsRouter);
app.use('/users',    usersRouter);
app.use('/tags',     tagsRouter);


app.post('/login', passport.authenticate('local', { 
    successRedirect: '/me',
    failureRedirect: '/logout'
}));

app.get('/me', (req, res) => {
    if(req.isAuthenticated()){
        //safe to send and only used for UI purposes. 
        res.send({
            isLoggedIn: true,
            name: req.user.name,
            _id: req.user._id,
            role: req.user.role
        });
    } else {
        res.send({isLoggedIn: false});
    }
})

app.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/me');
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
})

app.get('*', (req, res) => {
    res.redirect('/');
})

app.listen(process.env.PORT, () => {
    console.log(`App listening on port ${process.env.PORT}`)
});
