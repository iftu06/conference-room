INSERT INTO `role` (`id`, `name`) VALUES
(1,  'ADMIN'),
(2,  'USER');


INSERT INTO `user` (`id`,  `active`, `email`,`mobile_no`, `password`, `user_name`) VALUES
(13,  1, 'iftekharuddin52@gmail.com','01635482457', '$2a$10$x14kRbwuPkix.n6du64dXu3pzgXX7/amA8ajc0FS/qlG2oTWKy.rO', 'chacha'),
(17,  1, 'iftu_hai07@yahoo.com','01635482457', '$2a$10$x14kRbwuPkix.n6du64dXu3pzgXX7/amA8ajc0FS/qlG2oTWKy.rO', 'iftekhar'),
(18,  1, 'something@gmail.com','01635482457', '$2a$10$x14kRbwuPkix.n6du64dXu3pzgXX7/amA8ajc0FS/qlG2oTWKy.rO', 'sa'),
(20,  1, 'sab_hai07@yahoo.com','01635482457', '$2a$10$x14kRbwuPkix.n6du64dXu3pzgXX7/amA8ajc0FS/qlG2oTWKy.rO', 'shasha');


INSERT INTO `user_role` (`user_id`, `role_id`) VALUES
(13, 1),
(17, 1),
(18, 1),
(20, 2);
