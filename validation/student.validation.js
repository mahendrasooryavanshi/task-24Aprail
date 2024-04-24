const Joi = require("joi");
const studentValidation = async (req, res, next) => {
  try {
    const studentValidation = async (body) => {
      const joiSchema = await Joi.object({
        categoryName: Joi.string().required().messages({
          "any.required": "categoryName  is required.",
          "string.empty": "categoryName cannot be empty.",
        }),
        productName: Joi.string().required().messages({
          "any.required": "productName  is required.",
          "string.empty": "productName cannot be empty.",
        }),
        productBarcode: Joi.string().required().messages({
          "any.required": "productBarcode  is required.",
          "string.empty": "productBarcode cannot be empty.",
        }),
        productSku: Joi.string().required().messages({
          "any.required": "productSku  is required.",
          "string.empty": "productSku cannot be empty.",
        }),

        productColor: Joi.string().required().messages({
          "any.required": "productColor  is required.",
          "string.empty": "productColor cannot be empty.",
        }),
        productSize: Joi.string().required().messages({
          "any.required": "productSize  is required.",
          "string.empty": "productSize cannot be empty.",
        }),
        productPrice: Joi.string().required().messages({
          "any.required": "productPrice  is required.",
          "string.empty": "productPrice cannot be empty.",
        }),
      });
      return joiSchema.validate(body, {
        errors: { wrap: { label: "" } },
      });
    };
    const validation = await studentValidation(req.body);
    let response = {};
    if (validation.error) {
      let { details } = validation.error;
      const message = details.map((i) => i.message).join(", ");
      response.message = message;
      response.statusCode = 422;
      response.error = "ValidationError";
      return res.json(response);
    } else {
      next();
    }
  } catch (error) {
    console.log("validation error", error);
  }
};

module.exports = { studentValidation };
