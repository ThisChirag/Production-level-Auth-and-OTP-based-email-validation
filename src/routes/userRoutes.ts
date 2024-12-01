// import { Router } from "express";
// import { signUp, home, login, newBlog } from "../controllers/userCreate";
// import { authenticateToken } from "../middlewares/authenticateToken";
// import {rateLimiter} from "../middlewares/rateLimiter";


// const userRoute = Router();

// userRoute.get('/home', authenticateToken, home);
// userRoute.post('/login', rateLimiter(10,20), login);
// userRoute.post('/signup',rateLimiter(10,20), signUp);
// userRoute.post('/newblog',authenticateToken, newBlog);

// export default userRoute;

import { Router } from "express";
import { signUp, home, login, newBlog } from "../controllers/userCreate";
import { authenticateToken } from "../middlewares/authenticateToken";
import { rateLimiter } from "../middlewares/rateLimiter";
import { requestOtp, verifyOtp } from "../controllers/otpController"; // Import OTP controllers

const userRoute = Router();

// Protected routes
userRoute.get('/home', authenticateToken, home);
userRoute.post('/newblog', authenticateToken, newBlog);

// Authentication routes
userRoute.post('/login', rateLimiter("login", 10, 60), login);

// OTP-based signup routes
userRoute.post('/signup/request-verification', rateLimiter("signup", 5, 60), requestOtp); // Request OTP
userRoute.post('/signup/verify-otp', rateLimiter("verify-otp", 5, 60), verifyOtp); // Verify OTP and create account

export default userRoute;

