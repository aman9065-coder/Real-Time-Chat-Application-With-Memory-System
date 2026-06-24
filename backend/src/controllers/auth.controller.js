const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

async function registerUser(req, res) {
  const {
    fullName: { firstName, lastName },
    email,
    password,
  } = req.body;

  const isUserAlreadyExist = await userModel.findOne({
    email,
  });

  if (isUserAlreadyExist) {
    return res.status(400).json({
      message: "user already exist",
    });
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const user = await userModel.create({
    fullName: {
      firstName,
      lastName,
    },
    email,
    password: hashPassword,
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRETE);

  // res.cookie("token", token);

  // deploy

  res.cookie("token", token, {
        httpOnly: true,
        secure: true,        // HTTPS required (Render pe true hoga)
        sameSite: "none"     // frontend-backend different domain ho to required
    });

  res.status(201).json({
    message: "user register successfully",
    user,
  });
}

async function loginUser(req, res) {
  const { email, password } = req.body;
  // console.log(email,password)

  const user = await userModel.findOne({
    email,
  });
  // console.log(user)
  if (!user) {
    return res.status(400).json({
      message: "wrong email",
    });
  }

  const bol = await bcrypt.compare(password, user.password);
  // console.log(bol)
  if (!bol) {
    return res.status(400).json({
      message: "password wrong",
    });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRETE);

  // res.cookie("token", token);

  res.cookie("token", token, {
        httpOnly: true,
        secure: true,        // HTTPS required (Render pe true hoga)
        sameSite: "none"     // frontend-backend different domain ho to required
    });

  res.status(200).json({
    message: "user login successfully",
    user: {
      _id: user._id,
      email: user.email,
      fullName: user.fullName
    }
  });
}



async function logoutUser(req, res) {
  // Clear the token cookie set on login/register
  // res.clearCookie('token');

  // deploy

  res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    });
    
  return res.status(200).json({ message: 'Logout successful' });
}

async function meUser(req, res) {
  // authUser middleware attaches user to req
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  const { _id, email, fullName } = req.user;
  return res.status(200).json({ user: { _id, email, fullName } });
}

module.exports = { registerUser, loginUser, logoutUser, meUser }; 
