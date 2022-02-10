-- 3_property_listings_by_city.sql
-- Get all details about properties located in Vancouver including their average rating.
SELECT properties.*, AVG(property_reviews.rating) AS average_rating
FROM properties
JOIN property_reviews ON property_id = properties.id
WHERE city = 'Vancouver'
GROUP BY properties.id
HAVING AVG(property_reviews.rating) >= 4
ORDER BY cost_per_night
LIMIT 10;
