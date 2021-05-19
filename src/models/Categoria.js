import {Schema, model} from 'mongoose'

const CategoriaSchema = new Schema({
    categoria: String,
    estado:{type:Number, default:1}
}, {
    versionKey:false
})

export default model('Categoria', CategoriaSchema);