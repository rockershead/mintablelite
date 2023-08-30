# mintablelite

This is an API service that is created to help user do 3 main things, create nft,view their nfts created and show details of a nft.
I have integrated the mintology api for the minting part only.The other services involve querying the database and getting the results.The database used here is documentDB and I have deployed the api endpoints using serverless lambda functions and API gateway.

If you are deploying in your own aws account, please remember to have your own serverless.env.yml file.An example of the file is in the repository named serverless.env.example.yml. The list of endpoints are:

POST - https://5f70zzno8d.execute-api.ap-southeast-1.amazonaws.com/dev/register
POST - https://5f70zzno8d.execute-api.ap-southeast-1.amazonaws.com/dev/login
POST - https://5f70zzno8d.execute-api.ap-southeast-1.amazonaws.com/dev/collection
POST - https://5f70zzno8d.execute-api.ap-southeast-1.amazonaws.com/dev/nft/{id}
GET - https://5f70zzno8d.execute-api.ap-southeast-1.amazonaws.com/dev/nft/{id}
GET - https://5f70zzno8d.execute-api.ap-southeast-1.amazonaws.com/dev/nfts/{collectionId}/tokens/{tokenId}
GET - https://5f70zzno8d.execute-api.ap-southeast-1.amazonaws.com/dev/nft


Architecture diagram:


![Mintablelite](https://github.com/rockershead/mintablelite/assets/35405146/93c0e903-3ce3-4009-8eed-16cff4e7be9e)
