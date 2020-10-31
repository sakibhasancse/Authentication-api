const express = require('express')
const router = express.Router()
const { ragisterController, forgetControllerValidate,emailVarify, informationController, activationController, loginController, forgetController, resetPasswordController } =require('../controller/authcontroller')
const { validRagister, validPhone, passvalidCode, regisActivation,validLogin, validCode, forgetPasswordvalidator, resetPasswordvalidator} =require('../helpers/valid')

router.post('/register', validRagister, ragisterController)
router.post('/conframregister', validCode, emailVarify)
router.post('/informationregister', validPhone, informationController)

router.post('/activation', regisActivation, activationController)
router.post('/login', validLogin, loginController)

router.put('/password/forget', forgetPasswordvalidator, forgetController)
router.put('/password/reset', passvalidCode, forgetControllerValidate)
router.put('/password/newpassword', resetPasswordvalidator, resetPasswordController)


module.exports =router