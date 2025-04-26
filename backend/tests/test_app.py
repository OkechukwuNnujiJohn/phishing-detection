import pytest
from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_home(client):
    response = client.get('/')
    assert response.status_code == 200
    assert b"Flask API is running" in response.data

def test_login(client):
    response = client.post('/api/login', json={
        'username': 'admin',
        'password': 'password'
    })
    assert response.status_code == 200
    assert 'access_token' in response.get_json()
