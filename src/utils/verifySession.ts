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
};
const publicKey = userConfig.Get("clerk_pem");
export function verifyJWT(token: string | undefined): boolean {
	if (token === undefined) {
		return false;
	}
	const decoded = jwt.verify(token, publicKey, {
		algorithms: ["RS256"],
	}) as Token;
	if (decoded.azp === "http://localhost:5173") {
		return true;
	}

	return false;
}
