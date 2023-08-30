const sdk = require('api')('@mintology/v1.0#1azgq1qlluxyztq');


async function mint(imageUrl: string, name: string, walletAddress: string, projectId: string) {
  try {
    sdk.auth(process.env.MINTABLE_API_KEY as string);
    sdk.server(process.env.SERVER_URL as string);

    const res = await sdk.mintMint(
      {
        metadata: {
          name: name,
          image: imageUrl,
          //animation_url: 'string',
          // description: 'string',
          //attributes: [{ trait_type: "bored", value: "hello" }],
          //title: "Geeks",
          //subtitle: 'string'
        },
        wallet_address: walletAddress,
      },
      {
        projectId: projectId,
      }
    );

    return {
      statusCode: 200,
      body: res.data,
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: err,
    };
  }
}

export { mint };
