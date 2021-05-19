import {Schema, model} from 'mongoose'

const productSchema = new Schema({
    name: String, 
    category: String,
    price: Number,
    imgURL: String,
    cantidad: Number,
    usuario: String,
    email: String
}, {
    timestamps:true,
    versionKey:false
})

export default model('Product', productSchema);