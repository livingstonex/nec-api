const User = require('../../models/sql/Users');
const Error = require('../../utils/errorResponse');

const Register = async (req, res, next) => {
  const { email, fullName, phone, password } = req.body;

  if (email == '' || password == '' || phone == '' || fullName == '') {
    return next(
      new Error('Please fill in all the fields, they are all required', 400)
    );
  }

  const passChecker =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;

  if (!password.match(passChecker)) {
    return next(
      new Error(
        'Password must be minimum of eight (8) characters long, containing uppercase and lowercase letters,atleast a number and a special character',
        400
      )
    );
  }

  const emailChecker =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!email.match(emailChecker)) {
    return next(new Error('Please enter a valid email', 400));
  }

  const phoneNumberChecker =
    /(?:(?:(?:\+?234(?:\h1)?|01)\h*)?(?:\(\d{3}\)|\d{3})|\d{4})(?:\W*\d{3})?\W*\d{4}(?!\d)/;
  if (!phone.match(phoneNumberChecker)) {
    return next(new Error('please enter a valid phone number', 400));
  }

  try {
    const newUser = await User.create({
      fullName,password,phone ,email
    })
    console.log(newUser)
  } catch (e) {
    return next(new Error(e.message, 500));
  }
};

module.exports = Register;
