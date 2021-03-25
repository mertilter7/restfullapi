const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('@hapi/joi');
const createError = require('http-errors');
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
    isim : {
        type : String,
        required: true,
        trim : true,
        minlength: 3,
        maxlength: 50
    },
    userName : {
        type : String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    email : {
        type : String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    sifre : {
        type : String,
        required: true,
        lowercase: true,
        trim: true,
        minlength : 4 
    }
},{collection:'kullanicilar' , timestamps:true});
// User Schema
const schema = Joi.object({
    isim : Joi.string().min(3).max(50).trim(),
    userName : Joi.string().min(3).max(50).trim(),
    email : Joi.string().trim().email(),
    sifre : Joi.string().trim().min(4)
});

// New User Validation
UserSchema.methods.joiValidation = function (userObject) {
    schema.required();
    return schema.validate(userObject)
}
UserSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user._id;
    delete user.createdAt;
    delete user.updatedAt;
    delete user.sifre;
    delete user.__v;
        return user;
}

// Check Users
UserSchema.statics.signIn = async (email, sifre) => {
    const {error,value} = schema.validate({email,sifre});
    if (error) {
        throw createError(400, error);
    }
    const user = await User.findOne({email});
    if(!user) {
        throw createError(400,"Girilen email/sifre hatalı")
    }
        const sifreKontrol = await bcrypt.compare(sifre,user.sifre);
        if(!sifreKontrol)   {
            throw createError(400, "Girilen email/sifre hatali");
        }
        return user;
}
// Update User Validation
UserSchema.statics.joiValidationForUpdate = function (userObject) {
    return schema.validate(userObject)
}
const User = mongoose.model('User', UserSchema);

module.exports = User;