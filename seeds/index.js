const mongoose = require('mongoose');
const Handicraft = require('../models/handicraft');
const cities = require('./cities')
const axios = require('axios')
const {title} = require('./title')
const {product1, product2, product3} = require('./products')
const {description} = require('./description');

mongoose.set('strictQuery', true)
async function main() {
    await mongoose.connect('mongodb://localhost:27017/geolocation');
    console.log("CONNECTION OPEN")
}

main().catch(err => console.log(err));



async function seedImg() {
    try {
      const resp = await axios.get('https://api.unsplash.com/photos/random', {
        params: {
          client_id: 'iL2YsnTVWMKQesFHpXNBbc92rlO_KG2xiekxDY8GTI4',
          collections: 1114848,
        },
      })
      return resp.data.urls.small
    } catch (err) {
      console.error(err)
    }
  }


const seedDb = async () =>{
    await Handicraft.deleteMany({});
    // for(let i = 0 ; i < 20 ; i++){
    //     const random1000 = Math.floor(Math.random() * 1000);
    //     const random20 = Math.floor(Math.random() * 19);
    //     const random12 = Math.floor(Math.random() * 12)
    //     const handi = new Handicraft({
    //         author: '63cf45855dbb976824d73d58',
    //         location: `${cities[random12]}`,
    //         title: `${title[random20]}`,
    //         description: `${description[random20]}`,
    //         geometry: {
    //           type: "Point",
    //           coordinates: [ 120.540969 , 14.679567 ]
    //         },
    //         products: `${product1[random20]} , ${product2[random20]}, ${product3[random20]}`,
    //         images: [
    //           {
    //             url: 'https://res.cloudinary.com/dmpip4nzo/image/upload/v1674974798/Handicrafts/g2ed916i7cu8qqbi2xr6.jpg',
    //             filename: 'Handicrafts/g2ed916i7cu8qqbi2xr6'              }
    //         ]
    //     })
    //     await handi.save();
    // }
}

seedDb()



