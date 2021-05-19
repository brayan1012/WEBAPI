import { ROLES } from "../models/Role";
import User from "../models/User";
const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  
  try {
    const email = await User.findOne({ email: req.body.email });
    if (email){
      req.flash("error_msg", "El email ya esta registrado");res.redirect('/users/signup');
    }else{
      next();
    }  
  } catch (error) {
    res.status(500).json({ message: error });
  }
};



const checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.lengh; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        return res.status(400).json({
          message: `Role ${req.body.roles[i]} no existe`,
        });
      }
    }
  }
  next();
};

export { checkDuplicateUsernameOrEmail, checkRolesExisted };
