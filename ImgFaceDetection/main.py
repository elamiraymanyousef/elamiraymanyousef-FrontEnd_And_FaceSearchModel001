from flask import Flask, request, jsonify
from flask_cors import CORS
import face_recognition
import os
import tempfile
import base64
import requests
<<<<<<< HEAD
import pickle
=======
>>>>>>> 6f850aab64cac932e197742a0977e4c349097f84

app = Flask(__name__)
CORS(app)

<<<<<<< HEAD
KNOWN_FOLDER = "images"
ENCODINGS_FILE = "encodings.pkl"
os.makedirs(KNOWN_FOLDER, exist_ok=True)

FACES_API_URL = "http://hopesystem.runasp.net/api/Reports/faces"
AUTH_HEADER = {
    "accept": "*/*",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjU4ZjBkMTAwLTMzNzItNDlhMS1hYTRmLTA3NTM0N2RiNWY2NSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJ0aGVhYmFub3Vic2FsZWhAZ21haWwuY29tIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvZW1haWxhZGRyZXNzIjoidGhlYWJhbm91YnNhbGVoQGdtYWlsLmNvbSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2dpdmVubmFtZSI6IlN1cGVyIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvc3VybmFtZSI6IkFkbWluIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiU3VwZXJBZG1pbiIsImV4cCI6MTc0Njk2MjExMiwiaXNzIjoiaHR0cHM6Ly9Ib3BlLmNvbSIsImF1ZCI6Imh0dHBzOi8vSG9wZS5jb20ifQ.nM11WbensT8F-hJLGbQzyQ_LrcPQYMR3HstsVBB_l3U"
}

def download_images():
    response = requests.get(FACES_API_URL, headers=AUTH_HEADER)
    if response.status_code == 200:
        image_urls = response.json()
=======
KNOWN_FOLDER = "images"  
os.makedirs(KNOWN_FOLDER, exist_ok=True)

FACES_API_URL = "http://hopesystem.runasp.net/api/Reports/faces"  

def download_images():
    response = requests.get(FACES_API_URL, headers={
        "accept": "*/*",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjQxNzM2Y2IyLTdmNWYtNDFlZS05NjAwLWQ1MTMyNjU0ZTIyOSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJhbGFteXJheW1hbjcyMkBnbWFpbC5jb20iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJhbGFteXJheW1hbjcyMkBnbWFpbC5jb20iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9naXZlbm5hbWUiOiJhbWlyICIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL3N1cm5hbWUiOiLYp9mE2KfZhdmK2LEiLCJleHAiOjE3NDYzNTc5MDksImlzcyI6Imh0dHBzOi8vSG9wZS5jb20iLCJhdWQiOiJodHRwczovL0hvcGUuY29tIn0.ypXXpawPKJxD7DGycUKvyGWLa_Zrrcs-mRC69YGE9hw"
    })

    if response.status_code == 200:
        image_urls = response.json()  
>>>>>>> 6f850aab64cac932e197742a0977e4c349097f84
        for image_url in image_urls:
            try:
                img_response = requests.get(image_url)
                if img_response.status_code == 200:
                    filename = os.path.basename(image_url).split("?")[0]
                    img_path = os.path.join(KNOWN_FOLDER, filename)
                    with open(img_path, 'wb') as f:
                        f.write(img_response.content)
<<<<<<< HEAD
            except Exception as e:
                print(f"Error downloading {image_url}: {e}")

def load_encodings():
    if os.path.exists(ENCODINGS_FILE):
        with open(ENCODINGS_FILE, 'rb') as f:
            return pickle.load(f)
    return {}

def save_encodings(encodings):
    with open(ENCODINGS_FILE, 'wb') as f:
        pickle.dump(encodings, f)

def update_encodings():
    known_encodings = load_encodings()
    files = [
        f for f in os.listdir(KNOWN_FOLDER)
        if f.lower().endswith(('.jpg', '.jpeg', '.png'))
    ]
    new_files = [f for f in files if f not in known_encodings]
    for filename in new_files:
        path = os.path.join(KNOWN_FOLDER, filename)
        try:
            image = face_recognition.load_image_file(path)
            encodings = face_recognition.face_encodings(image)
            if encodings:
                known_encodings[filename] = encodings[0]
        except:
            continue
    save_encodings(known_encodings)
    return known_encodings

download_images()
known_encodings = update_encodings()
=======
                    print(f"Downloaded {filename}")
            except Exception as e:
                print(f"Error downloading image {image_url}: {e}")
    else:
        print("Failed to fetch images from API")

download_images()
>>>>>>> 6f850aab64cac932e197742a0977e4c349097f84

@app.route('/search-face', methods=['POST'])
def search_face():
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400

    uploaded_file = request.files['image']
    with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp:
        uploaded_file.save(temp.name)
        uploaded_path = temp.name

    try:
        reference_image = face_recognition.load_image_file(uploaded_path)
        reference_encodings = face_recognition.face_encodings(reference_image)
        if not reference_encodings:
<<<<<<< HEAD
            return jsonify({"error": "No face found"}), 400
        reference_encoding = reference_encodings[0]

        matched_images = []
        for filename, encoding in known_encodings.items():
            result = face_recognition.compare_faces([encoding], reference_encoding)
            if True in result:
                path = os.path.join(KNOWN_FOLDER, filename)
                with open(path, "rb") as img_file:
                    encoded_img = base64.b64encode(img_file.read()).decode("utf-8")
                matched_images.append({
                    "name": os.path.splitext(filename)[0],
                    "image_base64": f"data:image/jpeg;base64,{encoded_img}"
                })
        return jsonify({
            "match_found": bool(matched_images),
            "matched_images": matched_images
        })

    finally:
        os.remove(uploaded_path)
=======
            return jsonify({"error": "No face found in uploaded image"}), 400

        reference_encoding = reference_encodings[0]

        matched_images = []
        for filename in os.listdir(KNOWN_FOLDER):
            if filename.lower().endswith(('.jpg', '.jpeg', '.png')):  
                img_path = os.path.join(KNOWN_FOLDER, filename)
                image = face_recognition.load_image_file(img_path)
                encodings = face_recognition.face_encodings(image)
                for encoding in encodings:
                    result = face_recognition.compare_faces([reference_encoding], encoding)
                    if True in result:
                        with open(img_path, "rb") as image_file:
                            encoded_string = base64.b64encode(image_file.read()).decode('utf-8')

                        matched_images.append({
                            "name": os.path.splitext(filename)[0],
                            "image_base64": f"data:image/jpeg;base64,{encoded_string}"
                        })
                        break  

        if matched_images:
            return jsonify({"match_found": True, "matched_images": matched_images})
        else:
            return jsonify({"match_found": False})

    finally:
        os.remove(uploaded_path)  
>>>>>>> 6f850aab64cac932e197742a0977e4c349097f84

if __name__ == '__main__':
    app.run(debug=True)