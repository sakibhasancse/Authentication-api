
const User = require('../model/auth.model')
const _ = require('lodash');
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const SendEmail = require('../config/sendEmail')
const { errorhandler } = require('../helpers/dbErrorHandler')

const random = require('randomatic')
const crypto = require('crypto')

exports.ragisterController = async (req, res) => {
    const { name, email, password } = req.body;

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const firstError = errors.array().map(error => error.msg)[0]
        console.log(firstError)
        return res.status(422).json({
            error: firstError
        })
    } else {
        const user = await User.findOne({ email })
        if (user) {
            return res.status(404).json({
                errors: "Email is Alredy Register"
            })
        }

        const randomCode = random('0', 5)
        console.log(randomCode)

        const token = jwt.sign({
            name, email, password, code: randomCode
        },
            process.env.JWT_ACCESS_TOKEN,
            {
                expiresIn: '15m'
            }

        )
        SendEmail({
            email: email,
            subject: 'Email  Activation',
            html: `<h1>Please Confram your Email </h1> <p> This is Your Code : </p><h1> ${randomCode} </h1>
            <hr/>
            <p>This Email Contain Sensetive information</p>
            <p>${process.env.CLIENT_URL}

            `
        })
        res.status(200).json({
            name, email, password,
            success: true,
            message: 'Now Your Email is Confram ,Go to next step',
            token: token
        })
    }
}

exports.emailVarify = (req, res, next) => {
    const { token, varifycode } = req.body
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        const firstError = errors.array().map(error => error.msg)[0]
        console.log(firstError)
        return res.status(422).json({
            error: firstError
        })
    } else {


        if (token && varifycode) {
            jwt.verify(token, process.env.JWT_ACCESS_TOKEN, (err, decoded) => {
                if (err) {

                    return res.status(401).json({
                        error: 'Expired Token .Signup again'
                    })
                } else {
                    const { name, email, password, code } = jwt.decode(token)

                    console.log(code)
                    if (varifycode !== code) {
                        console.log('hello')
                        return res.status(401).json({
                            error: 'Worng code ,Try Again'
                        })
                    } else {
                        const token = jwt.sign({
                            name, email, password, varifycode
                        },
                            process.env.JWT_ACCESS_TOKEN,
                            {
                                expiresIn: '15m'
                            }

                        )

                        return res.status(200).json({
                            success: true,
                            message: 'Type your information ,Go to next step',
                            token: token
                        })

                    }

                }
            })


        }
    }
}


exports.informationController = async (req, res) => {
    const { token, phone, age, gender, country } = req.body;

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const firstError = errors.array().map(error => error.msg)[0]
        console.log(firstError)
        return res.status(422).json({
            error: firstError
        })
    } else {
        const user = await User.findOne({ phone })
        if (user) {
            return res.status(404).json({
                errors: "Phone Number is Alredy Register"
            })
        }
        if (token) {
            jwt.verify(token, process.env.JWT_ACCESS_TOKEN, (err, decoded) => {
                if (err) {

                    return res.status(401).json({
                        error: 'Expired Token .Signup again'
                    })
                } else {


                    const { name, email, password, varifycode } = jwt.decode(token)
                    if (!varifycode) {

                        return res.status(401).json({
                            error: 'Expired Token .Signup again 2'
                        })
                    }
                    const randomCode = random('0', 5)
                    console.log(randomCode)
                    const newtoken = jwt.sign({
                        name, email, password, phone, age, gender, country, varifycode, randomCode
                    },
                        process.env.JWT_ACCESS_TOKEN,
                        {
                            expiresIn: '40m'
                        }

                    )
                    const accountSid = process.env.SMS_TWILIO_ACCOUNT_SID;
                    const authToken = process.env.SMS_TWILIO_TOKEN;
                    const client = require('twilio')(accountSid, authToken);
                   
                    client.messages.create({
                        from: '+8801763553147',
                        to: phone,
                        body:'sdfsd'
                    }).then(message => console.log('send'+ message.sid));


                    res.status(200).json({
                        name, email, password,
                        success: true,
                        message: 'Confram the Code ,Check Your Phone',
                        token: newtoken
                    })




                }
            })
        }


    }
}



