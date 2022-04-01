const db = require('../Utils/db');
const _ = require('underscore');

class Transactions {
  insertOne(toInsert) {
    return new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO walletTransactions SET ?", toInsert,
        (error, results, fields) => {
          if (error) reject(error);
          resolve(results);
        }
      );
    });
  }

  findOne(params) {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM walletTransactions WHERE ?", params,
        (error, results, fields) => {
          if (error) reject(error);
          if (results.length < 1 || _.isNull(results) || _.isUndefined(results)) {
            resolve(null);
          } else {
            resolve(results[0]);
          }
        }
      );
    });
  }

  findAll() {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM walletTransactions",
        (error, results, fields) => {
          if (error) reject(error);
          resolve(results);
        }
      );
    });
  }

  updateOne(toSet, params) {
    return new Promise((resolve, reject) => {
      db.query(
        "UPDATE walletTransactions SET ? WHERE ?", [toSet, params],
        (error, results, fields) => {
          if (error) reject(error);
          resolve(results);
        }
      );
    });
  }

  delete(params) {
    return new Promise((resolve, reject) => {
      db.query(
        "DELETE FROM walletTransactions WHERE ?", params,
        (error, results, fields) => {
          if (error) reject(error);
          resolve(results);
        }
      );
    });
  }

  customQuery(query, params) {
    return new Promise((resolve, reject) => {
      db.query(
        query, params,
        (error, results, fields) => {
          if (error) reject(error);
          resolve(results);
        }
      );
    });
  }
}

module.exports = new Transactions();