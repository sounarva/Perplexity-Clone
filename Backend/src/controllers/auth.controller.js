import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";

export const registerController = async (req, res) => {
    try {
        const { username, email, password } = req.body
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const user = await userModel.findOne({
            $or: [
                { email },
                { username }
            ]
        })
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        const newUser = await userModel.create({
            username,
            email,
            password
        })

        const emailVerificationToken = jwt.sign({
            email: newUser.email
        }, process.env.JWT_SECRET)

        await sendEmail({
            to: email,
            subject: "Welcome to Perplexity! 🤖",
            html: `
                <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0d1117; padding: 40px 20px; color: #ffffff; line-height: 1.6;">
                    <div style="max-width: 500px; margin: 0 auto; background-color: #151c28; border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 20px; padding: 40px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <div style="display: inline-flex; align-items: center; gap: 10px;">
                                <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #22d3ee, #34d399); border-radius: 50%; display: inline-block; vertical-align: middle; line-height: 40px; text-align: center;">
                                    <span style="font-size: 20px;">🤖</span>
                                </div>
                                <span style="font-size: 24px; font-weight: 700; color: #ffffff; margin-left: 10px; vertical-align: middle;">Perplexity</span>
                            </div>
                        </div>

                        <h1 style="font-size: 22px; font-weight: 600; margin-bottom: 20px; color: #ffffff;">Welcome, ${username}! 🤵</h1>
                        
                        <p style="color: #94a3b8; font-size: 16px; margin-bottom: 25px;">
                            Thank you for joining <strong>Perplexity</strong>. We're thrilled to have you as part of our community of explorers and thinkers. 😍
                        </p>

                        <p style="color: #94a3b8; font-size: 16px; margin-bottom: 30px;">
                            To get started, please verify your email address by clicking the button below:
                        </p>

                        <div style="text-align: center; margin-bottom: 35px;">
                            <a href="${process.env.BACKEND_URI}/api/v1/auth/verify-email?token=${emailVerificationToken}" 
                               style="background-color: #1a8cd8; color: #ffffff; padding: 14px 30px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block;">
                               Verify My Email
                            </a>
                        </div>

                        <div style="border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 25px; margin-top: 30px;">
                            <p style="color: #64748b; font-size: 14px; margin-top: 25px;">
                                Best regards,<br>
                                <strong>The Perplexity Team</strong> 💕
                            </p>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 25px; color: #4b5563; font-size: 12px;">
                        © ${new Date().getFullYear()} Perplexity AI. All rights reserved.
                    </div>
                </div>
            `
        })

        return res.status(201).json({
            success: true,
            message: "User registered successfully ✅",
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                isVerified: newUser.isVerified
            }
        })
    } catch (error) {
        console.error("Register Error ❌:", error);
        res.status(500).json({
            success: false,
            message: "Registration failed. Please try again later."
        })
    }
}

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(404)
                .json({
                    success: false,
                    message: "User not found"
                })
        }

        const isPasswordValid = await user.comparePassword(password)
        if (!isPasswordValid) {
            return res.status(401)
                .json({
                    success: false,
                    message: "Invalid password"
                })
        }

        if (!user.isVerified) {
            return res.status(401)
                .json({
                    success: false,
                    message: "Email not verified"
                })
        }

        const token = jwt.sign({
            email: user.email,
            id: user._id
        }, process.env.JWT_SECRET, {
            expiresIn: "1d"
        })

        res.cookie("token", token)

        return res.status(200)
            .json({
                success: true,
                message: "Login successful ✅",
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    isVerified: user.isVerified
                }
            })
    } catch (error) {
        return res.status(500)
            .json({
                success: false,
                message: "Something went wrong"
            })
    }
}

export const resetPasswordLinkController = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            })
        }

        const user = await userModel.findOne({
            email
        })
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        const resetPasswordToken = jwt.sign({
            email: user.email
        }, process.env.JWT_SECRET, {
            expiresIn: "15m"
        })

        await sendEmail({
            to: email,
            subject: "Reset Password 🔐",
            html: `
                <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0d1117; padding: 40px 20px; color: #ffffff; line-height: 1.6;">
                    <div style="max-width: 500px; margin: 0 auto; background-color: #151c28; border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 20px; padding: 40px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <div style="display: inline-flex; align-items: center; gap: 10px;">
                                <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #22d3ee, #34d399); border-radius: 50%; display: inline-block; vertical-align: middle; line-height: 40px; text-align: center;">
                                    <span style="font-size: 20px;">🔐</span>
                                </div>
                                <span style="font-size: 24px; font-weight: 700; color: #ffffff; margin-left: 10px; vertical-align: middle;">Perplexity</span>
                            </div>
                        </div>

                        <h1 style="font-size: 22px; font-weight: 600; margin-bottom: 20px; color: #ffffff;">Reset Your Password, ${user.username}! 🤵</h1>
                        
                        <p style="color: #94a3b8; font-size: 16px; margin-bottom: 25px;">
                            We received a request to reset your password. If you didn't make this request, you can safely ignore this email.
                        </p>

                        <p style="color: #94a3b8; font-size: 16px; margin-bottom: 30px;">
                            Otherwise, click the button below to set a new password. This link will expire in 15 minutes.
                        </p>

                        <div style="text-align: center; margin-bottom: 35px;">
                            <a href="${process.env.FRONTEND_URI}/reset-password?token=${resetPasswordToken}" 
                               style="background-color: #1a8cd8; color: #ffffff; padding: 14px 30px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block;">
                               Reset My Password
                            </a>
                        </div>

                        <div style="border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 25px; margin-top: 30px;">
                            <p style="color: #64748b; font-size: 14px; margin-top: 25px;">
                                Best regards,<br>
                                <strong>The Perplexity Team</strong> 💕
                            </p>
                        </div>
                    </div>
                </div>
            `
        })

        return res.status(200).json({
            success: true,
            message: "Reset password link sent successfully ✅"
        })
    } catch (error) {
        console.error("Reset Password Link Error ❌:", error);
        return res.status(500)
            .json({
                success: false,
                message: error.message || "Failed to send reset link"
            })
    }
}

