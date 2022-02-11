// Dependencies
const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');
const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return pool
  .query(`
  SELECT * FROM users WHERE email = $1;
  `, [email])
  .then(res => res.rows[0]);
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool
  .query(`
  SELECT * FROM users WHERE id = $1;
  `, [id])
  .then(res => res.rows[0]);
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  const values = [user.name, user.password, user.email];
  return pool
  .query(`
  INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *;
  `, values)
  .then(res => res.rows[0]);
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  const values = [guest_id, limit];
  return pool
  .query(`
  SELECT * FROM reservations
  JOIN properties ON properties.id = property_id
  WHERE guest_id = $1
  LIMIT $2;
  `, values)
  .then(res => res.rows);
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
 const getAllProperties = (options, limit = 10) => {
  const queryParams = [];
  let queryString = `
  SELECT properties.*, AVG(property_reviews.rating) AS average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  // If an owner_id is passed into the filter, only return properties belonging to that owner.
  if (options.owner_id) {
    queryParams.push(options.owner_id);
    queryString += `
    WHERE owner_id = $${queryParams.length}
    GROUP BY properties.id
    ORDER BY cost_per_night;
    `;
    return pool
    .query(queryString, queryParams)
    .then((res) => res.rows);
  }

  // If a city is passed into the filter, then return:
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
    
    if (options.minimum_price_per_night) {
      options.minimum_price_per_night *= 100;
      queryParams.push(options.minimum_price_per_night);
      queryString += `AND cost_per_night >= $${queryParams.length} `;
    }

    if (options.maximum_price_per_night) {
      options.maximum_price_per_night *= 100;
      queryParams.push(options.maximum_price_per_night);
      queryString += `AND cost_per_night <= $${queryParams.length} `;
    }

    if (options.minimum_rating) {
      queryParams.push(options.minimum_rating);
      queryString += `AND rating >= $${queryParams.length} `;
    }
    
    queryParams.push(limit);
    queryString += `
    GROUP BY properties.id
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
    `;

    return pool
    .query(queryString, queryParams)
    .then((res) => res.rows);
  }

  // If a city is NOT passed into the filter, but a minimum price is, then return:
  if (!options.city && options.minimum_price_per_night) {    
      options.minimum_price_per_night *= 100;
      queryParams.push(options.minimum_price_per_night);
      queryString += `WHERE cost_per_night >= $${queryParams.length} `;

    if (options.maximum_price_per_night) {
      options.maximum_price_per_night *= 100;
      queryParams.push(options.maximum_price_per_night);
      queryString += `AND cost_per_night <= $${queryParams.length} `;
    }

    if (options.minimum_rating) {
      queryParams.push(options.minimum_rating);
      queryString += `AND rating >= $${queryParams.length} `;
    }

    queryParams.push(limit);
    queryString += `
    GROUP BY properties.id
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
    `;

    return pool
    .query(queryString, queryParams)
    .then((res) => res.rows);
  }

  // If a city and minimum price are NOT passed into the filter, but a maximum price is, then return:
  if (!options.city && !options.minimum_price_per_night && options.maximum_price_per_night) {    
      options.maximum_price_per_night *= 100;
      queryParams.push(options.maximum_price_per_night);
      queryString += `WHERE cost_per_night <= $${queryParams.length} `;

    if (options.minimum_rating) {
      queryParams.push(options.minimum_rating);
      queryString += `AND rating >= $${queryParams.length} `;
    }

    queryParams.push(limit);
    queryString += `
    GROUP BY properties.id
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
    `;

    return pool
    .query(queryString, queryParams)
    .then((res) => res.rows);
  }

  // If a city, minimum price, and maximum price are NOT passed into the filter, but a rating is, then return:
  if (!options.city && !options.minimum_price_per_night && !options.maximum_price_per_night, options.minimum_rating) {    
    queryParams.push(options.minimum_rating);
    queryString += `WHERE rating >= $${queryParams.length} `;

    queryParams.push(limit);
    queryString += `
    GROUP BY properties.id
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
    `;

    return pool
    .query(queryString, queryParams)
    .then((res) => res.rows);
  }
  
  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  return pool
  .query(queryString, queryParams)
  .then((res) => res.rows);
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const values = [
    property.owner_id,
    property.title,
    property.description,
    property.thumbnail_photo_url,
    property.cover_photo_url,
    Number(property.cost_per_night),
    property.street,
    property.city,
    property.province,
    property.post_code,
    property.country,
    Number(property.number_of_bathrooms),
    Number(property.number_of_bedrooms)
  ];

  const query = `
  INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, city, province, post_code, country, number_of_bathrooms, number_of_bedrooms)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
  RETURNING *;
  `;

  return pool
  .query(query, values)
  .then((res) => res.rows[0]);
}
exports.addProperty = addProperty;
