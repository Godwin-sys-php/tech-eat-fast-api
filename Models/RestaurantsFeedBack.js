const db = require('../Utils/db');
const _ = require('underscore');

class RestaurantsFeedBack {
  insertOne(toInsert) {
    return new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO restaurantsFeedBack SET ?", toInsert,
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
        "SELECT * FROM restaurantsFeedBack WHERE ?", params,
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
        "SELECT * FROM restaurantsFeedBack",
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
        "UPDATE restaurantsFeedBack SET ? WHERE ?", [toSet, params],
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
        "DELETE FROM restaurantsFeedBack WHERE ?", params,
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

module.exports = new RestaurantsFeedBack();