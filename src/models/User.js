import {Schema, model} from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new Schema({
    username:{type:String,required:true,maxlength:50,unique:true},
    email:{type:String, maxlength:70,unique:true},
    password:{type:String,required:true},
    roles:[{
        type: Schema.Types.ObjectId,
        ref: "Role", 
    }],
    estado:{type:Number, default:1},
}, {
    timestamps: true,
    versionKey: false
});

userSchema.statics.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

userSchema.statics.comparePassword  = async (password,receivedPassword)=>{
    return await bcrypt.compare(password, receivedPassword)
}

export default model('User',userSchema);