from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

client = MongoClient('mongodb://localhost:27017/')
db = client['users']


try:
    databases = client.list_database_names()
    print("Databases:", databases)
    print("MongoDB connection successful.")
except Exception as e:
    print("Failed to connect to MongoDB:", e)


@app.route('/')
def welcome():
    # HTML content with a welcome message and an image
    html_content = '''
    <!DOCTYPE html>
    <html>
    <head>
        <title>real</title>
    </head>
    <body>
        <h1>welcome to the back end</h1>
        <img src="https://uproxx.com/wp-content/uploads/2023/06/Young-Thug-BET-Hip-Hop-Awards-2021-1024x437-1.jpeg?w=1024&h=437&crop=1" alt="Welcome Image">
    </body>
    </html>
    '''
    return render_template_string(html_content)
    


@app.route('/register', methods=['POST'])
def register():
    user_info = request.json
    username = user_info['username']
    password = user_info['password']
    email = user_info['email']

    #hash password
    hash = generate_password_hash(password)

    if db.users.find_one({"username": username}):
        return jsonify({"error": "Username already exists"}), 409
    
    db.users.insert_one({"username": username, "password": hash, "email": email})
    # db.users.insert_one({"username": username, "password": password, "email": email})

    return jsonify({"message": "User created successfully"}), 201

    
@app.route('/login', methods=['POST'])
def login():
    user_info = request.json
    username = user_info['username']
    password = user_info['password']


    user = db.users.find_one({"username": username})
    print(user)

    if user and check_password_hash(user['password'], password):
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"error": "Invalid username or password"}), 401
    

if __name__ == '__main__':
    app.run(debug=True, port=5000)



