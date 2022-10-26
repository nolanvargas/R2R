import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import {
  DynamoDBClient,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";

export default async function getData() {
  const client = new DynamoDBClient({
    region: "us-west-2",
    credentials: fromCognitoIdentityPool({
      client: new CognitoIdentityClient({ region: "us-west-2" }),
      identityPoolId: "us-west-2:a5938208-e53f-4ba8-a4d8-70eb05172dbf",
    }),
  });

  try {
    const params = {
      TableName: "games",
    };

    const data = await client.send(new ScanCommand(params));

    //const results = await client.send(command);

    console.log(data);
  } catch (err) {
    console.error(err);
  }
}



// (async () => {
//   const client = new DynamoDBClient({
//     region: "us-west-2",
//     credentials: fromCognitoIdentityPool({
//       client: new CognitoIdentityClient({ region: "us-west-2" }),
//       identityPoolId: "us-west-2:a5938208-e53f-4ba8-a4d8-70eb05172dbf",
//     }),
//   });

//   try {
//     const params = {
//       TableName: "games",
//     };

//     const data = await client.send(new ScanCommand(params));

//     //const results = await client.send(command);

//     console.log(data);
//     console.log(data.Item.game_name.S);
//     document.getElementById("content").innerHTML = data.Item.game_name.S;
//   } catch (err) {
//     console.error(err);
//   }
// })();
