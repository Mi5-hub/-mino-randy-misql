exports.multipleColumnSet = async (obj, type) => {
  if (typeof obj === "object") {
    const values = Object.values(obj);
    const keys = Object.keys(obj);
    const columnSet = keys.map((key) => `${key} = ?`).join(` ${type} `);

    return { columnSet, values };
  } else {
    throw new Error("type of params must be an object !!!");
  }
};

exports.iterateKeysAndValues = async (params) => {
  try {
    const column = Object.keys(params)
      .map((el) => `${el}`)
      .join(" , ");
    const values = Object.values(params)
      .map((el) => `${el}`)
      .join(" , ");
    return { column, values };
  } catch (error) {
    return error;
  }
};

exports.buildSchema = (params) => {
  const key = Object.keys(params);
  const value = Object.values(params);
  var sql = "";
  for (let i = 0; i < key.length; i++) {
    if (i === key.length - 1) {
      sql += ` ${key[i]} ${value[i].type}`;
    } else {
      sql += ` ${key[i]} ${value[i].type} , `;
    }
  }
  return sql;
};
exports.createTable = async (tableName, schema, query) => {
  try {
    const sql = `CREATE TABLE IF NOT EXISTS ${tableName} (
       ${schema}
      )ENGINE=INNODB`;
    return await query(sql);
  } catch (error) {
    return error;
  }
};
