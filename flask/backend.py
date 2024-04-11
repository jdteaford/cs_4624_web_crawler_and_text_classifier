from flask import Flask, request, jsonify, render_template_string, make_response
from flask_cors import CORS
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError
from werkzeug.security import generate_password_hash, check_password_hash

from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from functools import wraps

import argparse
import requests
from bs4 import BeautifulSoup
import datetime
# from operator import itemgetter
import heapq
# import random
import json
import os
from urllib.parse import urlparse
import re


app = Flask(__name__)
#CORS(app)
# CORS(app, origins='http://localhost:3000')
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

app.config['SECRET_KEY'] = 'professor_farag'
jwt = JWTManager(app)

client = MongoClient('mongodb://localhost:27017/')
db = client['users']
db1 = client['crawl_data']


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
    
@app.route('/crawl_history', methods=['GET'])
def crawl_history():
    return jsonify({"blank"}), 200

#////////////////////////////////////////////////////////////////////////////////////////////////////
#///////////////////////////////////// the wall /////////////////////////////////////////////////////
#////////////////////////////////////////////////////////////////////////////////////////////////////

# Priority Queue --------------------------------------------------------------------------------------------------------------
prio_heap = []

def push_to_heap(URLobj):
    heapq.heappush(prio_heap, URLobj)

def pop_heap():
    return heapq.heappop(prio_heap)
# -----------------------------------------------------------------------------------------------------------------------------


# THE PREDICT FUNCTION ~
def predict(input_string, keyword_list):
    # Convert the input string to lowercase for case-insensitive matching
    input_string = input_string.lower()
    
    # Initialize a variable to keep track of the number of keyword matches
    num_matches = 0
    
    # Iterate through the keyword list and check for matches in the input_string
    for keyword in keyword_list:
        # Use a regular expression to search for the keyword in the input_string
        if re.search(r'\b' + re.escape(keyword.lower()) + r'\b', input_string):
            num_matches += 1
    # print(f"NUMBER OF MATCHES: {num_matches}")
    # Calculate the percentile score as the ratio of matches to total keywords
    percentile_score = (num_matches / len(keyword_list))
    
    return percentile_score

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
    
    # Method to convert URLobj to JSONArray
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

def get_base_url(url):
    parsed_url = urlparse(url)
    return f"{parsed_url.scheme}://{parsed_url.netloc}"
  
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


def pop_scrape():
    global page_count, count, crawl_id
    
    #Create a local directory to save crawls

    current_date = datetime.datetime.now().strftime("%Y-%m-%d")
    download_dir = f"{current_date}_webpage collection_{crawl_id}"
    os.makedirs(download_dir, exist_ok=True)

    #Pop the first URL
    url = pop_heap()

    #print(url.url)
    #print(count)

    if url.url not in processed_url_names:
        # Putting it in the beginning or putting it in at the end? ++x VS x++
        processed_url_names.append(url.url)
      
        try:
            response = requests.get(url.url,timeout=7)
            if response.status_code == 200:

                soup = BeautifulSoup(response.content, 'html.parser')
                
                base_url = get_base_url(url.url)
                # hold_para_score = url.para_score
                hold_para_score = 0

                # if url.para_score == None:
                # Extracting the text from the paragraphs
                text = ""
                for paragraph in soup.find_all('p'):
                    text += paragraph.get_text() + "\n"
            
                hold_para_score = predict(text, keywords)
               
                # Download current URL's HTML file to Firebase Storage
                global page_count, pageDownloadTotal
                if page_count < pageDownloadTotal:
                    file_name = f'{url.id}.html'

                    # Specify the path to the HTML file within the folder
                    file_path = f'{crawl_id}/{url.id}.html'
                    print(file_path)
                    try:
                        # blob = storage.bucket(app=firebase_admin.get_app(),name='auto-scrape-crisis.appspot.com').blob(file_path) 
                        # bucket = storage.bucket()
                        # blob = bucket.blob(file_path)
                        
                        # blob.upload_from_string(response.content)
                        safe_filename = os.path.join(download_dir, file_name)
                        with open(safe_filename, 'w', encoding='utf-8') as f:
                            f.write(response.text)

                        print(f'Successfully uploaded {file_name}')
                    except Exception as e:
                        print(f'Error: {e}')
                    page_count+=1

                # Extract all the URLs from the webpage.
                anchors_info = [{'text': a.text, 'url': a['href']} for a in soup.find_all('a', href=True) if not a['href'].startswith(('#', 'javascript:'))]
                

                for anchor_info in anchors_info:
                    # Grabs Domain of URL for stats.
                    if anchor_info['url'].startswith("http"):
                        final_domain = anchor_info['url'].split("://")[1].split("/")[0]
                    # Handles relative URLs.
                    elif anchor_info['url'].startswith("/") and base_url != None:
                        final_domain = base_url.split("://")[1]
                        anchor_info['url'] = base_url+anchor_info['url']
                    # URL is invalid, skip URL
                    else:
                        continue


                    if count < userHardCount: # COUNT VS PAGE_COUNT???
                        anchor_score = predict(f"{anchor_info['url']} {anchor_info['text']}", keywords)
                        
                        if anchor_score != None and anchor_score >= urlThreshold:
                            avg_score = (anchor_score+hold_para_score)/2
                            temp = URLobj(count,anchor_info['url'],anchor_score,hold_para_score,avg_score,url.id)

                            # page_count+=1
                            #print(f"adding to heap: {anchor_info['url']}")
                            crawlJSONArray.append(temp.toJSON())
                            #print(temp.toJSON())
                            push_to_heap(temp)
                            #print(final_domain)
                            if final_domain in crawlStatSucc:
                                crawlStatSucc[final_domain]['count'] += 1
                                crawlStatSucc[final_domain]['scores'].append(avg_score)  # Add the anchor score to the list
                            else: 
                                crawlStatSucc[final_domain] = {'count': 1, 'scores': [anchor_score]}  # Initialize the entry with count and score
                        else:
                            if final_domain in crawlStatFails:
                                crawlStatFails[final_domain] += 1
                            else: 
                                crawlStatFails[final_domain] = 1
                        count += 1 # Count url regardless of validate

        
            else:
                print(f"Failed to retrieve content from {url.url}. Status code: {response.status_code}")
        except requests.exceptions.RequestException as e:
            print(f"An error occurred: {e}")


