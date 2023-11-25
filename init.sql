use mymathapps;


-- Class init
insert into class (class_id, instructor_id) values (1, NULL);
insert into class (class_id, instructor_id) values (2, NULL);

INSERT INTO class (class_id, instructor_id) VALUES(102, NULL);
INSERT INTO class (class_id, instructor_id) VALUES(101, NULL);

-- User init
insert into user (user_id, firstName, lastName, email_address, user_pw_hash, activated_account, role) values (1, 'insert_test', 'instr', 'test@test.com', '$2b$10$VUWIypuXOA0ADxsPIUjwAumK9wWtIan3rKU2Zc9Wko9QiG9lnyFXK', 1, 'instructor');
insert into user (user_id, firstName, lastName, email_address, user_pw_hash, activated_account, role, class_id) values (2, 'stu', 'test1', 'stutest@test.com', '$2b$10$VUWIypuXOA0ADxsPIUjwAumK9wWtIan3rKU2Zc9Wko9QiG9lnyFXK', 1, 'user', NULL);
insert into user (user_id, firstName, lastName, email_address, user_pw_hash, activated_account, role, class_id) values (3, 'stu', 'test2', 'stutest2@test.com', '$2b$10$VUWIypuXOA0ADxsPIUjwAumK9wWtIan3rKU2Zc9Wko9QiG9lnyFXK', 1, 'user', 1);
insert into user (user_id, firstName, lastName, email_address, user_pw_hash, activated_account, role, class_id) values (4, 'stu', 'test3', 'test1@test.com', '$2b$10$VUWIypuXOA0ADxsPIUjwAumK9wWtIan3rKU2Zc9Wko9QiG9lnyFXK', 1, 'user', 1);
insert into user (user_id, firstName, lastName, email_address, user_pw_hash, activated_account, role, class_id) values (5, 'stu', 'test4', 'test2@test.com', '$2b$10$VUWIypuXOA0ADxsPIUjwAumK9wWtIan3rKU2Zc9Wko9QiG9lnyFXK', 1, 'user', 1);
insert into user (user_id, firstName, lastName, email_address, user_pw_hash, activated_account, role, class_id) values (6, 'stu', 'test5', 'test3@test.com', '$2b$10$VUWIypuXOA0ADxsPIUjwAumK9wWtIan3rKU2Zc9Wko9QiG9lnyFXK', 1, 'user', 1);

insert into user (user_id, firstName, lastName, email_address, user_pw_hash, activated_account, role) values (7, 'instr', 'test', 'instrtest_2@test.com', '$2b$10$VUWIypuXOA0ADxsPIUjwAumK9wWtIan3rKU2Zc9Wko9QiG9lnyFXK', 1, 'instructor');
insert into user (user_id, firstName, lastName, email_address, user_pw_hash, activated_account, role, class_id) values (18, 'stu_2', 'test1', 'i2_stu1_autotest@test.com', '$2b$10$VUWIypuXOA0ADxsPIUjwAumK9wWtIan3rKU2Zc9Wko9QiG9lnyFXK', 1, 'user', 2);
insert into user (user_id, firstName, lastName, email_address, user_pw_hash, activated_account, role, class_id) values (19, 'stu_2', 'test2', 'i2_stu2_autotest@test.com', '$2b$10$VUWIypuXOA0ADxsPIUjwAumK9wWtIan3rKU2Zc9Wko9QiG9lnyFXK', 1, 'user', 2);
insert into user (user_id, firstName, lastName, email_address, user_pw_hash, activated_account, role, class_id) values (20, 'stu_2', 'test3', 'i2_stu3_autotest@test.com', '$2b$10$VUWIypuXOA0ADxsPIUjwAumK9wWtIan3rKU2Zc9Wko9QiG9lnyFXK', 1, 'user', 2);
insert into user (user_id, firstName, lastName, email_address, user_pw_hash, activated_account, role, class_id) values (21, 'stu_2', 'test4', 'i2_stu4_autotest@test.com', '$2b$10$VUWIypuXOA0ADxsPIUjwAumK9wWtIan3rKU2Zc9Wko9QiG9lnyFXK', 1, 'user', 2);
insert into user (user_id, firstName, lastName, email_address, user_pw_hash, activated_account, role, class_id) values (22, 'stu_2', 'test5', 'i2_stu5_autotest@test.com', '$2b$10$VUWIypuXOA0ADxsPIUjwAumK9wWtIan3rKU2Zc9Wko9QiG9lnyFXK', 1, 'user', 2);

