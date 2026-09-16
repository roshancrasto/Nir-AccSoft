import urllib.request
import urllib.parse
import json

def test_ledger():
    base_url = "http://localhost:5284/api"
    
    # Login to get token
    login_data = json.dumps({"username": "admin", "password": "password"}).encode('utf-8')
    req = urllib.request.Request(f"{base_url}/Auth/login", data=login_data, method="POST")
    req.add_header("Content-Type", "application/json")
    
    try:
        with urllib.request.urlopen(req) as response:
            res = json.loads(response.read().decode('utf-8'))
            token = res.get("token")
    except Exception as e:
        print("Login failed:", e)
        return

    # Hit Account Ledger API for Badagabettu (1)
    url = f"{base_url}/Report/accountledger?accountId=1&fromDate=2025-04-01&toDate=2026-03-31"
    req = urllib.request.Request(url, method="GET")
    req.add_header("Authorization", f"Bearer {token}")
    
    try:
        with urllib.request.urlopen(req) as response:
            res = json.loads(response.read().decode('utf-8'))
            print("Badagabettu Ledger:")
            print("OpeningBalance:", res.get("openingBalance"))
            print("Transactions Count:", len(res.get("transactions", [])))
    except Exception as e:
        print("Badagabettu API failed:", e)
        
    # Hit Account Ledger API for Cash (5)
    url = f"{base_url}/Report/accountledger?accountId=5&fromDate=2025-04-01&toDate=2026-03-31"
    req = urllib.request.Request(url, method="GET")
    req.add_header("Authorization", f"Bearer {token}")
    
    try:
        with urllib.request.urlopen(req) as response:
            res = json.loads(response.read().decode('utf-8'))
            print("Cash Ledger:")
            print("OpeningBalance:", res.get("openingBalance"))
            print("Transactions Count:", len(res.get("transactions", [])))
    except Exception as e:
        print("Cash API failed:", e)

if __name__ == "__main__":
    test_ledger()
