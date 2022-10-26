// //-----------Write------------

// import { PutItemCommand } from "@aws-sdk/client-dynamodb";

// // Set the parameters
// export const params = {
//   TableName: "TABLE_NAME",
//   Item: {
//     CUSTOMER_ID: { N: "001" },
//     CUSTOMER_NAME: { S: "Richard Roe" },
//   },
// };

// export const run = async () => {
//   try {
//     const data = await ddbClient.send(new PutItemCommand(params));
//     console.log(data);
//   } catch (err) {
//     console.error(err);
//   }
// };

// //-----------Update------------

// import { UpdateItemCommand } from "@aws-sdk/client-dynamodb";

// export const params = {
//   TableName: "TABLE_NAME",
//   /*
//     Convert the attribute JavaScript object you are updating to the required
//     Amazon  DynamoDB record. The format of values specifies the datatype. The
//     following list demonstrates different datatype formatting requirements:
//     String: "String",
//     NumAttribute: 1,
//     BoolAttribute: true,
//     ListAttribute: [1, "two", false],
//     MapAttribute: { foo: "bar" },
//     NullAttribute: null
//      */
//   Key: {
//     primaryKey: { ATTRIBUTE_TYPE: "KEY_VALUE" }, // For example, 'Season': {N:2}.
//     sortKey: { ATTRIBUTE_TYPE: "KEY_VALUE" }, // For example,  'Episode': {S: "The return"}; (only required if table has sort key).
//   },
//   // Define expressions for the new or updated attributes
//   UpdateExpression: "set NEW_ATTRIBUTE_NAME_1 = :t, NEW_ATTRIBUTE_NAME_2 = :s", // For example, "'set Title = :t, Subtitle = :s'"
//   ExpressionAttributeValues: {
//     ":t": "NEW_ATTRIBUTE_VALUE_1", // For example ':t' : 'NEW_TITLE'
//     ":s": "NEW_ATTRIBUTE_VALUE_2", // For example ':s' : 'NEW_SUBTITLE'
//   },
//   ReturnValues: "ALL_NEW",
// };
// export const run = async () => {
//   try {
//     const data = await ddbClient.send(new UpdateItemCommand(params));
//     console.log(data);
//     return data;
//   } catch (err) {
//     console.error(err);
//   }
// };

// //-----------Select------------

// import { GetItemCommand } from "@aws-sdk/client-dynamodb";

// // Set the parameters
// export const params = {
//   TableName: "TABLE_NAME", //TABLE_NAME
//   Key: {
//     KEY_NAME: { N: "KEY_VALUE" },
//   },
//   ProjectionExpression: "ATTRIBUTE_NAME",
// };

// export const run = async () => {
//   const data = await ddbClient.send(new GetItemCommand(params));
//   console.log("Success", data.Item);
//   return data;
// };

// //-----------Delete------------

// import { DeleteItemCommand } from "@aws-sdk/client-dynamodb";

// // Set the parameters
// export const params = {
//   TableName: "CUSTOMER_LIST_NEWEST",
//   Key: {
//     CUSTOMER_ID: { N: "1" },
//   },
// };

// export const run = async () => {
//   try {
//     const data = await ddbClient.send(new DeleteItemCommand(params));
//     console.log("Success, item deleted", data);
//     return data;
//   } catch (err) {
//     console.log("Error", err);
//     /*if (err && err.code === "ResourceNotFoundException") {
//       console.log("Error: Table not found");
//     } else if (err && err.code === "ResourceInUseException") {
//       console.log("Error: Table in use");
//     }*/
//   }
// };

// //https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/dynamodb-example-table-read-write.html
