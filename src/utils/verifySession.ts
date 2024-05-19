import jwt from "jsonwebtoken";
import { userConfig } from "./config";

type Token = {
	azp: string;
	exp: number;
	iat: number;
	iss: string;
	nbf: number;
	sid: string;
	sub: string;
	userId: string;
};
const publicKey = userConfig.Get("clerk_pem");
export function verifyJWT(token: string | undefined): {
	verified: boolean;
	object?: Token;
} {
	if (token === undefined) {
		return { verified: false };
	}
	const decoded = jwt.verify(token, publicKey, {
		algorithms: ["RS256"],
	}) as Token;
	if (decoded.azp === "http://localhost:5173") {
		return { verified: true, object: decoded };
	}
	return { verified: false };
}
