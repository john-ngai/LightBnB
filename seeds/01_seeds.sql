INSERT INTO users (name, email, password)
VALUES ('Eva Stanley', 'sebastianguerra@ymail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Louisa Meyer', 'jacksonrose@hotmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Dominic Parks', 'victoriablackwell@outlook.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code)
VALUES (16, 'Highland Oasis', 'description', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg', 107, 2, 2, 2, 'Canada', '4382 Hwy 60, RR1', 'Dwight', 'ON', 'P0A 1H0'),
(17, 'River-View Escape', 'description', 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg', 167, 3, 2, 2, 'Canada', '98 
N Shore Rd', 'Kearney', 'ON', 'P0A 1M0'),
(18, 'Fox Haven', 'description', 'https://images.pexels.com/photos/2080018/pexels-photo-2080018.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2080018/pexels-photo-2080018.jpeg', 392, 4, 3, 5, 'Canada', '5818 Elephant Lake Rd', 'Harcourt', 'ON', 'K0L 1X0');

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2022-07-08', '2022-07-10', 17, 18),
('2022-07-25', '2022-07-28', 16, 17),
('2022-08-05', '2022-08-07', 18, 16);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (18, 17, 16, 4.6, 'message'),
(17, 16, 17, 4.2, 'message'),
(16, 18, 18, 3.9, 'message');
