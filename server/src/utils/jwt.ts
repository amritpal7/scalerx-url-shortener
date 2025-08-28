import { User } from "../../generated";
import jwt from "jsonwebtoken";

const refresh_secret = process.env.REFRESH_TOKEN;
const access_secret = process.env.ACCESS_TOKEN;
export const generateJwtCode = (
  payloadData: Pick<User, "id" | "username">,
  type: "access" | "refresh" = "access",
  options?: jwt.SignOptions | undefined
) => {
  const payload = {
    id: payloadData.id,
    username: payloadData.username,
  };

  const secretKey = type === "access" ? access_secret : refresh_secret;
  if (!secretKey) throw new Error(`${type} token secret is not defined`);
  const expiresIn = type === "access" ? "15m" : "7d";

  return jwt.sign(payload, secretKey, {
    ...(options && options),
    algorithm: "HS256",
    expiresIn,
  });
};

export const verifyJwtCode = (token: string, type: "access" | "refresh") => {
  const secretToken = type === "access" ? access_secret : refresh_secret;
  if (!secretToken) throw new Error("Refresh token secret is not defined");
  try {
    const decoded = jwt.verify(token, secretToken);

    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (error: any) {
    const decoded = jwt.decode(token);
    return {
      valid: false,
      expired: error.message === "jwt expired.",
      decoded,
    };
  }

  // if (
  //   typeof decoded === "object" &&
  //   decoded !== null &&
  //   "id" in decoded &&
  //   "email" in decoded
  // ) {
  //   return decoded as { id: string; email: string };
  // }
  // throw new Error("Invalid token");
};
