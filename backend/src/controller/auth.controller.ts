import { prisma } from "@/lib/prisma";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
dotenv.config();

interface TokenPayload {
    userId: string;
    email: string;
}

interface GoogleAuthResponse {
    message: string;
    user?: any;
    accessToken?: string;
    refreshToken?: string;
}
const generateTokens = (payload: TokenPayload) => {
    const accessToken = jwt.sign(
        payload,
        process.env.JWT_SECRET as string,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY as string,
        } as SignOptions
    );
    const refreshToken = jwt.sign(
        payload,
        process.env.JWT_REFRESH_SECRET as string,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY as string,
        } as SignOptions
    );
    return { accessToken, refreshToken };
};

export const google = async (req: Request, res: Response): Promise<void> => {
    try {
        const { displayName, email, googlePhotoUrl } = req.body;

        console.log("Google Auth Request Body:", req.body);
        if (!email) {
            res.status(400).json({
                message: "Email are required",
            });
        }
        let user = await prisma.user.findFirst({
            where: {
                email,
            },
        });

        if (!user) {
            const generatePassword =
                Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcrypt.hashSync(generatePassword, 10);

            user = await prisma.user.create({
                data: {
                    email,
                    googlePhotoUrl,
                    password: hashedPassword,
                },
            });
        }
        // Generate a unique refresh token ID
        const refreshTokenId = uuidv4();

        // Create or update refresh token in database
        // await prisma.refreshToken.upsert({
        //     where: { userId: user.id },
        //     update: {
        //         token: refreshTokenId,
        //         expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        //     },
        //     create: {
        //         userId: user.id,
        //         token: refreshTokenId,
        //         expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        //     },
        // });

        // Generate JWT tokens
        const tokenPayload: TokenPayload = {
            userId: user.id,
            email: user.email,
        };

        const { accessToken, refreshToken } = generateTokens(tokenPayload);

        // Return the tokens
        res.status(200).json({
            message: user ? "User logged in successfully" : "User created successfully",
            user: {
                id: user.id,
                email: user.email,
                displayName: displayName,
                photoURL: user.googlePhotoUrl,
            },
            accessToken,
            refreshToken,
        });
    } catch (error: any) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                message: "Email and password are required",
            });
        }
        const user = await prisma.user.findFirst({
            where: {
                email,
            },
        });
        if (!user) {
            res.status(401).json({
                message: "Invalid email or password",
            });
            return;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({
                message: "Invalid email or password",
            });
            return;
        }
        // Generate a unique refresh token ID
        // const refreshTokenId = uuidv4();
        // // Create or update refresh token in database

        // await prisma.refreshToken.upsert({
        //     where: { userId: user.id },
        //     update: {
        //         token: refreshTokenId,
        //         expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        //     },
        //     create: {
        //         userId: user.id,
        //         token: refreshTokenId,
        //         expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        //     },
        // });
        // Generate JWT tokens
        const tokenPayload: TokenPayload = {
            userId: user.id,
            email: user.email,
        };
        const { accessToken, refreshToken } = generateTokens(tokenPayload);
        // Return the tokens
        res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: user.id,
                email: user.email,
                displayName: user.name,
                photoURL: user.googlePhotoUrl,
            },
            accessToken,
            refreshToken,
        });
    } catch (error: any) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

export const signup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            res.status(400).json({
                message: "Email, password and name are required",
            });
        }
        const existingUser = await prisma.user.findFirst({
            where: {
                email,
            },
        });
        if (existingUser) {
            res.status(409).json({
                message: "User already exists",
            });
            return;
        }
        const hashedPassword = bcrypt.hashSync(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                googlePhotoUrl: "", // Default to empty, can be updated later
            },
        });
        // Generate a unique refresh token ID
        // const refreshTokenId = uuidv4();
        // Create or update refresh token in database
        // await prisma.refreshToken.upsert({
        //     where: { userId: user.id },
        //     update: {
        //         token: refreshTokenId,
        //         expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        //     },
        //     create: {

        //         userId: user.id,
        //         token: refreshTokenId,
        //         expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        //     },
        // });
        // Generate JWT tokens
        const tokenPayload: TokenPayload = {
            userId: user.id,
            email: user.email,
        };
        const { accessToken, refreshToken } = generateTokens(tokenPayload);
        // Return the tokens
        res.status(201).json({
            message: "User created successfully",
            user: {
                id: user.id,
                email: user.email,
                displayName: user.name,
                photoURL: user.googlePhotoUrl,
            },
            accessToken,
            refreshToken,
        });
    } catch (error: any) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

// ...existing code...

export const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

        if (!token) {
            res.status(401).json({
                message: "Access token required",
            });
            return;
        }

        try {
            // Verify the token to get user info
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;

            // Optional: If you're using refresh tokens in database, invalidate them
            // await prisma.refreshToken.deleteMany({
            //     where: { userId: decoded.userId }
            // });

            res.status(200).json({
                message: "User logged out successfully",
            });
        } catch (jwtError) {
            // Token is invalid or expired
            res.status(401).json({
                message: "Invalid or expired token",
            });
        }
    } catch (error: any) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};
