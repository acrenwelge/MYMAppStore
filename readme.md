# MyMathApp

CSCE606 Textbook Project in Spring 2023.

## Project Description
This project is a full-stack web application ecommerce site that allows users to register, login, find MYMathApps products (Calc 1/2/3 textbooks) and buy a subscription to them. They can then access the textbook from the webapp. Admins can view, activate/deactivate, and delete users. User access to a textbook is disabled after the end of their subscription date. Admins can also add or edit purchase codes that give discounts for particular products. Instructors can sign up an entire class along with themselves and then pay for their subscriptions. Instructors can also manage their classes and add or remove users from it.

## Technical Description
The application is built using React, Node.js, Express, and MySQL. Both front and back-end are written in TypeScript. The web client communicates with the backend REST API using Axios. The backend uses TypeORM to communicate with the MySQL database.

## Getting Started
1. Install nodejs (it will automatically install npm)
2. Install yarn
   `npm install -g yarn`
3. Prepare different .env configuration files as .env.example in `Server` folder
  The configuration files are as lists:

  | Name        | Environment               |
  | ----------- | ------------------------- |
  | .env.dev    | Development               |
  | .env.test   | Test                      |
  | .env.heroku | Deploy on Heroku          |
  | .env.prod   | Deploy on CLient's server |

### Setup a local MySQL database on Docker:
```bash
# Start the MySQL server container
docker run --name local-db -p 3306:3306 -e MYSQL_ROOT_PASSWORD=password -d mysql:8.0
# Copy SQL script to container
docker cp ./init.sql container_id:/tmp/init.sql
# Connect to the MySQL server container
docker exec -it local-db bash
# Start MySQL client
mysql -u root -p
# enter your password from first command
# Run SQL script
mysql> source init.sql
```

### To Run Backend Server:
1. `cd server/`
2. `yarn`
3. `yarn start`

### To Run Frontend Client:
1. `cd client/`
2. `yarn`
3. `yarn start`

## To Deploy On Heroku:
1. Enter the root folder
2. `Heroku login`
3. `Heroku create -a mymathapp`
4. `git push heroku main`

## Contributors
Cheng Niu, Shuang Yu, Zhiting Zhao, Yongqing Liang, Shuyu Wang, Yun Du, Andrew Crenwelge
