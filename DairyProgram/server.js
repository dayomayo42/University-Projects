// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error(err));

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
});

const TravelSchema = new mongoose.Schema({
    userId: String,
    location: String,
    image: String,
    cost: Number,
    culturalSites: [String],
    placesToVisit: [String],
    convenienceRating: Number,
});

const User = mongoose.model('User', UserSchema);
const Travel = mongoose.model('Travel', TravelSchema);

// Routes
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).send(user);
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ token });
    } else {
        res.status(401).send('Invalid credentials');
    }
});


app.post('/travels', async (req, res) => {
    const { location, image, cost, culturalSites, placesToVisit, convenienceRating, coordinates } = req.body;
    const travel = new Travel({ 
        userId: req.user.id, // предполагается, что пользователь аутентифицирован
        location,
        image,
        cost,
        culturalSites,
        placesToVisit,
        convenienceRating,
        coordinates
    });
    await travel.save();
    res.status(201).send(travel);
});

app.get('/travels', async (req, res) => {
    const travels = await Travel.find().populate('userId', 'username');
    res.json(travels);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(Server is running on port ${PORT});
});
