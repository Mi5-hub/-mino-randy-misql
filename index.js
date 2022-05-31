const {
  multipleColumnSet,
  iterateKeysAndValues,
  buildSchema,
} = require("./utils/utils");

class MiSQL {
  constructor(query, tableName, schema) {
    this.query = query;
    this.tableName = tableName;
    this.schema = schema;
    this.createTable = async (tableName, buildSchema, query, schema) => {
      try {
        const sql = `CREATE TABLE IF NOT EXISTS ${tableName} (id INT AUTO_INCREMENT PRIMARY KEY,
           ${buildSchema(schema)}
          )ENGINE=INNODB`;
        return await query(sql);
      } catch (error) {
        return error;
      }
    };
  }

  find = async () => {
    try {
      await this.createTable(
        this.tableName,
        buildSchema,
        this.query,
        this.schema
      );
      const sql = `SELECT * FROM ${this.tableName}`;
      return await this.query(sql);
    } catch (error) {
      return error;
    }
  };

  create = async (params) => {
    try {
      await this.createTable(
        this.tableName,
        buildSchema,
        this.query,
        this.schema
      );

      const { column, values } = await iterateKeysAndValues(params);
      const sql = `INSERT INTO ${this.tableName} (${column}) VALUES (${values})`;

      const response = await this.query(sql);
      const affectedRows = response ? response.affectedRows : 0;
      return affectedRows;
    } catch (error) {
      return error;
    }
  };
  findBy = async (params) => {
    try {
      await this.createTable(
        this.tableName,
        buildSchema,
        this.query,
        this.schema
      );

      const { columnSet, values } = await multipleColumnSet(params, "AND");
      const sql = `SELECT * FROM ${this.tableName} WHERE ${columnSet} `;
      const result = await this.query(sql, [...values]);
      return result;
    } catch (error) {
      return error;
    }
  };

  findById = async (id) => {
    try {
      await this.createTable(
        this.tableName,
        buildSchema,
        this.query,
        this.schema
      );

      const sql = `SELECT * FROM ${this.tableName} WHERE id =?`;
      const result = await this.query(sql, [id]);
      return result[0];
    } catch (error) {
      return error;
    }
  };
  findByIdAndUpdate = async (params, id) => {
    try {
      const { columnSet, values } = await multipleColumnSet(params, ",");
      const sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE id=${id}`;
      const result = await this.query(sql, [...values]);
      return result;
    } catch (error) {
      return error;
    }
  };
  findByIdAndRemove = async (id) => {
    try {
      const sql = `DELETE FROM ${this.tableName} WHERE id=${id}`;
      const result = await this.query(sql);
      return result;
    } catch (error) {
      return error;
    }
  };
}

module.exports = new MiSQL();
