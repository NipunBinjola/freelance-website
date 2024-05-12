import json
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_register_user():
    # Test user registration endpoint
    data = {
        "username": "testuser",
        "password": "testpassword"
    }
    response = client.post("/register", json=data)
    assert response.status_code == 200
    assert response.json() == {"message": "User registered successfully"}

def test_login_user():
    # Test user login endpoint
    data = {
        "username": "testuser",
        "password": "testpassword"
    }
    response = client.post("/login", json=data)
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_get_user():
    # Test get user endpoint
    response = client.get("/user")
    assert response.status_code == 200
    assert "username" in response.json()

def test_update_user():
    # Test update user endpoint
    data = {
        "username": "newusername"
    }
    response = client.put("/user", json=data)
    assert response.status_code == 200
    assert response.json() == {"message": "User updated successfully"}

def test_delete_user():
    # Test delete user endpoint
    response = client.delete("/user")
    assert response.status_code == 200
    assert response.json() == {"message": "User deleted successfully"}