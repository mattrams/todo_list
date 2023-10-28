from flask import Flask, render_template, request
import json
app = Flask(__name__)

@app.route('/', methods = ['POST','GET'])
def main():
    return render_template('index.html')

@app.route('/add_item', methods = ['POST','GET'])
def add_item():
    if request.method == 'POST':
        result = json.loads(request.data)
        with open('list.txt','a+') as file:
            file.write(result['item'] + '\n')
        with open('list.txt','r') as file:
            out = file.readlines()
            return json.dumps({'items':out})

@app.route('/fetch_items', methods = ['POST','GET'])
def fetch_items():
    with open('list.txt','r') as file:
        out = file.readlines()
        return json.dumps({'items':out})

@app.route('/delete_item', methods = ['POST','GET'])
def delete_item():
    if request.method == 'POST':
        result = json.loads(request.data)
    # we need to read the file, store it in list, delete the required item and write it back to the file
    with open('list.txt','r+') as file:
        out = file.readlines()
        out.pop(int(result['num'])-1)
        file.seek(0)
        file.truncate()
        file.writelines(out)
        return json.dumps({'items':out})

@app.route('/edit_item', methods = ['POST','GET'])
def edit_item():
    if request.method == 'POST':
        result = json.loads(request.data)
        print(result)
    with open('list.txt','r+') as file:
        out = file.readlines()
        print(out)
        out[int(result['num'])-1] = result['item']+'\n'
        file.seek(0)
        file.truncate()
        file.writelines(out)
        print(out)
        return json.dumps({'items':out})
    
if __name__ == '__main__':
    app.run(debug = True)