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

  res.cookie("token", token);

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

  res.cookie("token", token);

  res.status(200).json({
    message: "user login successfully",
    user: {
      _id: user._id,
      email: user.email,
      fullName: user.fullName
    }
  });
}
// async function loginUser(req, res) {
//   const { email, password } = req.body;

//   const user = await userModel.findOne({ email });
//   if (!user) {
//     return res.status(400).json({
//       message: "wrong email",
//     });
//   }

//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) {
//     return res.status(400).json({
//       message: "password wrong",
//     });
//   }

//   const token = jwt.sign(
//     { id: user._id },
//     process.env.JWT_SECRETE,
//     { expiresIn: "7d" }
//   );

//   res.cookie("token", token, {
//     httpOnly: true,
//     sameSite: "lax",
//     secure: false
//   });

//   res.status(200).json({
//     success: true,
//     message: "user login successfully",
//     user: {
//       _id: user._id,
//       email: user.email,
//       name: user.name
//     }
//   });
// }

// async function loginUser(req, res) {
//   const { email, password } = req.body;

//   const user = await userModel.findOne({
//     email: email.toLowerCase().trim()
//   });

//   if (!user) {
//     return res.status(400).json({ message: "wrong email" });
//   }

//   const isMatch = await bcrypt.compare(
//     password.trim(),
//     user.password
//   );

//   if (!isMatch) {
//     return res.status(400).json({ message: "password wrong" });
//   }

//   const token = jwt.sign(
//     { id: user._id },
//     process.env.JWT_SECRETE,
//     { expiresIn: "7d" }
//   );

//   res.cookie("token", token, {
//     httpOnly: true,
//     sameSite: "lax",
//     secure: false
//   });

//   res.status(200).json({
//     success: true,
//     message: "login success"
//   });
// }



module.exports = { registerUser, loginUser };
