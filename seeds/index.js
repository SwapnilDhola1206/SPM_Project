const mongoose = require('mongoose');
const cities = require('./cities_india');
const { places, descriptors } = require('./seedHelpers');
const MeditationCenter = require('../models/meditationCenter');

mongoose.connect('mongodb://localhost:27017/Meditation', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await MeditationCenter.deleteMany({});
    for (let i = 0; i < 10; i++) {
        const random1000 = Math.floor(Math.random() * 405);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new MeditationCenter({
            //YOUR USER ID
            author: '618941205561fb024c6aa91c',
            location: `${cities[random1000].admin_name}, ${cities[random1000].city}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].lng,
                    cities[random1000].lat,
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/sjdhola/image/upload/v1637211302/Meditation_Centers/jlrxlp59fseoq0f89sox.jpg',
                    filename: 'Meditation_Centers/jlrxlp59fseoq0f89sox.jpg'
                },
                {
                    url: 'https://res.cloudinary.com/sjdhola/image/upload/v1637211303/Meditation_Centers/xphxcmxrvo5hrtgk0vy9.jpg',
                    filename: 'Meditation_Centers/xphxcmxrvo5hrtgk0vy9.jpg'
                },
                {
                    url: 'https://res.cloudinary.com/sjdhola/image/upload/v1637211302/Meditation_Centers/qxcp59eiblxlpmoyyd3s.jpg',
                    filename: 'Meditation_Centers/qxcp59eiblxlpmoyyd3s.jpg'
                },
                {
                    url: 'https://res.cloudinary.com/sjdhola/image/upload/v1637211302/Meditation_Centers/i0njh1bpedmuvkm6lifw.jpg',
                    filename: 'Meditation_Centers/i0njh1bpedmuvkm6lifw.jpg'
                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})