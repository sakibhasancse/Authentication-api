const { check } = require('express-validator')

exports.validRagister = [
    check('name', 'Name is required')
        // .isEmpty()
        .isLength({ min: 3, max: 32 })
        .withMessage('Name Must be Between 3 and 32 characters'),
    check('email').isEmail().withMessage('Must be valid email'),
    check('password', 'password is required'),
    check('password').isLength({ min:6}).withMessage('Password must contain at least 6 characters').matches(/\d/).withMessage('Password must contain a number')
]

exports.validCode = [
    check('token').isLength({ min: 3})
        .withMessage('Token Is Required'),
    check('varifycode').isLength({ min: 3 })
        .withMessage('Code is Required'),
]


exports.passvalidCode = [
    check('code').isLength({ min: 3 })
        .withMessage('Code Is Required'),
    
]


exports.validPhone = [
    check('token').isLength({ min: 3 })
        .withMessage('Token Is Required'),
    check('phone', 'phone is required')
        .isLength({ min: 1 })
        .withMessage('phone Must be Between 1 and 32 characters'),
    check('country', 'country is required')
        .isLength({ min: 1 })
        .withMessage('country Must be Between 1 and 32 characters'),
    check('gender', 'gender is required')
        .isLength({ min: 3 })
        .withMessage('gender Must be Between 3 and 32 characters'),
    check('age', 'age is required')
        .isLength({ min: 1 })
        .withMessage('age Must be Between 1 and 3 characters'),

]


exports.regisActivation = [
    check('token').isLength({ min: 3 })
        .withMessage('Token Is Required'),
    check('phonecode', 'phonecode is required')
        .isLength({ min: 3 })
        .withMessage('Phone code is required')
    
]
exports.validLogin = [

    check('email').isEmail().withMessage('Must be valid email'),
    check('password', 'password is required'),
    check('password').isLength({ min: 6 }).withMessage('Password must contain at least 6 characters').matches(/\d/).withMessage('Password must contain a number')
]
exports.forgetPasswordvalidator = [
    check('email').not().isEmpty().isEmail().withMessage('Must be valid email'),
]

exports.resetPasswordvalidator = [
    check('token').isLength({ min: 3 })
        .withMessage('Token Is Required'),
    check('newPassword').not().isEmpty().isLength({ min: 6 }).withMessage('Password must contain at least 6 characters'),
]