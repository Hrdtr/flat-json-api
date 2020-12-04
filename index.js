const express = require("express");
const app = express();
// This line is required to parse the request body
app.use(express.json());

// Importing product utility function
const product = require("./utils");

/* Create - POST method */
app.post("/product", (req, res) => {
  // Get existing data
  const data = product.get();
  // Get data from request
  const newData = req.body;
  // Check for missing field value
  if (
    newData.code == null ||
    newData.name == null ||
    newData.photos == null ||
    newData.category == null ||
    newData.description == null ||
    newData.price == null
  ) {
    return res
      .status(406)
      .send({ error: true, msg: "(Some) Required data missing" });
  }

  // Check for data conflict
  const findExist = data.products.find((d) => d.code === newData.code);
  if (findExist) {
    return res
      .status(409)
      .send({ error: true, msg: "Product code already exist" });
  }
  // Append the data
  data.products.push(newData);
  // Save the new data
  product.save(data);
  res.send({ success: true, msg: "Product data added successfully" });
});

/* Read - GET method */
app.get("/product", (req, res) => {
  const data = product.get();
  res.send(data.products);
});

/* Read One - GET method */
app.get("/product/:code", (req, res) => {
  const data = product.get();
  // Get request parameter
  const code = req.params.code;
  // Check for data avaibility
  const findExist = data.products.find((d) => d.code === code);
  if (!findExist) {
    return res.status(404).send({ error: true, msg: "Product not exist" });
  }
  // filter the data
  const filteredData = data.products.filter((d) => d.code !== code);
  res.send(filteredData[0]);
});

/* Update - PATCH method */
app.patch("/product/:code", (req, res) => {
  // Get request parameter
  const code = req.params.code;
  // Get data from request
  const updateData = req.body;
  // Get the existing data
  const data = product.get();
  // Check for data avaibility
  const findExist = data.products.find((d) => d.code === code);
  if (!findExist) {
    return res.status(404).send({ error: true, msg: "Product not exist" });
  }
  // filter the data
  const filteredData = data.products.filter((d) => d.code !== code);
  // Push the updated data
  filteredData.push(updateData);
  // Save data
  const dataUpdated = {
    ...data,
    products: filteredData,
  };
  product.save(dataUpdated);
  res.send({ success: true, msg: "Product data updated successfully" });
});

/* Delete - DELETE method */
app.delete("/product/:code", (req, res) => {
  const code = req.params.code;
  // Get existing data
  const data = product.get();
  // filter data to remove
  const filteredData = data.filter((d) => d.code !== code);
  if (data.length === filteredData.length) {
    return res.status(409).send({ error: true, msg: "Data does not exist" });
  }
  // Save the final data
  product.save(filteredData);
  res.send({ success: true, msg: "Data removed successfully" });
});

//configure the server port
app.listen(3000, () => {
  console.log("Server runs on port 3000");
});
