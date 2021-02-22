"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.viewModel = exports.updateModel = exports.paginateModel = exports.deleteModel = exports.convertFieldsIntoSequelizeFields = void 0;
const sequelize = require("sequelize");
exports.convertFieldsIntoSequelizeFields = (fields) => {
    let k = Object.keys(fields);
    k.forEach((element) => {
        let t = fields[element].type;
        if (t.toLowerCase() === "number") {
            t = "integer";
        }
        fields[element].type = sequelize[t.toUpperCase()];
        fields[element].oldType = t;
    });
    return fields;
};
exports.deleteModel = () => { };
exports.paginateModel = () => { };
exports.updateModel = () => { };
exports.viewModel = () => { };
//# sourceMappingURL=index.js.map