let moment = require("moment");
let bcrypt = require("bcrypt-nodejs");
let {ApolloError} =  require("apollo-server");

import internalServerError from "./../../../framework/helpers/internalServerError";
import validations from "./validations";
import validate from "./../../../framework/validations/validate";
import statusCodes from "./../../../framework/helpers/statusCodes";
import {sendEmail} from "./../../../framework/mailer/index";
import allModels from "./../../../framework/dynamic/allModels";

let {forgetPasswordModel, userModel} = allModels;

export default {
  queries: {
    forgetPasswordView: async (_: any, args: any, g: any) => {
      let v = await validate(validations.forgetPassword,args);
      let {success} = v;
      if (!success) {
        throw new ApolloError("Validation error",statusCodes.BAD_REQUEST.number,{list: v.errors})
      }
      try {
        let forgetPassword = await forgetPasswordModel.findOne({token: args.token});
        if (!forgetPassword) {
          throw new ApolloError("Token expired or not found.",statusCodes.NOT_FOUND.number)
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
  },
  mutations: {
    requestPasswordReset: async (_: any, args: any, g: any) => {
      let v = await validate(validations.requestPasswordReset,args);
			let {success} = v;
			if (!success) {
        throw new ApolloError("Validation Errors",statusCodes.BAD_REQUEST.number,{list: v.errors});
      }
      try {
        let user = await userModel.findOne({email: args.email});
        if (!user) {
          throw new ApolloError("User not found", statusCodes.NOT_FOUND.number);
        }
        let token = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2)
        await forgetPasswordModel.create({
          token: token,
          email: args.email,
          expireDate: `${moment().add('30','minutes').valueOf()}`
        });
        await sendEmail('requestPasswordResetToken.hbs',{
          email: args.email,
          returnUrl: process.env.frontendAppUrl,
          token: token,
          frontendAppPasswordResetUrl: process.env.frontendAppPasswordResetUrl,
          nextMinutes: moment().add('30','minutes').format("dddd, MMMM Do YYYY, h:mm:ss a"),
          siteName: process.env.name
        },{
          from: process.env.mailerServiceUsername,
          to: args.email,
          subject: "Reset your email"
        });
        return {
          email: args.email,
          successMessageType: "Successfull",
          successMessage:  "Please check your email. We have sent a link to reset your email",
          statusCode: statusCodes.CREATED.type
        };
      } catch (e) {
        return internalServerError(e);
      }
    },
    resetPassword: async (_: any, args: any, g: any) => {
      let v = await validate(validations.resetPassword,args);
			let {success} = v;
			if (!success) {
        throw new ApolloError("Validation Errors",statusCodes.BAD_REQUEST.number,{list: v.errors});
      }
      try {
        let forgetPassword = await forgetPasswordModel.findOne({token: args.token});
        if (!forgetPassword) {
          throw new ApolloError("Token Expired",statusCodes.NOT_FOUND.number);
        }
        let user = await userModel.findOne({email: forgetPassword.email});
        if (!forgetPassword) {
          throw new ApolloError("User not foundd",statusCodes.NOT_FOUND.number);
        }
        let hash = bcrypt.hashSync(args.password);
        await user.update({
          password: hash
        });
        await forgetPasswordModel.delete(forgetPassword);
        await sendEmail('changePassword.hbs',{
          userName: user.email,
          siteName: process.env.name,
          email: user.email,
        },{
          from: process.env.mailerServiceUsername,
          to: user.email,
          subject: "Password changed"
        });
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
    
  },
}