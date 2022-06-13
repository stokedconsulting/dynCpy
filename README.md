# dynCpy
by Brian Stoker

## Copy all the data from one dynamodb table to another as quick as possible

### Version: 0.1.0
basic functionality using npm link and environment variables

### Dependencies: 
* @aws-sdk/client-dynamodb,
* @aws-sdk/lib-dynamodb,
* @shelf/dynamodb-parallel-scan,

### Install

```bash
npm i dyncpy -g
```

### Example

```bash
FROM_TABLE=source-table TO_TABLE=destination-table dynCpy
```

[MIT license](LICENSE)
