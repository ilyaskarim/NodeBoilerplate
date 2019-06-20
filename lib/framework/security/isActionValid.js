"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const allModels_1 = __importDefault(require("./../dynamic/allModels"));
let { get } = require("lodash");
function default_1(user, action) {
    return __awaiter(this, void 0, void 0, function* () {
        let permission = get(allModels_1.default, 'permissionModel', null);
        if (permission) {
            let find = yield permission.findOne({
                where: {
                    action: action,
                    user: user.id
                }
            });
            if (user.superUser) {
                return true;
            }
            return (!find) ? false : true;
        }
    });
}
exports.default = default_1;
//# sourceMappingURL=isActionValid.js.map