const Userdb = require('../model/usersSchema');
const blockdb = require('../model/blockSchema');
const bcrypt = require('bcrypt');

// create and save new User

module.exports = {
  newuser: async (req, res) => {
    // validate request
    if (!req.body) {
      res.status(400).send({ message: "Content can not be empty!" });
      return;
    }

    console.log(req.body.password);
    console.log(req.body.confirmPassword);

    // password=confirmpassword
    if (req.body.password !== req.body.confirmPassword) {
      return res.status(400).send({ message: "Password and Confirm Password do not match!" });
    }

    // phone number checking
    const phoneNumber = req.body.Phone;
    if (!/^\d{10}$/.test(phoneNumber)) {
      return res.status(400).send({ message: "Phone number must be 10 digits long!" });
    }

    // email verification
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(req.body.email)) {
      return res.status(400).send({ message: "Invalid email format!" });
    }

    // new user
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new Userdb({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      phone: req.body.Phone,
      block: "false",
      status: "inActive",
      varify: "false",
      address: [],
      walletdetails:[],
      wallet:0
    });

    try {
      const data = await user.save();
      res.redirect('/');
    } catch (err) {
      res.redirect('/register');
    }
  },

  isUser: async (req, res) => {
    if (!req.body) {
      res.status(400).redirect('/login');
      return;
    }

    const { email: inputEmail, password: inputPassword } = req.body;

    try {
      const data = await Userdb.find({ email: inputEmail });
      const ismatch = await bcrypt.compare(inputPassword, data[0].password);

      if (ismatch) {
        req.session.email = inputEmail;

        try {
          const blockData = await blockdb.find({ email: inputEmail });

          if (blockData.length === 0) {
            req.session.isauth = true;
            await Userdb.updateOne({ email: inputEmail }, { $set: { status: 'Active' } });
            res.redirect(`/login?email=${inputEmail}`);
          } else {
            console.log(blockData);
            res.redirect(`/login?blocked=true`);
          }
        } catch (err) {
          console.error(err);
          res.redirect(`/login?nouser=true`);
        }
      }
      else{
        res.redirect(`/login?nouser=true`);
      }
    } catch (err) {
      console.error(err);
      res.redirect(`/login?nouser=true`);
    }
  },

  addaddress: (req, res) => {
    const address = {
      city: req.body.city,
      line1: req.body.line1,
      line2: req.body.line2,
      state: req.body.state,
      pin: req.body.pin,
    };

    Userdb.updateOne({ _id: req.query.id }, { $push: { address: address } })
      .then(() => {
        res.redirect('/login');
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(err);
      });
  },

  deleteaddress: async (req, res) => {
    console.log(req.query.id + 'it is id');
    console.log(req.query.index + 'it is id');
    const index = parseInt(req.query.index);
    console.log(index);

    try {
      const userData = await Userdb.findOne({ _id: req.query.id })

      await Userdb.updateOne(
        { _id: req.query.id },
        { $pull: { address: { $in: [userData.address[index]] } } }
      );

      res.redirect('/login');
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  },

  forgetpass: async (req, res) => {
    const email = req.body.email;

    try {
      const data = await Userdb.find({ email: email });

      if (data.length === 0) {
        res.redirect('/forgot-password?status=false');
      } else {
        res.redirect(`/forgetotp?email=${email}`);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  },

  resetpass: async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    try {
      await Userdb.updateOne({ email: req.query.email }, { $set: { password: hashedPassword } });
      res.redirect('/login');
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  },
};

