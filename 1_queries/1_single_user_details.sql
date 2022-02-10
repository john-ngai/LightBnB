-- 1_single_user_details.sql
-- Get the id, name, email, and password of a single user using their email address.
SELECT id, name, email, password
FROM users
WHERE email = 'tristanjacobs@gmail.com';
