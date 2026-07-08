import json
DATA_FILE="student_data.json"
def save_data(data):
    with open(DATA_FILE,"w") as f: json.dump(data,f,indent=4)
def load_data():
    try:
        with open(DATA_FILE) as f:return json.load(f)
    except (FileNotFoundError,json.JSONDecodeError):
        return None
