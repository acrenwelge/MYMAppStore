# MyMathApp

CSCE606 Textbook Project in Spring 2023.

## Before run you need:
1. install nodejs(it will automatically install npm)

2. install yarn
   `npm install -g yarn`
   
3. Prepare different .env configuration files as .env.example in `Server` folder
  The configuration files are as lists:

  | Name        | Environment               |
  | ----------- | ------------------------- |
  | .env.dev    | Development               |
  | .env.test   | Test                      |
  | .env.heroku | Deploy on Heroku          |
  | .env.prod   | Deploy on CLient's server |

## To Development locally

### Setup a local MySQL database on Docker:
```bash
# Start the MySQL server container
docker run --name local-db -e MYSQL_ROOT_PASSWORD=password -d mysql:8.0
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
1. Enter server folder
2. `yarn`
3. `yarn start`

### To Run Frontend Client:
1. Enter client folder
2. `yarn`
3. `yarn start`

## To Deploy On Heroku:
1. Enter the root folder
2. `Heroku login`
3. `Heroku create -a mymathapp`
4. `git push heroku main`

## Contributor
Cheng Niu, Shuang Yu, Zhiting Zhao, Yongqing Liang, Shuyu Wang, Yun Du
