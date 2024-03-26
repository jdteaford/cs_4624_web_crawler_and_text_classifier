from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError
from werkzeug.security import generate_password_hash, check_password_hash

from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from functools import wraps

import argparse
import requests
# from bs4 import BeautifulSoup
# import datetime
# from operator import itemgetter
# import heapq
# import random
# import json
# import os
# from urllib.parse import urlparse
# import re


app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'professor_farag'
jwt = JWTManager(app)

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

@app.route('/verify', methods=['GET'])
@jwt_required()
def verify():
    user = get_jwt_identity()
    return jsonify(logged_in_as=user), 200


@app.route('/register', methods=['POST', 'OPTIONS'])
def register():
    print('here')
    #handle preflight request first
    if request.method == 'OPTIONS':
        print('hit')
        # Respond to preflight request
        response = app.make_default_options_response()
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
        response.headers['Access-Control-Allow-Methods'] = 'POST'
        return response

    user_info = request.json
    username = user_info['username']
    password = user_info['password']
    email = user_info['email']

    # hash password
    hash = generate_password_hash(password)

    if db.users.find_one({"username": username}):
        return jsonify({"error": "Username already exists"}), 409
    
    # Add user to database 
    db.users.insert_one({"username": username, "password": hash, "email": email})

    # Generate JWT token
    access_token = create_access_token(identity=username)
    return jsonify(access_token=access_token), 201

    
@app.route('/login', methods=['POST'])
def login():
    user_info = request.json
    username = user_info['username']
    password = user_info['password']


    user = db.users.find_one({"username": username})
    print(user)

    if user and check_password_hash(user['password'], password):
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({"error": "Invalid username or password"}), 401
    
#////////////////////////////////////////////////////////////////////////////////////////////////////
#///////////////////////////////////// the wall /////////////////////////////////////////////////////
#////////////////////////////////////////////////////////////////////////////////////////////////////
    
keywords = ["Monterey", "Park", "California", "mass", "shooting", "mass", "shooting", "Lunar", "New", "Year", "Los", "Angeles", "mass", "shooting",    "Lunar", "New", "Year", "shooting",    "California", "shooting",    "Mass", "shooting", "victims",    "Monterey", "Park", "mass", "shooter",    "Mayor", "Karen", "Bass",    "Victims", "identified",    "Gunman", "manhunt",    "Police", "search", "motive",    "Back-to-back", "mass", "shootings",    "Suspected", "shooter",    "Gun", "safety",    "LAPD", "response",    "Manifesto",    "Asian", "American", "communities",    "Joe", "Biden", "statement",    "Shooting", "at", "dance", "club",    "Kinship", "with", "U.S.", "city",    "Monterey", "Park", "essay",    "911", "call", "audio",    "Biden's", "executive", "order", "on", "gun", "control", "Shooting", "at", "Chinese", "New", "Year", "celebration",    "General", "news",    "Shooting", "near", "Lunar", "New", "Year", "festival",    "Processing", "a", "tragedy",    "Community", "mourns",    "Georgia", "shooting",    "Active", "shooter",    "Hampton", "Georgia", "shooting",    "Midtown", "Atlanta", "shooting",    "Northside", "Hospital",    "Hospital", "massacre",    "Deion", "Patterson",    "Massacre", "suspect", "charged",    "What", "we", "know", "about", "the", "victims",    "Victims", "of", "mass", "shooting",    "Hospital", "shooting", "in", "Atlanta",    "Mass", "shooting", "reports",    "Canada", "shooting",    "Monterey", "Park", "press", "release",    "National", "news",    "Multiple", "casualties",    "Gunman's", "manifesto",    "Gun", "control",    "Biden", "statement",    "Mass", "shooting", "response",    "Medical", "facility", "shooting",    "University", "of", "North", "Carolina", "shooting","Zijie", "Yan",    "UNC", "shooting", "victim",    "Active", "shooter", "situation",    "West", "Peachtree", "Street",    "Spa", "shootings","Atlanta", "shooting",    "Atlanta", "Midtown", "shooting",    "Suspect", "Deion", "Patterson",    "Mass", "shooting", "on", "loose",    "Policing", "Equity"]

urlThreshold = 0.0
paraThreshold = 0.0

userHardCount = 10
userScoutCount = 100

pageDownloadTotal = 10 # We broke so we capping the number of downloaded pages. Bruh moment

count = 0
page_count = 0

processed_url_names = []

crawlJSONArray = []
crawlStatSucc = {}
crawlStatFails = {}

crawl_id = ""

hubs = 0

if __name__ == '__main__':
    app.run(debug=True, port=5000)



