#!/bin/bash
sudo clear

#Installing MySQL
sudo apt-get install mysql-server mysql-client

#Creating a database in accordance to config.js
#Default password is a blank string
USER="root"
HOST="localhost"
NAME="fba"
sudo mysqladmin -u $USER -h $HOST -p create $NAME

#Entering MySQL interface
clear
sudo mysql -u $USER -h $HOST -p


#To Create a new Table:
# mysql > USE <db>
# mysql > CREATE TABLE <table_name> (<param1> <type1>, <param2> <type2>, ... );

#To Insert:
# mysql > INSERT INTO <table_name> (<param1>, <param2> ...)	VALUES (<value1>, <value2>, ...);

#To Retrieve:
# mysql > SELECT <field> FROM <table_name>;

#To Update:
# mysql > UPDATE <table_name>;
# mysql > SET <field> = <value>;
# mysql > WHERE <field> = <value>;

#To grant user permission:
# mysql > GRANT ALL PRIVILEGED ON <db> TO <user>;
