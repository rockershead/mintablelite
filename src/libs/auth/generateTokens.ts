import { v4 as uuid } from 'uuid';
import jwt from 'jsonwebtoken';
import * as moment from 'moment';

async function generateToken(type: 'access' | 'refresh', userId: string) {
  let JTI = uuid();

  const jwtPrivateKey = process.env.JWT_PRIVATE_KEY as string;
  const jwtRefreshKey = process.env.JWT_REFRESH_KEY as string;

  if (type === 'access') {
    const result = jwt.sign(
      {
        auth_time: moment.unix,
        userId: userId,
        accessJTI: JTI,
        token_use: 'access',
      },
      jwtPrivateKey,
      { expiresIn: '1h' }
    );
    // update db;

    return { accessToken: result, accessJTI: JTI };
  } else if (type === 'refresh') {
    const result = jwt.sign(
      {
        userId: userId,
        refreshJTI: JTI,
      },
      jwtRefreshKey,
      { expiresIn: '30d' }
    );

    return { refreshToken: result, refreshJTI: JTI };
  } else {
    return {
      message: 'Invalid Token',
    };
  }
}

async function generateTokens(user: { _id: string }) {
  const { accessToken, accessJTI } = await generateToken('access', user._id);
  const { refreshToken } = await generateToken('refresh', user._id);

  return {
    accessToken,
    refreshToken,
  };
}

export { generateTokens };
