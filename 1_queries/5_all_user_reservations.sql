-- 5_all_user_reservations.sql
-- Get all reservations for a user.
SELECT properties.*,
  reservations.*,
  AVG(rating) AS avg_rating
FROM reservations
JOIN properties ON reservations.property_id = properties.id
JOIN property_reviews ON property_reviews.property_id = properties.id
WHERE reservations.guest_id = 17
  AND end_date < now()::date
GROUP BY properties.id, reservations.id
ORDER BY start_date
LIMIT 10;
