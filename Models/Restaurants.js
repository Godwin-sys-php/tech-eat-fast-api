const db = require('../Utils/db');
const _ = require('underscore');

class Restaurants {
  insertOne(toInsert) {
    return new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO restaurants SET ?", toInsert,
        (error, results, fields) => {
          if (error) reject(error);
          resolve(results);
          db.destroy();
        }
      );
    });
  }

  findOne(params) {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM restaurants WHERE ?", params,
        (error, results, fields) => {
          if (error) reject(error);
          if (results.length < 1 || _.isNull(results) || _.isUndefined(results)) {
            resolve(null);
            db.destroy();
          } else {
            resolve(results[0]);
            db.destroy();
          }
        }
      );
    });
  }

  findAll() {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM restaurants",
        (error, results, fields) => {
          if (error) reject(error);
          resolve(results);
          db.destroy();
        }
      );
    });
  }

  updateOne(toSet, params) {
    return new Promise((resolve, reject) => {
      db.query(
        "UPDATE restaurants SET ? WHERE ?", [toSet, params],
        (error, results, fields) => {
          if (error) reject(error);
          resolve(results);
          db.destroy();
        }
      );
    });
  }

  delete(params) {
    return new Promise((resolve, reject) => {
      db.query(
        "DELETE FROM restaurants WHERE ?", params,
        (error, results, fields) => {
          if (error) reject(error);
          resolve(results);
          db.destroy();
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
          db.destroy();
        }
      );
    });
  }
}

module.exports = new Restaurants();