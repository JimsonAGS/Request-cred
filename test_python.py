from flask import Flask, jsonify, request
from flask_cors import CORS
import logging
import smtplib

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

logging.basicConfig(level=logging.INFO)

@app.before_request
def log_request_info():
    logging.info(f"Headers: {request.headers}")
    logging.info(f"Body: {request.get_data()}")

@app.post('/details/<connection_name>')
def get_details(connection_name):
    connection = str(connection_name)
    email = request.json.get('email')

    if not email:
        return jsonify({"message": "Email is required"}), 400
    print(email)
    Sender = "jimson.ags@gmail.com"
    Receiver = email

    # Logging the request for credentials
    logging.info(f"User {email} requested credentials for {connection}")

    # Here you would include logic to get credentials from a file or database
    # For this example, we'll just create a dummy message
    Msg = f"You have received credentials for {connection}"

    try:
        smtpObj = smtplib.SMTP("smtp.gmail.com", 587)  
        smtpObj.starttls()
        smtpObj.login("jimson.ags@gmail.com", "hhwu ncrs wnkw tfxo")
        smtpObj.sendmail(Sender, Receiver, Msg)
        smtpObj.quit()
    except Exception as e:
        logging.error(f"Error sending email: {e}")
        return jsonify({"message": "Error sending email"}), 500

    return jsonify({"message": f"The {connection} credentials have been sent to the user's email."})

@app.route('/')
def home():
    return "Home page"

if __name__ == '__main__':
    app.run(debug=True)
