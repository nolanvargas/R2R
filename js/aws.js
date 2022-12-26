import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import {
  DynamoDBClient,
  ScanCommand,
  GetItemCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";

const client = new DynamoDBClient({
  region: "us-west-2",
  credentials: fromCognitoIdentityPool({
    client: new CognitoIdentityClient({ region: "us-west-2" }),
    identityPoolId: "us-west-2:a5938208-e53f-4ba8-a4d8-70eb05172dbf",
  }),
});

export default class Db {
  async getTableContents(tableName) {
    try {
      return await client.send(new ScanCommand({ TableName: tableName }));
    } catch (err) {
      return err;
    }
  }

  async addClient(credentials) {
    const request = {
      PutItem: {
        TableName: "users",
        Item: {
          id: { N: "1" },
          name: { S: "John Doe" },
          age: { N: "35" },
        },
      },
    };
    try {
      // Write the item to the table
      const response = await client.send(request);
    } catch (err) {
      return err;
    }
  }

  async validateClient(username) {
    const params = {
      TableName: "users",
      Key: {
        username: { S: username },
      },
    };
    const getItemCommand = new GetItemCommand(params);
    client
      .send(getItemCommand)
      .then((data) => {
        // The item was retrieved successfully, and the result is available in the "data" variable
        return data;
      })
      .catch((err) => {
        // Handle any errors that occurred
        console.error(err);
      });
  }
}
