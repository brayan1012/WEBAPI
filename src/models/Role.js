import {Schema, model} from 'mongoose'
export const ROLES = ["Cliente", "Administrador","Vendedor"]
const roleSchema = new Schema(
    {
    name: String,
    
    },
    {
        versionKey: false,
    }
);

export default model("Role", roleSchema);