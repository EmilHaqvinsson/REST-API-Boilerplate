import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();


const secretToken = process.env.TOKEN_SECRET || "secretToken";
const options = {
    expiresIn: "1d",
};

async function generateJWT(username: string) {
    try {
        const payload = { username };
        const token = await jwt.sign(payload, secretToken, options);
        return { error: false, token };
    } catch (error) {
        return { error: true };
    }
}

export default generateJWT;