"use strict";

import * as AuthLocal from "passport-local";
import {User} from "../model/user";
import {Asset} from "../model/asset";

const crypto = require('crypto');

let configPassport = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser((id, done) => {
        User.findById(id)
            .select("-password")
            .populate({ path: "profileImage", model: Asset })
            .exec((err, user) => {
                done(err, user);
            });
    });

    passport.use('local-signup', new AuthLocal.Strategy({
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
    }, (req, email, password, done) => {
        process.nextTick(() => {
            User.findOne({'email': email}, '-password', (err, user) => {
                if (err)
                    return done(err);
                else if (user)
                    return done(409);

                let newUser = new User({ email, password, name: req.body.name, confirmationId: crypto.randomBytes(20).toString('hex') });
                newUser.save((err) => {
                    if (err)
                        throw err;

                    return done(null, newUser);
                });
            });
        });
    }));

    passport.use('local-login', new AuthLocal.Strategy({
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
    }, (req, email, password, done) => {
        function loginCallback(err, user, failedLoginReason) {
            if(err) return done(err);
            else if (user) return done(null, user);

            switch(failedLoginReason) {
                case User.failedLoginReasons.NOT_FOUND:
                case User.failedLoginReasons.PASSWORD_INCORRECT:
                    break;
                case User.failedLoginReasons.MAX_ATTEMPTS:
                    // TODO: send mail to user!
                    break;
            }
            return done(null, false);
        };

        if(req.body.confirmationId) {
            User.updateAuthentication(email, password, req.body.confirmationId, loginCallback);
        } else {
            User.getAuthentication(email, password, loginCallback);
        }
    }));
};

export {configPassport};