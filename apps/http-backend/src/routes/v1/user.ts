import {verifyToken, generateToken} from "authenticator";
import { Router } from "express";

const router: Router = Router();

router.post("/signup", (req, res) => {
    const phoneNumber = req.body.phoneNumber;
    const totp = generateToken(phoneNumber + "SIGNUP");
    // send otp to phone number

    res.json({
        id: "1"
    });
});

router.post("/signup/verify", (req, res) => {
    const phoneNumber = req.body.phoneNumber;
    if (!verifyToken(phoneNumber + "SIGNUP", req.body.otp)) {
        res.json({
            message: "Invalid token"
        });
        return;
    }
    // set user to verified in db
    res.json({
        token: "jwt-token-here"
    });
});

router.post("/signin", (req, res) => {
    const { phoneNumber } = req.body;
    const totp = generateToken(phoneNumber + "SIGNIN");
    // send totp to phone number
    
    res.json({
        message: "OTP sent successfully"
    });
});

router.post("/signin/verify", (req, res) => {
    const { phoneNumber, otp } = req.body;
    if (!verifyToken(phoneNumber + "SIGNIN", otp)) {
        res.json({
            message: "Invalid token"
        });
        return;
    }
    // verify user in db and generate JWT
    res.json({
        token: "jwt-token-here"
    });
});

router.get("/profile", (req, res) => {
    // TODO: Implement authentication middleware
    // Get user profile from database
    res.json({
        id: "1",
        phoneNumber: "1234567890",
        name: "John Doe"
    });
});

export default router;