import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
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
}
