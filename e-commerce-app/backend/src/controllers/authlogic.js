const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const PEPPER = "mysecretpepper";
const SALT_ROUNDS = 10;

// const register = (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     const existingUser = User.find({ email });
//     if (existingUser) {
//       return res.status(400).json({ msg: "User already exists" });
//     }

//     const hashedPassword = bcrypt.hashSync(password + PEPPER, SALT_ROUNDS);

//     const newuser={
//       name,
//       email,
//       password: hashedPassword
//     }

//     user.push(newuser);

//     res.status(201).json({msg: "User registered successfully",newuser });

//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };

// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = User.find((user) => user.email ==req.body.email);
//     if (!user) {
//       return res.status(404).json({ msg: "User not found" });
//     }

//     const isMatch = bcrypt.compareSync(password + PEPPER, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ msg: "Invalid email or password" });
//     }

//     const token = jwt.sign( { id: user._id, role: user.role },process.env.JWT_SECRET, { expiresIn: "1d" });

//     res.json({msg: "Login successful",token });

//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };

// module.exports = { register, login };

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password + PEPPER, SALT_ROUNDS);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      msg: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password + PEPPER, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.json({
      msg: "Login successful",
      token,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = { register, login };
