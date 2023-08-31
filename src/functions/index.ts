import { APIGatewayProxyHandler,APIGatewayProxyEvent,APIGatewayProxyResult } from 'aws-lambda';
import { hashPassword,generateTokens,authenticate } from '../libs/auth';
import { mongoConnect } from '../libs/database';
import User from '../models/User';
import {Nft,IToken,Token} from '../models/Nft';
import { mint } from '../libs/nft';
import * as bcrypt from 'bcryptjs';
let metaData = {
  headers: {
    "Access-Control-Allow-Origin": "*",   //need to restrict
  },
};

export const register = async (event: APIGatewayProxyEvent) => {
  
  try {
    await mongoConnect();
    
    const body = JSON.parse(event.body);
    
    const { email, password, walletAddress } = body;
    const _password = await hashPassword(password);

    
    
    // Check if user exists
    const user = await User.findOne({ email: email });
    console.log(user)
    if (user) {
      return {
        ...metaData,
        statusCode: 400,
        body: JSON.stringify({
          message: 'This user already exists.',
        }),
      };
    }

    const newUser = new User({
      email: email,
      password: _password,
      walletAddress: walletAddress,
    });

    const savedUser = await newUser.save();

    return {
      ...metaData,
      statusCode: 200,
      body: JSON.stringify(savedUser),
    };
  } catch (err) {
    return {
      ...metaData,
      statusCode: 500,
      body: JSON.stringify({
        message: err,
      }),
    };
  }
};



export const login = async (
    event: APIGatewayProxyEvent
  ) => {
   
    try {
      await mongoConnect();
      const body = JSON.parse(event.body || '');
      const { email, password } = body;
      
  
      const user = await User.findOne({ email: email });
  
      if (user) {
        const isMatchedPassword = await bcrypt.compare(password, user.password || '');
  
        if (!isMatchedPassword) {
          return {
            ...metaData,
            statusCode: 400,
            body: JSON.stringify({
              message: 'Incorrect email or password',
            }),
          };
        }
  
        const { accessToken, refreshToken } = await generateTokens(user);
  
        return {
          ...metaData,
          statusCode: 200,
          body: JSON.stringify({
            userId: user._id,
            accessToken: accessToken,
            refreshToken: refreshToken,
          }),
        };
      } else {
        return {
          ...metaData,
          statusCode: 400,
          body: JSON.stringify({
            message: 'Incorrect email or password',
          }),
        };
      }
    } catch (err) {
      return {
        ...metaData,
        statusCode: 500,
        body: JSON.stringify({
          message: err,
        }),
      };
    }
  };

export const createCollection = async (
    event: APIGatewayProxyEvent
  ) => {
    console.log(event)
    const payload = await authenticate(event);
    
    
    if (payload.userId) {
      try {
        const { userId } = payload;
        await mongoConnect();
        const body = JSON.parse(event.body || '');
        const { collectionName } = body;
  
        const collection = await Nft.findOne({
          userId: userId,
          collectionName: collectionName,
        });
  
        if (collection) {
          return {
            ...metaData,
            statusCode: 400,
            body: JSON.stringify({
              message: 'This collection name exists. Please choose another collection name',
            }),
          };
        }
  
        const newCollection = new Nft({
          userId: userId,
          collectionName: collectionName,
        });
  
        const savedCollection = await newCollection.save();
  
        // Save in user collection also
        const user = await User.findOne({ _id: userId });
        const collections = user.collectionIds;
        collections.push(savedCollection._id);
        user.collectionIds = collections;
        await user.save();
  
        return {
          ...metaData,
          statusCode: 200,
          body: JSON.stringify(savedCollection),
        };
      } catch (err) {
        return {
          ...metaData,
          statusCode: 500,
          body: JSON.stringify({
            message: err,
          }),
        };
      }
    } else {
      return {
        ...metaData,
        statusCode: 500,
        body: JSON.stringify({
          message: 'Not authorized',
        }),
      };
    }
  };

export const listCollections = async (event: APIGatewayProxyEvent) => {
    try {
      const payload = await authenticate(event);
      
  
      if (!payload.userId) {
        return {
          ...metaData,
          statusCode: 500,
          body: JSON.stringify({
            message: 'Not authorized',
          }),
        };
      }
  
      const { userId } = payload;
  
      await mongoConnect();
  
      const nftCollections = await Nft.find({
        
        userId: userId,
      });
  
      
     console.log(nftCollections);
      
  
      return {
        ...metaData,
        statusCode: 200,
        body: JSON.stringify(nftCollections),
      };
    } catch (err) {
      return {
        ...metaData,
        statusCode: 500,
        body: JSON.stringify({
          message: err instanceof Error ? err.message : err,
        }),
      };
    }
  }

