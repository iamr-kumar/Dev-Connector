const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const config = require("config");
const Token = require("./../../models/Token");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { check, validationResult } = require("express-validator");

// @route GET api/auth
// @desc test route
// @access Private
router.get("/", auth, async (req, res) => {
    try {
        // console.log(req.user.id);
        const user = await User.findById(req.user.id).select("-password");
        // console.log(user);
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// @route POST api/auth
// @desc Authenticate user and get token
// @access Public
router.post(
    "/",
    [
        check("email", "Enter a valid email").isEmail(),
        check("password", "password is required").exists(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            });
        }

        const { email, password } = req.body;

        try {
            // See if user exists
            let user = await User.findOne({ email });
            if (!user) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: "Invalid credentials" }] });
            }

            const isMatched = await bcrypt.compare(password, user.password);

            if (!isMatched) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: "Invalid credentials" }] });
            }

            const payload = {
                user: {
                    id: user.id,
                },
            };

            // Return jsonwebtoken
            jwt.sign(
                payload,
                config.get("jwtSecret"),
                { expiresIn: 360000 },
                (err, token) => {
                    if (err) {
                        throw err;
                    } else {
                        return res.json({ token });
                    }
                }
            );
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Server Error!");
        }
    }
);

// @route GET api/auth/verifyemail
// @desc Send verification email to users
// @access Private
router.get("/verifyemail", auth, async (req, res) => {
    if (!req.user) {
        return res.status(404).json({ errors: [{ msg: "No user found!" }] });
    }
    try {
        // Generate a new token
        const user = await User.findById(req.user.id);
        const token = new Token({
            userId: user._id,
            token: crypto.randomBytes(16).toString("hex"),
        });
        // console.log(token);
        // Save the token
        await token.save();

        // // Send the email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: config.get("nodemailer-email"),
                pass: config.get("nodemailer-password"),
            },
        });
        const mailOptions = {
            from: config.get("nodemailer-email"),
            to: user.email,
            subject: "Verify your Dev Connector account",
            text: `Hello ${user.name}, click on this link to activate your account.\n http://localhost:3000/verifytoken/${token.token}`,
            html: `Hello <strong>${user.name}</strong>, <br><br>Click on the below link to activate your Dev Connector account <br> http://localhost:3000/verifytoken/${token.token}`,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).send(token);
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
});

// @route GET api/auth/confirmation/:token
// @desc Verify token and email of users
// @access Private
router.get("/confirmation/:token", async (req, res) => {
    try {
        const token = await Token.findOne({ token: req.params.token });

        if (!token) {
            return res.status(404).json({
                msg: "Token was not found. It may have expired. Try again!",
            });
        }

        const user = await User.findById(token.userId);
        if (!user) {
            return res
                .status(404)
                .json({ msg: "No user found for this token!" });
        }
        if (user.isVerified) {
            return res
                .status(400)
                .json({ msg: "Your account has already been verified!" });
        }
        user.isVerified = true;
        await user.save();
        await Token.findByIdAndDelete(token._id);
        res.status(200).json({ msg: "Your account is successfully verified!" });
    } catch (err) {
        console.log(err);
        res.status(500).send("Server error!");
    }
});

module.exports = router;
