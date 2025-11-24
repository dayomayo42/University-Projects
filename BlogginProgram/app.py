from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__, template_folder='.')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///blog.db'
db = SQLAlchemy(app)
app.app_context().push()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    subscriptions = db.relationship('Subscription', backref='subscriber', lazy=True, foreign_keys='Subscription.user_id')

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(500), nullable=False)
    tags = db.Column(db.String(120), nullable=True)
    hidden = db.Column(db.Boolean, default=False)  # Для скрытых постов
    comments = db.relationship('Comment', backref='post', lazy=True)

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(200), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=False)

class Subscription(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    subscribed_user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

@app.route('/')
def home_page():
    return render_template('index.html')

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    new_user = User(username=data['username'], password=data['password'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "Пользователь зарегистрирован!"})

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data['username'], password=data['password']).first()
    
    if user:
        return jsonify({"message": "Вход выполнен!", "user_id": user.id})
    else:
        return jsonify({"message": "Неверное имя пользователя или пароль!"})

@app.route('/posts', methods=['GET', 'POST'])
def posts():
    if request.method == 'POST':
        data = request.json
        new_post = Post(content=data['content'], tags=','.join(data['tags']), hidden=data.get('hidden', False))
        db.session.add(new_post)
        db.session.commit()
        return jsonify({"message": "Пост опубликован!"})
    
    # Сортировка по тегам
    tag_filter = request.args.get('tag')
    if tag_filter:
        posts = Post.query.filter(Post.tags.like(f'%{tag_filter}%')).all()
    else:
        posts = Post.query.all()

    return jsonify([{"id": post.id, "content": post.content, "tags": post.tags.split(','), "hidden": post.hidden} for post in posts if not post.hidden])

@app.route('/posts/<int:post_id>', methods=['PUT', 'DELETE'])
def edit_delete_post(post_id):
    post = Post.query.get_or_404(post_id)
    
    if request.method == 'PUT':
        data = request.json
        post.content = data['content']
        post.tags = ','.join(data['tags'])
        post.hidden = data.get('hidden', False)
        db.session.commit()
        return jsonify({"message": "Пост обновлен!"})

    if request.method == 'DELETE':
        db.session.delete(post)
        db.session.commit()
        return jsonify({"message": "Пост удален!"})

@app.route('/posts/<int:post_id>/comments', methods=['POST', 'GET'])
def add_comment(post_id):
    if request.method == 'POST':
        data = request.json
        new_comment = Comment(content=data['content'], post_id=post_id)
        db.session.add(new_comment)
        db.session.commit()
        return jsonify({"message": "Комментарий добавлен!"})
    
    comments = Comment.query.filter(Comment.post_id.like(f'%{post_id}%')).all()
    return jsonify([{"id": comment.id, "content": comment.content, "post_id": comment.post_id} for comment in comments])
        
        

@app.route('/subscribe', methods=['POST'])
def subscribe():
    data = request.json
    subscription = Subscription(user_id=data['user_id'], subscribed_user_id=data['subscribed_user_id'])
    db.session.add(subscription)
    db.session.commit()
    return jsonify({"message": "Подписка оформлена!"})

if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)