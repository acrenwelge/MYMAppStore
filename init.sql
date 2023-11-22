use mymathapps;


-- Class init
insert into class (class_id, instructor_id) values (1, NULL);
insert into class (class_id, instructor_id) values (2, NULL);


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

-- update class
update class set instructor_id=1 where class_id=1;
update class set instructor_id=7 where class_id=2;



-- Item init
insert into item (item_id, name, price, subscriptionLengthMonths) values (1, 'textbook', 60, 6);

-- Subscription init
insert into subscription (subscription_id, expirationDate, item_id, owner_id, user_id) values (1, '2024-11-08 18:35:01', 1, 26, 26);


-- Purchase Code init
insert into purchase_code (name, salePrice, item_id) values ('20percentoff', 20, 1);
insert into purchase_code (name, salePrice, item_id) values ('free', 100, 1);