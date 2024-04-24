const fs = require("fs");
const { parse } = require("fast-csv");
const productService = require("../services/student.service");
const { Parser } = require("json2csv");

const controller = {
  create: async (req, res) => {
    let categoryName = req.body.categoryName ? req.body.categoryName : "";
    let productName = req.body.productName ? req.body.productName : "";
    let productBarcode = req.body.productBarcode ? req.body.productBarcode : "";
    let productSku = req.body.productSku ? req.body.productSku : "";
    let productColor = req.body.productColor ? req.body.productColor : "";
    let productSize = req.body.productSize ? req.body.productSize : "";
    let productPrice = req.body.productPrice ? req.body.productPrice : "";

    try {
      let data = {
        categoryName,
        productName,
        productBarcode,
        productSku,
        productColor,
        productSize,
        productPrice,
      };
      let response = {};
      const isProductName = await productService.findOne({
        productName: productName,
        deleted_at: null,
      });
      if (isProductName) {
        response.error = "Duplicate_ProductName";
        response.message = "product name can't be duplicate";
        return res.json(response);
      }
      const isProductBarcode = await productService.findOne({
        productBarcode: productBarcode,
        deleted_at: null,
      });
      if (isProductBarcode) {
        response.error = "Duplicate_productBarcode";
        response.message = "barcode name can't be duplicate";
        return res.json(response);
      }
      let result = await productService.create(data);
      console.log(result);
      if (!result) {
        response.statusCode = 504;
        response.errorMsg = "Something_Went_wrong";
        response.message = "something went wrong on server";
        return res.json(response);
      }
      response.statusCode = 201;
      response.status = "success";
      response.result = result;
      return res.json(response);
    } catch (error) {
      console.log(error);
    }
  },
  products: async (req, res) => {
    let response = {};
    try {
      let procuctList = await productService.procuctList({ deleted_at: null });
      if (procuctList.length < 0) {
        response.statusCode = 504;
        response.error = "Something_went_wrong";
        response.message = "Something went wrong on server ";
        return res.json(response);
      }
      return res.json({ procuctList: procuctList });
    } catch (error) {
      console.log(error);
    }
  },
  update: async (req, res) => {
    let categoryName = req.body.categoryName ? req.body.categoryName : "";
    let productName = req.body.productName ? req.body.productName : "";
    let productBarcode = req.body.productBarcode ? req.body.productBarcode : "";
    let productSku = req.body.productSku ? req.body.productSku : "";
    let productColor = req.body.productColor ? req.body.productColor : "";
    let productSize = req.body.productSize ? req.body.productSize : "";
    let productPrice = req.body.productPrice ? req.body.productPrice : "";
    let id = req.params.productId ? req.params.productId : "";

    let response = {};
    try {
      let where = {
        id: id,
        deleted_at: null,
      };
      let isProduct = await productService.findOne(where);
      if (!isProduct) {
        response.statusCode = 404;
        response.error = "Not_found";
        response.message = "Product id is not found....";
        return res.json(response);
      }
      let updateData = {
        updatedAt: new Date(),
      };
      if (categoryName !== "") {
        updateData.categoryName = categoryName;
      }
      if (productName !== "") {
        updateData.productName = productName;
      }
      if (productBarcode !== "") {
        updateData.productBarcode = productBarcode;
      }
      if (productSku !== "") {
        updateData.categoryName = productSku;
      }
      if (productColor !== "") {
        updateData.productColor = productColor;
      }
      if (productSize !== "") {
        updateData.productColor = productColor;
      }
      if (productPrice !== "") {
        updateData.productPrice = productPrice;
      }
      const update = await productService.update(updateData, where);
      if (!update) {
        response.statusCode = 504;
        response.error = "server error";
        response.message = "something went wrong on server";
        return res.json(response);
      }
      response.statusCode = 201;
      response.status = "Success";
      response.message = "product updated successfully";
      return res.json(response);
    } catch (error) {
      console.log(error);
    }
  },
  delete: async (req, res) => {
    let response = {};
    let productId = req.params.productId ? req.params.productId : "";
    try {
      let isProduct = await productService.findOne(where);
      if (!isProduct) {
        response.statusCode = 404;
        response.error = "Not_found";
        response.message = "Product id is not found....";
        return res.json(response);
      }
      let where = { id: productId, deletedAt: null };
      let update = { deletedAt: new Date() };
      const deleteProduct = await productService.update(update, where);
      if (!deleteProduct) {
        response.statusCode = 504;
        response.error = "server error";
        response.message = "something went wrong on server";
        return res.json(response);
      }
      response.statusCode = 201;
      response.status = "Success";
      response.message = "product deleted successfully";
      return res.json(response);
    } catch (error) {
      console.log(error);
    }
  },
  // csv file related logics_____________________
  upload: async (req, res) => {
    try {
      if (req.file == undefined) {
        return res.status(400).json("Please upload a CSV file!");
      }
      let upload = [];
      let path = req.file.path;

      let result = await fs
        .createReadStream(path)
        .pipe(parse({ headers: true }))
        .on("error", (error) => {
          throw error.message;
        })
        .on("data", async (row) => {
          console.log(row);
          upload.push(row);
          await productService.upload(upload);
        });
      if (!result) {
        return res.json({ message: "something went wrong" });
      }
      return res.json({ msg: "file uploaded successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Could not upload the file: " + req.file.originalname,
      });
    }
  },
  createCSV: async (req, res) => {
    try {
      let results = [];
      let result = await productService.procuctList({ deletedAt: null });
      result.forEach((element) => {
        results.push(element.dataValues);
      });
      let json2Csvparser = new Parser();
      const csv = json2Csvparser.parse(results);
      fs.writeFileSync("productsInformation.csv", csv, (error) => {
        if (error) {
          console.log(error);
        } else {
          console.log("file saved");
        }
      });
      return res.json({ msg: "file exported success" });
    } catch (error) {
      console.log(error);
    }
  },
};
module.exports = controller;
