"use strict";

import * as mongoose from "mongoose";
import * as bcrypt from "bcrypt-nodejs";
import * as mongoosePaginate from "mongoose-paginate";

let SALT_WORK_FACTOR = 10;
let MAX_LOGIN_ATTEMPTS = 5;
let LOCK_TIME = 30*60*1000; // 30 Minuten

interface IUser {
    email: String;
    emailConfirmed: Boolean;
    password: String;
    created: Date;
    lastUpdated: Date;
    admin: Boolean;
    name: String;
    gender: String;
    academicTitle: String;
    salutation: String;
    phone: String;
    mobilePhone: String;
    citizenship: String;
    address: String;
    loc: {
        type: String,
        coordinates: Number[]
    };
    homepage: String;
    profileImage: mongoose.Schema.Types.ObjectId;
    transactions: mongoose.Schema.Types.ObjectId[];
    jamia: mongoose.Schema.Types.ObjectId;
    role: String;
    confirmationId: String;
    loginAttempts: Number;
    lockUntil: Number;
}

interface IUserDocument extends IUser, mongoose.Document {
    verifyPassword(password: string, done: (err: any, match: boolean) => void): boolean;
}

interface IUserModel extends mongoose.Model<IUserDocument>{
    failedLoginReasons: {
        NOT_FOUND: number,
        PASSWORD_INCORRECT: number,
        MAX_ATTEMPTS: number
    };
    updateAuthentication(email: string, password: string, confirmationId: string, done: (err: any, user: any, reason: any) => void): any;
    getAuthentication(email: string, password: string, done: (err: any, user: any, reason: any) => void): any;
}

let UserSchema = new mongoose.Schema({
    email: String,
    emailConfirmed: Boolean,
    password: String,
    created: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now },
    admin: Boolean,
    name: String,
    gender: String,
    academicTitle: String,
    salutation: String,
    phone: String,
    mobilePhone: String,
    citizenship: String,
    address: String,
    loc: {
        type: {type: String},
        coordinates: {type: Array}
    },
    homepage: String,
    profileImage: { type: mongoose.Schema.Types.ObjectId, ref: "assets" },
    transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "transactions" }],
    jamia: { type: mongoose.Schema.Types.ObjectId, ref: "jamias" },
    role: String,
    confirmationId: String,
    completeProfile: { type: Boolean, default: false },
    loginAttempts: { type: Number, required: true, default: 0 },
    lockUntil: { type: Number }
});

UserSchema.virtual('isLocked').get(function() {
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

UserSchema.methods.verifyPassword = function(password, done) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        if(err)
            return done(err);
        done(null, isMatch);
    });
};


UserSchema.methods.incLoginAttempts = function(cb) {
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.update({
            $set: { loginAttempts: 1 },
            $unset: { lockUntil: 1 }
        }, cb);
    }

    var updates: mongoose.ModelUpdateOptions = { $inc: { loginAttempts: 1 } };
    if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
        updates.$set = { lockUntil: Date.now() + LOCK_TIME };
    }
    return this.update(updates, cb);
};

let failedLoginReasons = UserSchema.statics.failedLoginReasons = {
    NOT_FOUND: 0,
    PASSWORD_INCORRECT: 1,
    MAX_ATTEMPTS: 2
};

UserSchema.statics.updateAuthentication = function(email, password, confirmationId, cb) {
    this.findOne({ email, confirmationId }, function(err, user) {
        if (err) return cb(err);
        if (!user) return cb(null, null, failedLoginReasons.NOT_FOUND);

        user.password = password;
        user.confirmationId = null;
        return user.save(function(err) {
            if (err) return cb(err);
            return cb(null, user);
        });
    });
};

UserSchema.statics.getAuthentication = function(email, password, cb) {
    this.findOne({ email }, function(err, user) {
        if (err) return cb(err);
        if (!user) return cb(null, null, failedLoginReasons.NOT_FOUND);

        return user.incLoginAttempts(function(err) {
            if (err) return cb(err);
            if (user.isLocked) return cb(null, null, failedLoginReasons.MAX_ATTEMPTS);

            user.verifyPassword(password, function(err, isMatch) {
                if (err) return cb(err);

                if (isMatch) {
                    return user.update({
                        $set: { loginAttempts: 0 },
                        $unset: { lockUntil: 1 }
                    }, function(err) {
                        if (err) return cb(err);
                        return cb(null, user);
                    });
                } else {
                    return cb(null, null, failedLoginReasons.PASSWORD_INCORRECT);
                }
            });
        });
    });
};

UserSchema.pre('save', function (done) {
    let user = this;

    if(this.isModified('email') && this._email) {
        // Some condition that fires before save if the email changes ... or something.
        // Maybe we wanna fire off an email to the old address to let them know it changed
        console.log("%s has changed their email to %s", this._email, this.email);
    }
    if(user.isModified('password')) {
        bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
            if(err) return done(err);
            bcrypt.hash(user.password, salt, null, (err, hash) => {
                if(err) return done(err);
                user.password = hash;
                user.lastUpdated = new Date();
                return done();
            });
        });
    } else {
        user.lastUpdated = new Date();
        return done();
    }
});

UserSchema.plugin(mongoosePaginate);

let User = mongoose.model<IUserDocument, IUserModel>("users", UserSchema);
export {User,IUser};