export const resetPasswordController = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Token and new password are required"
            });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findOne({
            email: decodedToken.email
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.password = newPassword;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password reset successfully ✅"
        });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "Reset link has expired"
            });
        }
        return res.status(500).json({
            success: false,
            message: "Something went wrong or Invalid Token"
        });
    }
}

export const getMeController = async (req, res) => {
    try {
        const user = req.user
        return res.status(200).json({
            success: true,
            message: "User fetched successfully ✅",
            user
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const logoutController = async (req, res) => {
    try {
        res.clearCookie("token")
        return res.status(200).json({
            success: true,
            message: "Logout successful ✅"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const verifyEmailController = async (req, res) => {
    try {
        const { token } = req.query
        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Token is required"
            })
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findOne({
            email: decodedToken.email
        })
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        if (user.isVerified) {
            const html = `
                <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0d1117; height: 100vh; display: flex; align-items: center; justify-center; color: #ffffff; margin: 0;">
                    <div style="max-width: 400px; width: 100%; margin: auto; background-color: #151c28; border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 24px; padding: 40px; text-align: center; box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
                        <div style="width: 64px; height: 64px; background: rgba(52, 211, 153, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px;">
                            <span style="font-size: 32px;">✅</span>
                        </div>
                        <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 12px; color: #ffffff;">Already Verified!</h1>
                        <p style="color: #94a3b8; font-size: 16px; margin-bottom: 32px;">Your email has already been verified. You're all set to go!</p>
                        <a href="${process.env.FRONTEND_URI}/login" style="display: block; background-color: #1a8cd8; color: #ffffff; padding: 14px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 16px; transition: opacity 0.2s;">Go to Login</a>
                    </div>
                </div>
            `
            return res.status(400).send(html)
        }

        user.isVerified = true
        await user.save()
        const html = `
            <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0d1117; height: 100vh; display: flex; align-items: center; justify-content: center; color: #ffffff; margin: 0;">
                <div style="max-width: 400px; width: 100%; margin: auto; background-color: #151c28; border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 24px; padding: 40px; text-align: center; box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
                    <div style="width: 64px; height: 64px; background: rgba(52, 211, 153, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px;">
                        <span style="font-size: 32px;">🎉</span>
                    </div>
                    <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 12px; color: #ffffff;">Email Verified!</h1>
                    <p style="color: #94a3b8; font-size: 16px; margin-bottom: 32px;">Success! Your email has been verified. Welcome to the future of search.</p>
                    <a href="${process.env.FRONTEND_URI}/login" style="display: block; background-color: #1a8cd8; color: #ffffff; padding: 14px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 16px; transition: opacity 0.2s;">Go to Login</a>
                </div>
            </div>
        `
        return res.status(200).send(html)
    } catch (error) {
        console.error("Verify Email Error ❌:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong during email verification"
        })
    }
}

export const resendVerificationEmailController = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            })
        }

        const user = await userModel.findOne({
            email
        })
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "Email already verified ✅"
            })
        }

        const emailVerificationToken = jwt.sign({
            email: user.email
        }, process.env.JWT_SECRET)

        await sendEmail({
            to: email,
            subject: "Welcome to Perplexity! 🤖",
            html: `
                <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0d1117; padding: 40px 20px; color: #ffffff; line-height: 1.6;">
                    <div style="max-width: 500px; margin: 0 auto; background-color: #151c28; border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 20px; padding: 40px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <div style="display: inline-flex; align-items: center; gap: 10px;">
                                <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #22d3ee, #34d399); border-radius: 50%; display: inline-block; vertical-align: middle; line-height: 40px; text-align: center;">
                                    <span style="font-size: 20px;">🤖</span>
                                </div>
                                <span style="font-size: 24px; font-weight: 700; color: #ffffff; margin-left: 10px; vertical-align: middle;">Perplexity</span>
                            </div>
                        </div>

                        <h1 style="font-size: 22px; font-weight: 600; margin-bottom: 20px; color: #ffffff;">Welcome back, ${user.username}! 🤵</h1>
                        
                        <p style="color: #94a3b8; font-size: 16px; margin-bottom: 25px;">
                            Thank you for registering at <strong>Perplexity</strong>. We're excited to have you on board! 😍
                        </p>

                        <p style="color: #94a3b8; font-size: 16px; margin-bottom: 30px;">
                            Please verify your email address by clicking the button below:
                        </p>

                        <div style="text-align: center; margin-bottom: 35px;">
                            <a href="${process.env.BACKEND_URI}/api/v1/auth/verify-email?token=${emailVerificationToken}" 
                               style="background-color: #1a8cd8; color: #ffffff; padding: 14px 30px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block;">
                               Verify My Email
                            </a>
                        </div>

                        <div style="border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 25px; margin-top: 30px;">
                            <p style="color: #64748b; font-size: 14px; margin-top: 25px;">
                                Best regards,<br>
                                <strong>The Perplexity Team</strong> 💕
                            </p>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 25px; color: #4b5563; font-size: 12px;">
                        © ${new Date().getFullYear()} Perplexity AI. All rights reserved.
                    </div>
                </div>
            `
        })

        return res.status(200).json({
            success: true,
            message: "Verification email sent successfully ✅"
        })
    } catch (error) {
        console.error("Resend Verification Error ❌:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to resend verification email"
        })
    }
}