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
      res.render('userRegister',{message:'Password doesnot match'})
    }

    // phone number checking
    const phoneNumber = req.body.Phone;
    if (!/^\d{10}$/.test(phoneNumber)) {
      res.render('userRegister',{message:'Phone number must be 10 digit'})
    }

    // email verification
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(req.body.email)) {
      res.render('userRegister',{message:'Enter the email in correct format'})
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
      req.session.email=req.body.email;
      res.redirect('/otp');
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
            res.redirect(`/`);
          } else {
            console.log(blockData);
            req.session.blocked="true"
            res.redirect(`/login`);
          }
        } catch (err) {
          console.error(err);
          req.session.nouser='true'
          res.redirect(`/login`);
        }
      }
      else{
        req.session.nouser='true'
        res.redirect(`/login`);
      }
    } catch (err) {
      req.session.nouser='true'
      res.redirect(`/login`);
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

    Userdb.updateOne({ email: req.session.email }, { $push: { address: address } })
      .then(() => {
        res.redirect('/login');
      })
      .catch((err) => {
        res.redirect('/err')
      });
  },

  deleteaddress: async (req, res) => {

    const index = parseInt(req.query.index);

    try {
      const userData = await Userdb.findOne({ email: req.session.email })

      await Userdb.updateOne(
        { email: req.session.email },
        { $pull: { address: { $in: [userData.address[index]] } } }
      );

      res.redirect('/login');
    } catch (err) {
      res.redirect('/err')
    }
  },

  forgetpass: async (req, res) => {
    req.session.nouser='false'
    const email = req.body.email;

    try {
      const data = await Userdb.find({ email: email });

      if (data.length === 0) {
        req.session.status='false'
        res.redirect('/forgot-password');
      } else {
        req.session.forgetemail=email;
        req.session.status='true'
        res.redirect(`/forgetotp`);
      }
    } catch (err) {
      res.render('errorpage');
    }
  },

  resetpass: async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    try {
      await Userdb.updateOne({ email: req.session.forgetemail }, { $set: { password: hashedPassword } });
      res.redirect('/login');
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  },
};

