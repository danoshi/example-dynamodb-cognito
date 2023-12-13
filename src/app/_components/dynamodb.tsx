"use client";
import { DynamoDB } from "aws-sdk";
import { useState } from "react";

const dynamodb = new DynamoDB({
  region: "eu-central-1",
  accessKeyId: "accesskey",
  secretAccessKey: "secretkey",
});

const getAllDynamoDBItems = () => {
  const params = {
    TableName: "TestTable",
  };

  return new Promise<any[]>((resolve, reject) => {
    dynamodb.scan(params, (err, data) => {
      if (err) {
        console.error("Unable to read items", err);
        reject(err);
      } else {
        console.log("Items read successfully", data);
        resolve(data?.Items ?? []);
      }
    });
  });
};

const DynamoDBOperations = () => {
  const [value, setValue] = useState("");
  const [items, setItems] = useState<any[]>([]);

  const getAllItems = () => {
    getAllDynamoDBItems()
      .then((fetchedItems: any[]) => {
        setItems(fetchedItems);
      })
      .catch((error) => {
        console.error("Error retrieving items:", error);
      });
  };
  const handleCreate = () => {
    const params = {
      TableName: "TestTable",
      Item: {
        Id: { S: "UNIQUE_ID" },
        AttributeName: { S: value },
      },
    };

    dynamodb.putItem(params, (err, data) => {
      if (err) {
        console.error("Unable to add item", err);
      } else {
        console.log("Item added successfully", data);
      }
    });
  };

  const handleUpdate = () => {
    const params = {
      TableName: "TestTable",
      Key: {
        Id: { S: "UNIQUE_ID" },
      },
      UpdateExpression: "SET AttributeName = :val",
      ExpressionAttributeValues: {
        ":val": { S: value },
      },
    };

    dynamodb.updateItem(params, (err, data) => {
      if (err) {
        console.error("Unable to update item", err);
      } else {
        console.log("Item updated successfully", data);
      }
    });
  };

  const handleDelete = () => {
    const params = {
      TableName: "TestTable",
      Key: {
        Id: { S: "UNIQUE_ID" },
      },
    };

    dynamodb.deleteItem(params, (err, data) => {
      if (err) {
        console.error("Unable to delete item", err);
      } else {
        console.log("Item deleted successfully", data);
      }
    });
  };

  return (
    <div>
      <input
        type="text"
        className="bg-sky-500"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <br />
      <button
        className="border-2 border-solid border-sky-500"
        onClick={handleCreate}
      >
        Create
      </button>
      <br />
      <button
        className="border-2 border-solid border-sky-500"
        onClick={handleUpdate}
      >
        Update
      </button>
      <br />
      <button
        className="border-2 border-solid border-sky-500"
        onClick={handleDelete}
      >
        Delete
      </button>
      <br />
      <button
        className="border-2 border-solid border-sky-500"
        onClick={getAllItems}
      >
        Get All Items
      </button>
      <br />
      <div>
        <h3>All Items:</h3>
        <ul>
          {items.map((item, index) => (
            <li key={index}>{JSON.stringify(item)}</li>
          ))}
        </ul>
      </div>
      <br />
    </div>
  );
};

export default DynamoDBOperations;
