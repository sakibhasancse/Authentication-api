const mogoose = require('mongoose')
const crypto = require('crypto')
const random = require('randomatic')

const userSchema = new mogoose.Schema({ 
    email: {
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        type:String
    },
    name: {
        required: true,
        trim: true,
        type: String
    },
    hashed_password: {
        type: String,
        required: true

    },
  
    phone: {
        type: String,
        required: true

    }, age: {
        type: String,
        required: true

    },
    gender: {
        type: String,
        required: true

    }, country: {
        type: String,
        required: true

    },


    salt: String,
   
    resetPasswordCode: String,
    resetPasswordExpire: Date,
    
}, { timestamps: true })



userSchema.virtual('password')
    .set(function (password) {
        this._password = password
        this.salt = this.makeSalt()
        this.hashed_password =this.encryptPassword(password)
    })
    .get(function () {
    return this.password
})


//methods
userSchema.methods = {
    makeSalt: function () {
        return Math.round(new Date().valueOf() * Math.random()) + "";
    },
    encryptPassword: function (password) {
        if (!password) return ''
        try {
            return crypto.createHmac('sha1', this.salt)
                .update(password)
                .digest('hex')
        } catch (err) {
            return ''
            
        }
    },
    authenticate: function (plainPassword) {
        return this.encryptPassword(plainPassword) === this.hashed_password
    },
  
};
userSchema.methods.getResetPasswordToken=function () {

    const code = random('0', 6)
    this.resetPasswordCode = crypto.createHash('sha256').update(code).digest('hex');
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  
    return code;
}
module.exports = mogoose.model('User',userSchema)