exports.activationController = async (req, res) => {
    const { token, phonecode } = req.body
    if (token) {
        jwt.verify(token, process.env.JWT_ACCESS_TOKEN, (err, decoded) => {
            if (err) {

                return res.status(401).json({
                    error: 'Expired Token .Signup again'
                })
            } else {



                const { varifycode, randomCode, name, email, password, phone, age, gender, country } = jwt.decode(token)
                if (!varifycode || !randomCode) {

                    return res.status(401).json({
                        error: 'Expired Token .Signup again'
                    })
                }

                if (phonecode !== randomCode) {
                    return res.status(401).json({
                        error: 'Code is not matching ,Try Again'
                    })
                }

                const user = new User({
                    name, email, password, phone, age, gender, country
                })
                user.save((err, user) => {
                    if (err) {
                        return res.status(401).json({
                            error: errorhandler(err)
                        })
                    } else {
                        return res.status(200).json({
                            success: true,
                            message: 'Signup Successfully created',
                            user
                        })
                    }
                })
            }
        })
    } else {

        return res.json({
            message: 'Error happening please try again'
        })
    }
}


exports.loginController = async (req, res, next) => {
    const { email, password } = req.body;
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const firstError = errors.array().map(error => error.msg)[0]
        console.log(firstError)
        return res.status(422).json({
            error: firstError
        })
    } else {
        await User.findOne({ email }).exec((err, result) => {
            if (err || !result) {
                return res.status(401).json({
                    errors: 'User Not Found !Please Sign up'
                })
            }


            if (!result.authenticate(password)) {
                return res.status(401).json({
                    errors: 'Email and password not match'
                })
            }


            const token = jwt.sign(
                {
                    _id: result._id
                }, process.env.JWT_SECRET, {
                expiresIn: '7d'
            }
            )

            const { _id, name, email, role } = result
            return res.json({
                token, user: {
                    _id, name, email, role
                }
            })

        })
    }

}



exports.forgetController = async (req, res) => {
    const { email } = req.body;
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const firstError = errors.array().map(error => error.msg)[0]
        return res.status(422).json({
            error: firstError
        })
    } else {


        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                errors: 'User with that email not found'
            })
        }


        const code = user.getResetPasswordToken()

        await user.save({ validateBeforeSave: false });

        const emaildata = SendEmail({
            email: email,
            subject: 'Password Reset ',
            html: `<h1> Reset Your Password</h1><br><p>This is Your Code </p> <br> <h2>${code}</h2>
            <hr/>
            <p>This email contain Sensetive info</p>
            <p>${process.env.CLIENT_URL}
            `
        })




        try {
            emaildata

            return res.json({
                message: `Email hase been sent to ${email} , Check your email`
            })
        } catch (err) {

            user.resetPasswordCode = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false })
            return res.status(500).json({
                message: 'Email could not sent'
            })
        }





    }

}

exports.forgetControllerValidate = async (req, res) => {
    const { code } = req.body
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const firstError = errors.array().map(error => error.msg)[0]
        return res.status(422).json({
            error: firstError
        })
    } else {

        let resetPasswordCode = crypto.createHash('sha256').update(code).digest('hex');
        console.log(resetPasswordCode)

        const user = await User.findOne({
            resetPasswordCode: resetPasswordCode,
            resetPasswordExpire: { $gt: Date.now() }
        })


        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Invalid Code , Try again'
            })
        }


        let userid = user._id
        const token = jwt.sign({
            userid
        },
            process.env.JWT_RESET_PASSWORD,
            {
                expiresIn: '40m'
            }

        )
        user.resetPasswordCode = undefined
        user.resetPasswordExpire = undefined
        await user.save()
        res.status(200).json({
            success: true,
            token: token,
            message: 'Create a new password'
        })







    }
}


exports.resetPasswordController = (req, res) => {
    const { token, newPassword } = req.body

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const firstError = errors.array().map(error => error.msg)[0]
        return res.status(422).json({
            error: firstError
        })
    } else {
        if (token) {
            jwt.verify(token, process.env.JWT_RESET_PASSWORD, function (err, decoded) {
                if (err) {
                    return res.status(400).json({
                        error: 'Expired token ,Try again'
                    })
                }
                const { userid } = jwt.decode(token)

                User.findById({ _id: userid }, (err, user) => {
                    if (err || !user) {
                        return res.status(400).json({
                            error: 'Somthing went wrong'
                        })
                    }
                    user.password = newPassword

                    user.save((err, result) => {
                        if (err) {
                            return res.status(400).json({
                                error: 'Error Restarting your Password'
                            })
                        }
                        res.json({
                            message: 'Great ! Now You Can Login New Password'
                        })
                    })
                })
            })
        }

    }
}