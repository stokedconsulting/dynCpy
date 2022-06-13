#! /usr/bin/env node

const { parallelScanAsStream } = require('@shelf/dynamodb-parallel-scan');
const  { DynamoDBClient, BatchWriteItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall } = require("@aws-sdk/util-dynamodb");

(async () => {
  let totalCount = 0;
  let fromTable = process.env.FROM_TABLE;
  let toTable = process.env.TO_TABLE;

  const client = new DynamoDBClient();

  try {
    const stream = await parallelScanAsStream(
      {
        TableName: fromTable
      },
      {concurrency: 1000, chunkSize: 10000, highWaterMark: 10000}
    );

    for await (const items of stream) {
      totalCount += items.length;

      do {
        let batch = items.splice(0, process.env.BATCH_SIZE || 25);

        let batchedItems = batch.map(i => {
          return {
            PutRequest: {
              Item: marshall(i)
            }
          }
        })
        //console.log('batched items', JSON.stringify(batchedItems, null, 4))

        var params = {
          RequestItems: {
            [toTable]: batchedItems
          }
        };
        const command = new BatchWriteItemCommand(params);
        const response = await client.send(command);
      } while(items.length)
    }

  } catch (ex) {
    console.log(ex, ex.message);
  }
  console.log('totalCount', totalCount);
})();