def run_to_db(user_id, crawl_name, crawl_id):
    global hubs, crawlJSONArray, crawlStatSucc
    # Get the current date and time
    collection_time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    temp = build_hierarchy(crawlJSONArray)
    get_avgs_of_succ()
    
    # Save the data to Firebase
    data = {
        "Crawl ID":crawl_id, 
        "message": "data in correct format",
        "Collection Time":collection_time,
        "Name": user_id, 
        "Crawl Name": crawl_name, 
        "URLs": crawlJSONArray, 
        "Number of Hubs": hubs, 
        "Stats": json.dumps(crawlStatSucc), 
        # "Tree": temp
    }
    stringVar = "hello"
    print(stringVar)
    print(data)

    db1.crawl_data.insert_one(data)

#endpoint that performs crawl
@app.route('/scrape_and_save', methods = ["POST"])
def scrape_and_save():
    print('\n\n\nhit scrape\n\n\n')

    if request.method == 'OPTIONS':
    # Respond to preflight request
        # response = make_response()
        # response.headers.add('Access-Control-Allow-Origin', 'http://127.0.0.1:3000')
        # response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        # response.headers.add('Access-Control-Allow-Methods', 'POST')
        # return response
        pass

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

    print(f"starting length: {len(prio_heap)}")
    # Begin to intergrate through the heap
    while len(prio_heap) > 0 and page_count < userHardCount:
        pop_scrape()
        print(f"HEAP COUNT: {len(prio_heap)}")
        print(count)
    run_to_db(request.form['username'], request.form['crawlname'], request.form['crawl_id'])

    #for testing
    print(userHardCount)
    response_data = {
        "message": "recieved form data",
        "data": userHardCount
    }
    return jsonify(response_data), 200

def build_hierarchy(data):
    global hubs
    
    # Create a dictionary to temporarily store items that couldn't be added initially
    parent_to_child = {}

    for item in reversed(data):
        id = item['ID']
        pid = item['PID']

        if id in parent_to_child:
            item['children'] = parent_to_child[id]
            del parent_to_child[id]

        if pid not in parent_to_child:
            parent_to_child[pid] = [item]
            hubs += 1
        else:
            parent_to_child[pid].append(item)

    return parent_to_child

def get_avgs_of_succ():
    for domain, stats in crawlStatSucc.items():
        count = stats['count']
        scores = stats['scores']
        if count > 0:
            avg_score = sum(scores) / count
            stats['avg_score'] = avg_score
        else:
            # Handle the case where there are no scores (to avoid division by zero)
            stats['avg_score'] = 0.0   

if __name__ == '__main__':
    app.run(debug=True, port=5000)



