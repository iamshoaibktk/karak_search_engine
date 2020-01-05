const db = require("../util/database");

module.exports = class entitiesInfo {
  // constructor(entityInfo) {
  //     this.title = entityInfo.title;
  //     this.category = entityInfo.category;
  //     this.description = entityInfo.description;
  //     this.address = entityInfo.address;
  //     this.entityPhnNum = entityInfo.entityPhnNum;
  //     this.entityServices = entityInfo.entityServices;
  //     this.EopeningTime = entityInfo.EopeningTime;
  //     this.EclosingTime = entityInfo.EclosingTime;
  //     this.entityImg = entityInfo.entityImg;
  // }
  static saveEntity(obj) {
    return db.execute(
      "INSERT INTO entities(title, entity_desc, address, entity_phn, services, opening_time, closing_time, entity_img, category, user_id) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        obj.title,
        obj.description,
        obj.address,
        obj.entityPhnNum,
        obj.entityServices,
        obj.EopeningTime,
        obj.EclosingTime,
        obj.entity_img,
        obj.category,
        obj.userId
      ]
    );
  }

  static fetchAllPosts(id) {
    return db.execute("SELECT * FROM entities");
  }
  static fetchUserSpecific(id) {
    return db.execute(
      'SELECT id, title, entity_desc, address, entity_phn, services, opening_time, closing_time, entity_img, category, user_id, DATE_FORMAT(created_at, "%d-%c-%Y | %I:%i %p") AS created_at FROM entities WHERE user_id = ?',
      [id]
    );
  }
  static fetchSpecific(id) {
    return db.execute("SELECT * FROM entities WHERE id = ?", [id]);
  }
  static catAndKey(keywords, category) {
    return db.execute(
      'SELECT * FROM entities WHERE title LIKE CONCAT("%",?,"%") AND category LIKE ?',
      [keywords, category]
    );
  }
  // SELECT * FROM entities WHERE title LIKE '%dfdfadsdd%' OR category LIKE 'developer';
  static deleteEntity(id) {
    return db.execute("DELETE FROM entities WHERE id = ?", [id]);
  }

  static editEntity(dataObj) {
    return db.execute(
      "Update entities SET title = ?, entity_desc = ?, address = ?, entity_phn = ?, services = ?, opening_time = ?, closing_time = ?, category = ? WHERE id = ?",
      [
        dataObj.title,
        dataObj.entity_desc,
        dataObj.address,
        dataObj.entity_phn,
        dataObj.services,
        dataObj.opening_time,
        dataObj.closing_time,
        dataObj.category,
        dataObj.postId
      ]
    );
  }
  static editEntityWithImg(dataObj) {
    console.log(dataObj.entity_img);
    return db.execute(
      "Update entities SET title = ?, entity_desc = ?, address = ?, entity_phn = ?, services = ?, opening_time = ?, closing_time = ?, category = ?, entity_img = ? WHERE id = ?",
      [
        dataObj.title,
        dataObj.entity_desc,
        dataObj.address,
        dataObj.entity_phn,
        dataObj.services,
        dataObj.opening_time,
        dataObj.closing_time,
        dataObj.category,
        dataObj.entity_img,
        dataObj.postId
      ]
    );
  }
  static category() {
    return db.execute("SELECT DISTINCT(category) FROM entities");
  }
  static searchResultsExceptCat(keywords) {
    return db.execute(
      'SELECT id, title, entity_desc, address, entity_phn, services, DATE_FORMAT(opening_time, "%I:%i %p") AS opening_time, DATE_FORMAT(closing_time, "%I:%i %p") AS closing_time, entity_img, category, user_id, DATE_FORMAT(created_at, "%d-%c-%Y | %I:%i %p") AS created_at FROM entities WHERE title LIKE CONCAT("%", ?, "%")',
      [keywords]
    );
  }
  static withLocation(category, location, kewords) {
    return db.execute(
      'SELECT id, title, entity_desc, address, entity_phn, services, DATE_FORMAT(opening_time, "%I:%i %p") AS opening_time, DATE_FORMAT(closing_time, "%I:%i %p") AS closing_time, entity_img, category, user_id, DATE_FORMAT(created_at, "%d-%c-%Y | %I:%i %p") AS created_at FROM entities WHERE category LIKE CONCAT("%", ?, "%") AND address LIKE CONCAT("%", ?, "%") AND title LIKE CONCAT("%", ?, "%")',
      [category, location, kewords]
    );
  }
  static onlyCategory(category) {
    return db.execute(
      'SELECT id, title, entity_desc, address, entity_phn, services, DATE_FORMAT(opening_time, "%I:%i %p") AS opening_time, DATE_FORMAT(closing_time, "%I:%i %p") AS closing_time, entity_img, category, user_id, DATE_FORMAT(created_at, "%d-%c-%Y | %I:%i %p") AS created_at FROM entities WHERE category LIKE CONCAT("%", ?, "%")',
      [category]
    );
  }
  static catAndLoc(category, location) {
    return db.execute(
      'SELECT id, title, entity_desc, address, entity_phn, services, DATE_FORMAT(opening_time, "%I:%i %p") AS opening_time, DATE_FORMAT(closing_time, "%I:%i %p") AS closing_time, entity_img, category, user_id, DATE_FORMAT(created_at, "%d-%c-%Y | %I:%i %p") AS created_at FROM entities WHERE category LIKE CONCAT("%", ?, "%") AND address LIKE CONCAT("%", ?, "%")',
      [category, location]
    );
  }
  static locAndKey(location, keywords) {
    return db.execute(
      'SELECT id, title, entity_desc, address, entity_phn, services, DATE_FORMAT(opening_time, "%I:%i %p") AS opening_time, DATE_FORMAT(closing_time, "%I:%i %p") AS closing_time, entity_img, category, user_id, DATE_FORMAT(created_at, "%d-%c-%Y | %I:%i %p") AS created_at FROM entities WHERE address LIKE CONCAT("%", ?, "%") AND title LIKE CONCAT("%", ?, "%")',
      [location, keywords]
    );
  }
  static onlyLoc(location) {
    return db.execute(
      'SELECT id, title, entity_desc, address, entity_phn, services, DATE_FORMAT(opening_time, "%I:%i %p") AS opening_time, DATE_FORMAT(closing_time, "%I:%i %p") AS closing_time, entity_img, category, user_id, DATE_FORMAT(created_at, "%d-%c-%Y | %I:%i %p") AS created_at FROM entities WHERE address LIKE CONCAT("%", ?, "%") ',
      [location]
    );
  }
  static countEntities() {
    return db.execute("SELECT COUNT(*) AS total FROM entities");
  }
  static fetchAllPostsJoinUser() {
    return db.execute(
      'SELECT users.id AS user_id, fname, lname, user_id, title, entities.id AS id, entity_img, DATE_FORMAT(entities.created_at, "%d-%c-%Y | %I:%i %p") AS created_at FROM users JOIN entities ON `users`.id = `entities`.user_id'
    );
  }
  static reportPost(userId, postId, text) {
    return db.execute(
      "INSERT INTO reports (user_id, post_id, report_text) VALUES(?, ?, ?)",
      [userId, postId, text]
    );
  }
  static reports() {
    return db.execute(
      'SELECT  users.fname, users.lname,entities.title, entities.entity_phn,  DATE_FORMAT(entities.created_at, "%d-%c-%Y | %I:%i %p") AS created_at, entities.entity_img, report_text, reports.post_id, reports.user_id, reports.id AS reportId FROM entities JOIN reports ON entities.id = reports.post_id JOIN users ON users.id = reports.user_id'
    );
  }
  static checkExistingRepot(user_id, post_id) {
    return db.execute(
      "SELECT * FROM reports WHERE user_id = ? && post_id = ?",
      [user_id, post_id]
    );
  }
};
