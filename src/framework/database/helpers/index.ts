import { Console } from "console";

const sequelize = require("sequelize");

sequelize['NUMBER'] = sequelize['INTEGER'];

export const convertFieldsIntoSequelizeFields = (fields) => {
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

export const deleteModel = () => {};

export const paginateModel = () => {};

export const updateModel = () => {};

export const viewModel = () => {};
