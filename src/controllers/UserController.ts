import Logger from "../utils/Logger";
import StatusCode from "../utils/StatusCode";
import { Request, Response, NextFunction } from "express";
import passport from "passport";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel";
import { CreateUser, ReadUser } from "../interface/User";

const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;
        if (username && email && password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const newUser: CreateUser = {
                username: username,
                email: email,
                password: hashedPassword,
            };
            const user = new UserModel(newUser);
            const dbResponse = await user.save();
            Logger.info(dbResponse);
            Logger.http("New user registered in the database:" + dbResponse);
            res.status(StatusCode.CREATED).send({
                message: "Created new user in the database.",
                body: dbResponse,
            });
        } else {
            Logger.error("Creating new user failed! 🤕");
            res.status(StatusCode.BAD_REQUEST).send({
                user: "Failed when trying to create new user; either username, email or password is missing.",
            });
        }
    } catch (error) {
        Logger.error("Could not create new user: " + error);
        res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
            error: "Something went wrong when trying to create new user.",
        });
    }
}

const login = async (req: Request, res: Response) => {
    try {
        const { username, password, rememberMe } = req.body;
        console.log(username, password, 'rememberMe?', rememberMe);
        if (username && password) {
            const user = await UserModel.findOne({ username: username });
            if (user) {
                const validPassword = await bcrypt.compare(password, user.password);
                if (validPassword) {
                    const token = jwt.sign(
                        { _id: user._id, username: user.username },
                        process.env.TOKEN_SECRET || "secretToken",
                        { expiresIn: rememberMe ? "7d" : "1d" }
                    );
                    user.token = token;
                    await user.save();
                    res.header("auth-token", token).send({
                        message: "User logged in successfully.",
                        username: user.username,
                        token: token,
                    });
                } else {
                    res.status(StatusCode.BAD_REQUEST).send("Invalid password");
                }
            } else {
                res.status(StatusCode.BAD_REQUEST).send("Invalid username");
            }
        } else {
            res.status(StatusCode.BAD_REQUEST).send("Username or password is missing");
        }
    } catch (error) {
        Logger.error("Could not login user: " + error);
        res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
            error: "Something went wrong when trying to login user.",
        });
    }
}

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await UserModel.find();
        res.status(StatusCode.OK).send(users);
    } catch (error) {
        Logger.error("Could not get all users: " + error);
        res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
            error: "Something went wrong when trying to get all users.",
        });
    }
}

// const getUserByUsername = async (req: Request, res: Response, next: NextFunction) => {
//     Logger.info("Get user by username:");
//     try {
//         const { username } = req.params;
//         if (username) {
//             const user = await UserModel.findOne({ username: username });
//             if (user) {
//                 res.status(StatusCode.OK).send(user);
//             }
//         } else {
//             res.status(StatusCode.BAD_REQUEST).send("Username is missing");
//         }
//     } catch (error) {
//         Logger.error("Could not get user: " + error);
//         res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
//             error: "Something went wrong when trying to get user by username.",
//         });
//     }
// }

const getUserByUsername = async (req: Request, res: Response) => {
    if (req.headers.authorization?.startsWith("Bearer ")) {
        const authUser = req.headers.authorization.split(" ")[1];
        jwt.verify(authUser as string, process.env.TOKEN_SECRET || "secretToken", async (err, decoded) => {
            if (err) {
                res.status(StatusCode.UNAUTHORIZED).send("Invalid token");
            } else {
                try {
                    const username = req.params.username;
                    const user = await UserModel.findOne({ username: username });
                    if (user) {
                        res.status(StatusCode.OK).send(user);
                    } else {
                        res.status(StatusCode.NOT_FOUND).send("User not found");
                    }
                } catch (error) {
                    Logger.error("Could not get user by username: " + error);
                    res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
                        error: "Something went wrong when trying to get user by username.",
                    });
                }
            }
        })
    } else {
        res.status(StatusCode.UNAUTHORIZED).send("No token provided");
    }
}

export default {
    register,
    login,
    getAllUsers,
    getUserByUsername,
}