insert into user (user_id, firstName, lastName, email_address, user_pw_hash, activated_account, role, class_id) values (23, 'login_test', 'test', 'yushuang@me.com', '$2b$10$BZVV9HO/TapmfB.qgL1j2e.Y2FyekdIj2Wvb6t7swjtBoU0dT5Iqu', 1, 'user', NULL);

insert into user (user_id, firstName, lastName, email_address, user_pw_hash, activated_account, role, class_id) values (24, 'admin', 'test', 'ncc@me.com', '$2b$10$utfmhpZHGb8gp9pSkMTc7OiRqMTiNHBpO7MHYd.wsEtqIeC1csPuW', 1, 'admin', NULL);
insert into user (user_id, firstName, lastName, email_address, user_pw_hash, activated_account, role, class_id) values (25, 'admin', 'test', 'admin@admin.com', '$2b$10$bptJEqEcggdGdTxPf1q8lewgsWsufc7YN/wbL.8lHtzFL98Vw1Y8y', 1, 'admin', NULL);
insert into user (user_id, firstName, lastName, email_address, user_pw_hash, activated_account, role, class_id) values (26, 'test', 'test', 'arunimsamudra@gmail.com', '$2b$10$/jVpvOpGLnV141nfOeMjxeiGab.PQSUiIWg6261qW3fiApgjYFyLK', 1, 'user', NULL);

INSERT INTO user (user_id, firstName, lastName, email_address, user_pw_hash, activated_account, activation_code, created_at, updated_at, `role`, class_id) VALUES(101, 'Nikhil', 'Nehra', 'nikhil2inc@gmail.com', '$2b$10$c07VhFBxkEjHdS92SLjSyuMY38bYDnbR0Gfe4y8liftbJaVLe1eD.', 1, 'MYCode1699908823157ncclovekk', '2023-11-13 20:53:43.163000', '2023-11-13 20:53:43', 'admin', NULL);
INSERT INTO user (user_id, firstName, lastName, email_address, user_pw_hash, activated_account, activation_code, created_at, updated_at, `role`, class_id) VALUES(102, 'Chris', 'Lavelle', 'smelly@stinky.com', '$2b$10$RQ7UFNkKGPoQz4fvrRftfeAzuLTCK4xaYKNs8dbdL.FthadVQcaby', 1, 'MYCode1700079211887ncclovekk', '2023-11-15 20:13:31.902000', '2023-11-21 21:37:26.129577', 'user', 102);
INSERT INTO user (user_id, firstName, lastName, email_address, user_pw_hash, activated_account, activation_code, created_at, updated_at, `role`, class_id) VALUES(103, 'Emmitt', 'Kenny', 'emmykenner@gmail.com', '$2b$10$C0Q7B3XgW.a.X64ZJMFizeZ6dEQss62OplPUgM8Fnf0UiI8FOylhC', 1, 'MYCode1700079284914ncclovekk', '2023-11-15 20:14:44.920569', '2023-11-21 21:36:03.999773', 'user', 101);
INSERT INTO user (user_id, firstName, lastName, email_address, user_pw_hash, activated_account, activation_code, created_at, updated_at, `role`, class_id) VALUES(104, 'Michael', 'Jonathan', 'mickjohn@outlook.com', '$2b$10$e4lLTKkblVnL/XPUIRJk3O66z033qLBaZckto2Ogm3ACWav1tXPnK', 1, 'MYCode1700079326411ncclovekk', '2023-11-15 20:15:26.414418', '2023-11-21 21:36:04.005600', 'user', 101);
INSERT INTO user (user_id, firstName, lastName, email_address, user_pw_hash, activated_account, activation_code, created_at, updated_at, `role`, class_id) VALUES(105, 'Riccardo', 'DeGay', 'riccy_gay@yahoo.com', '$2b$10$S9vA5pXfgPa9cTpR4/xn4.tZO0XocDWVcSNX.zCR8FoG.Pq1qJGHq', 1, 'MYCode1700079386263ncclovekk', '2023-11-15 20:16:26.268000', '2023-11-15 20:16:26', 'user', NULL);
INSERT INTO user (user_id, firstName, lastName, email_address, user_pw_hash, activated_account, activation_code, created_at, updated_at, `role`, class_id) VALUES(106, 'Admin', 'Istrator', 'administrator@admin.com', '$2b$10$rTGfdpd8miH6wMzMHGKuSOu2j1cTOJP8VzYjFs/HiiSq.2Gcpv7jS', 1, 'MYCode1700503654063ncclovekk', '2023-11-20 18:07:34.072000', '2023-11-20 18:07:34', 'admin', NULL);

