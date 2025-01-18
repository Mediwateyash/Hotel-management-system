const mongoose = require('mongoose')
mongoose.connect("mongodb://localhost:27017/hotel")

const hotel = mongoose.model("hotel",{
hotel_name:{
    type:String
},
price:{
    type:Number
},
types:{
    type:String
},
description:{
    type:String
},
image:{
    type:String
}
})


module.exports = hotel