export const createNft = async (
    event: APIGatewayProxyEvent
  ) => {
    const body = JSON.parse(event.body || '');
    const collectionId = event.pathParameters?.id;
  
    const payload = await authenticate(event);
    if (payload.userId) {
      try {
        await mongoConnect();
        const { userId } = payload;
        const { name, imageUrl, walletAddress } = body;
  
        const nftCollection = await Nft.findOne({
          _id: collectionId,
          userId: userId,
        });
  
        if (!nftCollection) {
          return {
            ...metaData,
            statusCode: 400,
            body: JSON.stringify({
              message: 'Collection does not exist for this user',
            }),
          };
        }
  
        const res = await mint(
          imageUrl,
          name,
          walletAddress,
          process.env.PROJECT_ID as string
        );
        console.log(res);
  
        // Update nft collection
        const tokenId = res.body.data.token_id;
        console.log(tokenId);
        const token: IToken = new Token({
          _id: tokenId,
          name: name,
          imageUrl: imageUrl,
          createdAt: new Date(),
        });
        const tokens = nftCollection.tokens;
        tokens.push(token);
        nftCollection.tokens = tokens;
        await nftCollection.save();
  
        const response: APIGatewayProxyResult = {
          ...metaData,
          statusCode: res.statusCode,
          body: JSON.stringify(res.body),
        };
  
        return response;
      } catch (err) {
        return {
          ...metaData,
          statusCode: 500,
          body: JSON.stringify({ message: 'Error creating nft', err }),
        };
      }
    } else {
      return {
        ...metaData,
        statusCode: 500,
        body: JSON.stringify({
          message: 'Not authorized',
        }),
      };
    }
  };

export const listNftTokens = async (event: APIGatewayProxyEvent) => {
    try {
      const payload = await authenticate(event);
      const collectionId = event.pathParameters?.id;
  
      if (!payload.userId) {
        return {
          ...metaData,
          statusCode: 500,
          body: JSON.stringify({
            message: 'Not authorized',
          }),
        };
      }
  
      const { userId } = payload;
  
      await mongoConnect();
  
      const nftCollection = await Nft.findOne({
        _id: collectionId,
        userId: userId,
      });
  
      if (!nftCollection) {
        return {
          ...metaData,
          statusCode: 400,
          body: JSON.stringify({
            message: 'Collection does not exist for this user',
          }),
        };
      }
  
      const nft = await Nft.findOne({ userId: userId, _id: collectionId });
  
      const tokens = nft?.tokens ?? [];
  
      return {
        ...metaData,
        statusCode: 200,
        body: JSON.stringify(tokens),
      };
    } catch (err) {
      return {
        ...metaData,
        statusCode: 500,
        body: JSON.stringify({
          message: err instanceof Error ? err.message : err,
        }),
      };
    }
  };

export const showNftToken = async (event: APIGatewayProxyEvent) => {
    try {
      const payload = await authenticate(event);
      const { collectionId, tokenId } = event.pathParameters;
  
      if (!payload.userId) {
        return {
          ...metaData,
          statusCode: 500,
          body: JSON.stringify({
            message: 'Not authorized',
          }),
        };
      }
  
      const { userId } = payload;
  
      await mongoConnect();
  
      const nftCollection = await Nft.findOne({
        _id: collectionId,
        userId: userId,
      });
  
      if (!nftCollection) {
        return {
          ...metaData,
          statusCode: 400,
          body: JSON.stringify({
            message: 'Collection does not exist for this user',
          }),
        };
      }
  
      const nft = await Nft.findOne({ userId: userId, _id: collectionId });
  
      const tokens = nft?.tokens ?? [];
      const token = tokens.find((obj) => obj._id === tokenId);
  
      return {
        ...metaData,
        statusCode: 200,
        body: JSON.stringify(token),
      };
    } catch (err) {
      return {
        ...metaData,
        statusCode: 500,
        body: JSON.stringify({
          message: err instanceof Error ? err.message : err,
        }),
      };
    }
  };

