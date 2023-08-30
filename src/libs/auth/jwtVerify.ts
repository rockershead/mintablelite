import jwt from 'jsonwebtoken';
import { APIGatewayProxyHandler,APIGatewayProxyEvent,APIGatewayProxyResult } from 'aws-lambda'

async function jwtVerifyRefreshToken(token: string, refreshKey: string) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, refreshKey, (err: jwt.VerifyErrors | null, payload: any) => {
      if (err) {
        resolve({
          message: "Invalid Token",
        });
      } else {
        resolve(payload);
      }
    });
  }) as Promise<{ message: string } | jwt.JwtPayload>;
}

async function jwtVerifyAccessToken(token: string, privateKey: string) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, privateKey, (err: jwt.VerifyErrors | null, payload: any) => {
      if (err) {
        resolve({
          message: "Invalid Token",
        });
      } else {
        resolve(payload);
      }
    });
  }) as Promise<{ message: string } | jwt.JwtPayload>;
}

async function authenticate(event: APIGatewayProxyEvent) {
  // Read the token from header
  const token = event.headers.Authorization.replace("Bearer ", "");

  const jwtPrivateKey = process.env.JWT_PRIVATE_KEY as string;
  const payload = await jwtVerifyAccessToken(token, jwtPrivateKey);
  if ("message" in payload) {
    return payload.message;
  } else {
    return payload;
  }
}

export { authenticate };
