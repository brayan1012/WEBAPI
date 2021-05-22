import {Schema, model} from 'mongoose';
const VentaSchema = new Schema({
    Usuario:{type:String,required:true},
    Cliente:{type:String},
    TComprobante:{type:String,default:"RECIBO"},
    SComprobante:{type:String},
    NComprobante:{type:Number},
    Impuesto:{type:String, default:"0.19"},
    Total:{type:Number},
    Detalles:[{
        _id: {type:Schema.Types.ObjectId, ref: 'Product'},
        name:{type:String},
        cantidad:{type:Number},
        price:{type:Number}
    }],
    estado:{type:Number, default:1},
}, {
    timestamps: true,
    versionKey: false
});
export default model('Ventas', VentaSchema);