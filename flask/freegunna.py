from flask import Flask, request, jsonify, render_template_string, make_response
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
import heapq
# import random
# import json
# import os
# from urllib.parse import urlparse
# import re


app = Flask(__name__)
#CORS(app)
CORS(app, origins='http://localhost:3000')

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
# Priority Queue --------------------------------------------------------------------------------------------------------------
prio_heap = []

def push_to_heap(urlThing):
    heapq.heappush(prio_heap, urlThing)

def pop_heap():
    return heapq.heappop(prio_heap)
# -----------------------------------------------------------------------------------------------------------------------------
# Simple class that dictates how URL objects are made and handled.
class URLobj:
    def __init__(self,id,url,url_score=1,para_score=1,avg_score=1,pid=None):
        self.id = id
        self.url = url
        self.url_score = url_score
        self.para_score = para_score
        self.avg_score = avg_score
        self.pid = pid
        self.children = []

    # Less than comparison (<)
    def __lt__(self, other):
        return self.avg_score > other.avg_score

    def __str__(self):
        return f"(URL: {self.url}, ID: {self.id}, Avg Score: {self.avg_score}, PID: {self.pid})"
    
    # Method to convert URLThing to JSONArray
    def toJSON(self):
        return {
                "ID": self.id, 
                "URL": self.url, 
                "URL_Score": self.url_score, 
                "Para_Score": self.para_score, 
                "Avg_score":self.avg_score, 
                "PID": self.pid,
                "children": [child.toJSON() for child in self.children]
            } 

    def add_child(self,child):
        self.children.append(child)

    def remove_child(self,child):
        self.children.remove(child)

# -----------------------------------------------------------------------------------------------------------------------------

# Function to collect URLs from user input and push URLs to heap.
def read_urls_from_file(file_name):

    with open(file_name, 'r') as file:
        # Read the content of the file and split it into individual URLs
        urls = file.read().split('\n')

        for url in urls:
            global count
            hold = URLobj(count,url)
            push_to_heap(hold) # Given URLs will be assumed as valid
            crawlJSONArray.append(hold.toJSON())
            count+=1

  
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



#endpoint that performs crawl
@app.route('/scrape_and_save', methods = ["POST"])
def scrape_and_save():
    print('\n\n\nhit scrape\n\n\n')

    if request.method == 'OPTIONS':
    # Respond to preflight request
        response = make_response()
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response

    #variables for user hard count caps
    global userHardCount
    userHardCount = int(request.form['urlTotal'])
    global urlThreshold
    urlThreshold = float(request.form['urlThreshold'])
    global paraThreshold
    paraThreshold = float(request.form['paraThreshold'])
    global pageTotal
    pageTotal = float(request.form['pageTotal'])
    global crawlJSONArray
    
    #uploaded file.
    # Accessing files
    for key in request.files:
        uploaded_file = request.files[key]
        filename = uploaded_file.filename

        if filename != '':
            # Process the file as needed (e.g., save it)
            uploaded_file.save(filename)
            print(f"Saved file '{filename}'")

            read_urls_from_file(uploaded_file.filename) 

            global crawl_id

            crawl_id = request.form['crawl_id']

    #for testing
    print(userHardCount)
    response_data = {
        "message": "recieved form data",
        "data": userHardCount
    }
    return jsonify(response_data), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)



