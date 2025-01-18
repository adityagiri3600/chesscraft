from dotenv import load_dotenv
import os
import json

load_dotenv()

import google.generativeai as genai
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel("gemini-2.0-flash-exp")

from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/ask", methods=["POST"])
def ask():
    piece_one = request.get_json()["piece_one"]
    piece_two = request.get_json()["piece_two"]
    system = "you're an ai that lists the valid moves a hypothetical combination of chess pieces can make in the form of (∆x,∆y) in a list. do not output anything else other than the list. also make sure the output is interesting game wise. Output in a json format first arguement is jump moves like a knight or pawn, second is directional moves which can be repeated indefinitely like a bishop or a rook, third is capture which includes the jump and direction moves for capturing, if capture moves are same as normal moves don't pass in the capture move parameter\nexamples:\nwhite pawn : {\n        jump: [[0, 1]],\n        direction: [],\n        capture: {\n          jump: [[1, 1], [-1, 1]]\n        }\n      }\nwhite rook: \n{\n        jump: [],\n        direction: [[1, 0], [-1, 0], [0, 1], [0, -1]]\n      } do not use any formatting like backticks output in plain text!!! most important !! USE PLAIN TEXT DONT OUTPUT IN CODE BLOCK"
    system += "\nyour task: combine " + piece_one + "+" + piece_two
    response = model.generate_content(system).text
    if response[0] == '`':
        # remove first and last lines
        response = response.split("\n")[1:-1]
        response = "\n".join(response)
    print(response)
    return jsonify(json.loads(response))
    
    
    # return jsonify({
    # "jump": [[0, 1], [1, 2], [-1, 2], [1, -2], [-1, -2], [2, 1], [-2, 1], [2, -1], [-2, -1]],
    # "direction": [],
    # "capture": {
    #   "jump": [[1, 1], [-1, 1], [1, 2], [-1, 2], [1, -2], [-1, -2], [2, 1], [-2, 1], [2, -1], [-2, -1]]
    #     }
    # })

if __name__ == "__main__":
    app.run(debug=True)

# test code
# piece_one = "white pawn"
# piece_two = "white knight"
# system = "you're an ai that lists the valid moves a hypothetical combination of chess pieces can make in the form of (∆x,∆y) in a list. do not output anything else other than the list. also make sure the output is interesting game wise. Output in a json format first arguement is jump moves like a knight or pawn, second is directional moves which can be repeated indefinitely like a bishop or a rook, third is capture which includes the jump and direction moves for capturing, if capture moves are same as normal moves don't pass in the capture move parameter\nexamples:\nwhite pawn : {\n        jump: [[0, 1]],\n        direction: [],\n        capture: {\n          jump: [[1, 1], [-1, 1]]\n        }\n      }\nwhite rook: \n{\n        jump: [],\n        direction: [[1, 0], [-1, 0], [0, 1], [0, -1]]\n      } do not use any formatting like backticks output in plain text"
# system += "\nyour task: combine " + piece_one + "+" + piece_two
# response = model.generate_content(system).text
# print(response)
# import json
# print(json.dumps(json.loads(response), indent=4))