import type { AWS } from '@serverless/typescript';


const register = {
  handler: 'src/functions/index.register',
  events: [
    {
      http: {
        summary: 'Registration of new users',
        path: '/register',
        method: 'post',
        private: true,
        cors: {
          origin: '*',
          headers: ['x-api-key', 'Content-Type'],
          allowCredentials: false,
        },
        requestBody: {
          content: {
            'application/json': {
              schema: {
                // Define the schema for the request body here
                type: 'object',
                properties: {
                  username: { type: 'string' },
                  password: { type: 'string' },
                  walletAddress:{type:'string'}
                },
                required: ['username', 'password','walletAddress'],
              },
            },
          },
        },
      },
    },
  ],
};

const login = {
  handler: 'src/functions/index.login',
  events: [
    {
      http: {
        path: '/login',
        method: 'post',
        private: true,
        cors: {
          origin: '*',
          headers: ['x-api-key', 'Content-Type'],
          allowCredentials: false,
        }
       
      },
    },
  ],
};
const createCollection={
  handler: 'src/functions/index.createCollection',
  events: [
    {
      http: {
        path: '/collection',
        method: 'post',
        private: true,
        cors: {
          origin: '*',
          headers: ['x-api-key', 'Content-Type'],
          allowCredentials: false,
        }
       
      },
    },
  ],

}

const createNft={
  handler: 'src/functions/index.createNft',
  events: [
    {
      http: {
        path: '/nft/{id}',
        method: 'post',
        private: true,
        cors: {
          origin: '*',
          headers: ['x-api-key', 'Content-Type'],
          allowCredentials: false,
        }
       
      },
    },
  ],
}

const listNftTokens={
  handler: 'src/functions/index.listNftTokens',
  events: [
    {
      http: {
        path: '/nft/{id}',
        method: 'get',
        private: true,
        cors: {
          origin: '*',
          headers: ['x-api-key', 'Content-Type'],
          allowCredentials: false,
        }
       
      },
    },
  ],

}

const showNftToken={

  handler: 'src/functions/index.showNftToken',
  events: [
    {
      http: {
        path: 'nfts/{collectionId}/tokens/{tokenId}',
        method: 'get',
        private: true,
        cors: {
          origin: '*',
          headers: ['x-api-key', 'Content-Type'],
          allowCredentials: false,
        }
       
      },
    },
  ],

}

const listCollections={
  handler: 'src/functions/index.listCollections',
  events: [
    {
      http: {
        path: 'nft',
        method: 'get',
        private: true,
        cors: {
          origin: '*',
          headers: ['x-api-key', 'Content-Type'],
          allowCredentials: false,
        }
       
      },
    },
  ],

}


const serverlessConfiguration: AWS = {
  service: 'mintablelite-api',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild','serverless-add-api-key','serverless-auto-swagger'],
  custom: {
    apiKeys: [
      {
        name: 'mintablelite_latest_key',
        value: '${file(./serverless.env.yml):staging.API_KEY}',
      },
    ],
    autoSwagger:{
      title:'mintablelite-api',
      apiKeyHeaders: ['Authorization']
    }
  },
  provider: {
    name: 'aws',
    runtime: 'nodejs16.x',
    region: 'ap-southeast-1',
    timeout: 60,
    stage: 'dev',
    vpc: {
      securityGroupIds: ['sg-05fdccb3461a161c1'],
      subnetIds: [
        'subnet-0202572e740c1d36a',
        'subnet-05fe0d23d0233c378',
        'subnet-0ddce2ae621b4d825'
      ],
    },
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      MINTABLE_API_KEY: '${file(./serverless.env.yml):staging.MINTABLE_API_KEY}',
      SERVER_URL: '${file(./serverless.env.yml):staging.SERVER_URL}',
      API_KEY: '${file(./serverless.env.yml):staging.API_KEY}',
      DBURL: '${file(./serverless.env.yml):staging.DBURL}',
      JWT_PRIVATE_KEY: '${file(./serverless.env.yml):staging.JWT_PRIVATE_KEY}',
      JWT_REFRESH_KEY: '${file(./serverless.env.yml):staging.JWT_REFRESH_KEY}',
      PROJECT_ID: '${file(./serverless.env.yml):staging.PROJECT_ID}',
    },
  },
  // import the function via paths
  functions: { register,login,createCollection,createNft,listNftTokens,showNftToken,listCollections},
  package: { individually: true,include: ['ca.pem'] },
  
};

module.exports = serverlessConfiguration;
