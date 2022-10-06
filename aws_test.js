import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import {
  DynamoDBClient,
  ListTablesCommand,
  GetItemCommand,
} from "@aws-sdk/client-dynamodb";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";

(async () => {
  const client = new DynamoDBClient({
    region: "us-west-2",
    credentials: fromCognitoIdentityPool({
      client: new CognitoIdentityClient({ region: "us-west-2" }),
      identityPoolId: "us-west-2:a5938208-e53f-4ba8-a4d8-70eb05172dbf",
    }),
  });

  //const command = new ListTablesCommand({});

  try {
    const params = {
      TableName: "games",
      Key: {
        game_id: { N: "1" },
      },
    };

    const data = await client.send(new GetItemCommand(params));

    //const results = await client.send(command);

    console.log(data);
    console.log(data.Item.game_name.S);
    document.getElementById("content").innerHTML = data.Item.game_name.S;
  } catch (err) {
    console.error(err);
  }
})();
