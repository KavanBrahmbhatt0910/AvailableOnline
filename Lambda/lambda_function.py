import json
import mysql.connector

db_config = {
    'host': 'userdatabase.cj4igwfjsqif.us-east-1.rds.amazonaws.com',
    'user': 'admin',
    'password': 'Kavan091001',
}

def lambda_handler(event, context):
    try :
        connection = mysql.connector.connect(**db_config)
        db_name = 'User'
        create_db_query = f'CREATE DATABASE IF NOT EXISTS {db_name}'
        connection.cursor().execute(create_db_query)
        connection.database = db_name
        create_table_query = f'CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, email VARCHAR(255), password VARCHAR(255), role VARCHAR(255))'
        connection.cursor().execute(create_table_query)

        #inster data from body
        body = json.loads(event['body'])
        print('Body ------->',body)
        print('event ------->', event)
        email = body['email']
        password = body['password']
        role = body['role']
        insert_query = f'INSERT INTO users (email, password, role) VALUES ("{email}", "{password}", "{role}")'
        connection.cursor().execute(insert_query)
        print("Values added for user  ------->", email)
        connection.commit()

        return {
            'statusCode': 200,
            'body': json.dumps('Database and Table created successfully')
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(str(e))
        }
    finally :
        connection.close()


