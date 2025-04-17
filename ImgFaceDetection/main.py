from flask import Flask, request, jsonify
from flask_cors import CORS 
import face_recognition
import os
import tempfile
import base64

app = Flask(__name__)

CORS(app)

KNOWN_FOLDER = "E:\proj\ImgFaceDetection\mods"  #تخيزين الباص

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
            print("Done!")
        else:
            return jsonify({"match_found": False})

    finally:
        os.remove(uploaded_path)  # clean up

if __name__ == '__main__':
    app.run(debug=True)
