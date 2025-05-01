from flask import Flask, request, jsonify
from flask_cors import CORS
import face_recognition
import os
import tempfile
import base64
import requests

app = Flask(__name__)
CORS(app)

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
        for image_url in image_urls:
            try:
                img_response = requests.get(image_url)
                if img_response.status_code == 200:
                    filename = os.path.basename(image_url).split("?")[0]
                    img_path = os.path.join(KNOWN_FOLDER, filename)
                    with open(img_path, 'wb') as f:
                        f.write(img_response.content)
                    print(f"Downloaded {filename}")
            except Exception as e:
                print(f"Error downloading image {image_url}: {e}")
    else:
        print("Failed to fetch images from API")

download_images()

@app.route('/search-face', methods=['POST'])
def search_face():
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    uploaded_file = request.files['image']

    with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp:
        uploaded_file.save(temp.name)
        uploaded_path = temp.name

    try:
        reference_image = face_recognition.load_image_file(uploaded_path)
        reference_encodings = face_recognition.face_encodings(reference_image)
        if not reference_encodings:
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

if __name__ == '__main__':
    app.run(debug=True)
