import internalServerError from "./../../../framework/helpers/internalServerError.js";
import {models} from "./../../../framework/database/connection.js";
import Model from "./../../../framework/model/model.js";
import moment from "moment";
import bcrypt from "bcrypt-nodejs";
import createJwtToken from "./../../../framework/security/createJwtToken.js";
import {get} from "lodash";
import validations from "./validations.js";
import validate from "./../../../framework/validations/validate.js";
import statusCodes from "./../../../framework/helpers/statusCodes";


let forgetPasswordModel = new Model({
	models: models,
	tableName: "forgetpassword"
});

let userModel = new Model({
  models: models,
  tableName: "user"
});

export default {
  requestPasswordReset: async (args,req,schema) => {
    try {
      let v = await validate(validations.requestPasswordReset,args,{abortEarly: false});
			let {success} = v;
			if (!success) {
				return {
					errors: v.errors,
					statusCode: statusCodes.BAD_REQUEST.type,
					statusCodeNumber: statusCodes.BAD_REQUEST.number
				}
      }
      let user = await userModel.findOne({email: args.email});
      if (!user) {
        return {
          statusCode: statusCodes.NOT_FOUND.type,
          statusCodeNumber: statusCodes.NOT_FOUND.number,
          errors: ["User not found"]
        }
      }
      let token = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2)
      await forgetPasswordModel.create({
        token: token,
        email: args.email,
        expireDate: `${moment().add('30','minutes').valueOf()}`
      });
      return {
        successMessageType: "Successfull",
        successMessage:  "Please check your email. We have sent a link to reset your email",
        statusCode: statusCodes.CREATED.type
      };      
    } catch (e) {
      return internalServerError(e);
    }
  },
  resetPassword: async (args,req,schema) => {
    try {
      let v = await validate(validations.resetPassword,args,{abortEarly: false});
			let {success} = v;
			if (!success) {
				return {
					errors: v.errors,
					statusCode: statusCodes.BAD_REQUEST.type,
					statusCodeNumber: statusCodes.BAD_REQUEST.number
				}
      }
      let forgetPassword = await forgetPasswordModel.findOne({token: args.token});
      if (!forgetPassword) {
        return {
					errors: ["Token expired or not found."],
					statusCode: statusCodes.NOT_FOUND.type,
					statusCodeNumber: statusCodes.NOT_FOUND.number
				}
      }
      let user = await userModel.findOne({email: forgetPassword.email});
      if (!forgetPassword) {
        return {
					errors: ["User not found."],
					statusCode: statusCodes.NOT_FOUND.type,
					statusCodeNumber: statusCodes.NOT_FOUND.number
				}
      }
      let hash = bcrypt.hashSync(args.password);
      await user.update({
        password: hash
      });
      await forgetPassword.destroy();
      return {
        successMessageType: "Success",
        successMessage: "Password successfully changed",
        statusCode: statusCodes.OK.type,
        statusCodeNumber: statusCodes.OK.number
      }
    } catch (e) {
      return internalServerError(e);
    }
  },
  forgetPassword: async (args,req,schema) => {
    try {
      let v = await validate(validations.forgetPassword,args,{abortEarly: false});
			let {success} = v;
			if (!success) {
				return {
					errors: v.errors,
					statusCode: statusCodes.BAD_REQUEST.type,
					statusCodeNumber: statusCodes.BAD_REQUEST.number
				}
      }
      let forgetPassword = await forgetPasswordModel.findOne({token: args.token});
      if (!forgetPassword) {
        return {
					errors: ["Token expired or not found."],
					statusCode: statusCodes.NOT_FOUND.type,
					statusCodeNumber: statusCodes.NOT_FOUND.number
				}
      }
      forgetPassword.successMessageType = "Successfull";
      forgetPassword.successMessage =  "Forget password item";
      forgetPassword.statusCode = statusCodes.OK.type;
      forgetPassword.statusCodeNumber = statusCodes.OK.number;
      return forgetPassword;
    } catch (e) {
      return internalServerError(e);
    }
  }
}