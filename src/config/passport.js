import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

import User from "../models/User"

passport.use(
    new LocalStrategy(
 {
    usernameField: 'email',
},
    async (email, password, done)=>{
    console.log("primera entrada");
    const user = await User.findOne({email: email}).find();
    console.log("encontramos al user", user);
    if(!user){
        return done(null, false, {message: 'Usuario No Encontrado'});
    }else{
      const match = await user.comparePassword(password);
      console.log("asdasdasdasdas", match)
        if(match){
            return done (null, user);
        } else{
            return done(null,false, {message: 'Contraseña Incorrecta'});
        }
    }
    return;
}));

passport.serializeUser((user,done)=>{
    done(null, user.id);
});

passport.deserializeUser((id, done)=>{
    User.findById(id,(err,user)=>{
        done(err,user);
    });
});