-- update class 
update class set instructor_id=1 where class_id=1;
update class set instructor_id=7 where class_id=2;

update class set instructor_id=101 where class_id=102;
update class set instructor_id=106 where class_id=101;

-- Free Subsciption init
INSERT INTO free_subscription (email_subscription_id, suffix) VALUES(102, 'tamu.edu');
INSERT INTO free_subscription (email_subscription_id, suffix) VALUES(103, 'friscoisd.org');
INSERT INTO free_subscription (email_subscription_id, suffix) VALUES(104, 'utdallas.edu');

-- Item init
insert into item (item_id, name, price, subscriptionLengthMonths) values (1, 'textbook', 60, 6);
insert into item (item_id, name, price, subscriptionLengthMonths) values (2, 'Finance with Maple', 60, 12);

INSERT INTO item (item_id, name, price, subscriptionLengthMonths) VALUES(103, 'Calculus 1', 40, 6);
INSERT INTO item (item_id, name, price, subscriptionLengthMonths) VALUES(104, 'Calculus 2', 60, 6);
INSERT INTO item (item_id, name, price, subscriptionLengthMonths) VALUES(105, 'Calculus 3', 20, 4);

-- Subscription init
insert into subscription (subscription_id, expirationDate, item_id, owner_id, user_id) values (1, '2024-11-08 18:35:01', 1, 26, 26);
insert into subscription (subscription_id, expirationDate, item_id, owner_id, user_id) values (2, '2030-11-08 18:35:01', 2, 26, 26);
insert into subscription (subscription_id, expirationDate, item_id, owner_id, user_id) values (3, '2025-11-08 18:35:01', 1, 26, 1);
insert into subscription (subscription_id, expirationDate, item_id, owner_id, user_id) values (4, '2042-11-08 18:35:01', 1, 1, 26);

INSERT INTO subscription (subscription_id, expirationDate, item_id, owner_id, user_id) VALUES(101, '2024-12-12 00:00:00', 103, 101, 101);
INSERT INTO subscription (subscription_id, expirationDate, item_id, owner_id, user_id) VALUES(102, '2022-02-10 00:00:00', 104, 103, 103);
INSERT INTO subscription (subscription_id, expirationDate, item_id, owner_id, user_id) VALUES(103, '2025-06-30 00:00:00', 105, 106, 104);


-- Purchase Code init
insert into purchase_code (name, salePrice, item_id) values ('20percentoff', 20, 1);
insert into purchase_code (name, salePrice, item_id) values ('free', 100, 1);

INSERT INTO purchase_code (name, salePrice, item_id) VALUES('CACL1HALF', 50, 103);
INSERT INTO purchase_code (name, salePrice, item_id) VALUES('CACL2FREE', 100, 103);
INSERT INTO purchase_code (name, salePrice, item_id) VALUES('CALC3TEN', 10, 105);

-- Transction init
INSERT INTO transaction (transaction_id, total, created_at, user_id) VALUES(101, 60, '2021-11-15 20:22:17.334792', 101);
INSERT INTO transaction (transaction_id, total, created_at, user_id) VALUES(102, 40, '2023-06-15 20:23:45.461912', 103);
INSERT INTO transaction (transaction_id, total, created_at, user_id) VALUES(103, 20, '2022-02-15 20:23:45.492542', 104);
INSERT INTO transaction (transaction_id, total, created_at, user_id) VALUES(104, 20, '2022-03-15 20:23:45.503402', 106);
