from flask import Flask, request, jsonify
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy import inspect
from models import Base, Todo
import json

app = Flask(__name__)

# Database setup
engine = create_engine('sqlite:///todo.db')
Session = sessionmaker(bind=engine)
session = Session()

# Create the database if it doesn't exist
inspector = inspect(engine)
if 'todos' not in inspector.get_table_names():
    Base.metadata.create_all(engine)

@app.route('/todo/seed', methods=['POST'])
def seed_database():
    with open('seed_data.json', 'r') as f:
        data = json.load(f)

    for todo_data in data['todos']:
        todo = Todo(id=todo_data['id'], title=todo_data['title'], completed=todo_data['completed'])
        session.add(todo)
    session.commit()

    return jsonify({'message': 'Database seeded successfully'}), 200

@app.route('/todo', methods=['GET'])
def get_todos():
    todos = session.query(Todo).all()
    return jsonify([todo.to_dict() for todo in todos])

@app.route('/todo/<int:id>', methods=['GET'])
def get_todo(id):
    todo = session.query(Todo).get(id)
    if todo:
        return jsonify(todo.to_dict())
    else:
        return jsonify({'message': 'Todo not found'}), 404

@app.route('/todo', methods=['POST'])
def create_todo():
    data = request.get_json()
    todo = Todo(title=data['title'], completed=False)
    session.add(todo)
    session.commit()
    return jsonify(todo.to_dict()), 201

@app.route('/todo/<int:id>', methods=['PUT'])
def complete_todo(id):
    todo = session.query(Todo).get(id)
    todo.completed = not todo.completed
    session.commit()
    return jsonify(todo.to_dict())

@app.route('/todo/<int:id>', methods=['DELETE'])
def delete_todo(id):
    todo = session.query(Todo).get(id)
    session.delete(todo)
    session.commit()
    return jsonify({'message': 'Todo deleted'}), 204

if __name__ == '__main__':
    app.run(debug=True)