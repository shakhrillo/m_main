import requests

# Replace with your access token and group ID
ACCESS_TOKEN = 'EAAH57SeXPZAgBOw3GEz7SZCPv6ChD9a2SdZBNwWS276fRcIiXsKQQNMfvjGQS7YYDzJlZCywGUkUnKtfGI7HfEqUE1P3yfEZBqFLmk7vAJ0goaXGmuty3gDNxqRtx1vMktZBYJZBr6wKiSik9rGK8lAT23l1zkY3htok4UJ3QTIqPsgxPIhOHlB0KK6SH8HPfnDPkUk9ZBe98dy8e8XUwEPYShiqqZBr5CYISK2CkZAskDeHAGuRYFf3sKVSYf2Q4s'
GROUP_ID = 'overlandmorocco'

# Facebook Graph API endpoint for getting group posts
url = f'https://graph.facebook.com/v17.0/{GROUP_ID}/feed'

# Parameters for the request
params = {
    'access_token': ACCESS_TOKEN,
    'fields': 'message,created_time,from{id,name},permalink_url'
}

# Make the request to Facebook Graph API
response = requests.get(url, params=params)

# Check for successful request
if response.status_code == 200:
    data = response.json()
    posts = data.get('data', [])
    
    # Print out the posts
    for post in posts:
        print(f"Post from {post['from']['name']} at {post['created_time']}:")
        print(post.get('message', 'No message'))
        print(f"Link: {post['permalink_url']}")
        print('-' * 40)
else:
    print(f"Error: {response.status_code}")
    print(response.json())

# appId = '556271943499160'
# appSecret = 'eca37a177c047082654ef502ba867c90'

# https://www.facebook.com/v15.0/dialog/oauth?client_id=556271943499160&redirect_uri=https%3A%2F%2Fmigrant365.org

# https://migrant365.org/?code=AQC2l5XqFSOP96lHfnBvBTXx5-ph5VhJyaosotnBmYDpMQW5Jjap9RUSJtREEAsj-lLw5Gpj2EecJpNs938eQBWt5r3WtDwK3pgMT7XPI80u0tnNvrnl_wU8XF4zs20RzlDP-IuikySdPKQ6PTwCZ6Mk5PjiNn-717FByhE5dWYmxN3pHQG70JTOU3OcghV8oO2TwB_xxza_SPlH1UrswzJTa6QmgMbcXaPHbhNB7TmX14MP6OYdcRDRsZxME1bd8uzR-n6toW5l6OjACv40CqG9jgvuHP8b775WzBU0aREWiPzvbTAtGgg_q9CubEzJKDjhaNYNkTyJWljFKmNYTTGHIPiY2rw7jbAeVQ1wiFyy_sk098g2vP4ZrVNowx8sY0Q#_=_
# https://graph.facebook.com/v15.0/oauth/access_token?client_id=556271943499160&redirect_uri=https%3A%2F%2Fmigrant365.org%2F&client_secret=eca37a177c047082654ef502ba867c90&code=AQC2l5XqFSOP96lHfnBvBTXx5-ph5VhJyaosotnBmYDpMQW5Jjap9RUSJtREEAsj-lLw5Gpj2EecJpNs938eQBWt5r3WtDwK3pgMT7XPI80u0tnNvrnl_wU8XF4zs20RzlDP-IuikySdPKQ6PTwCZ6Mk5PjiNn-717FByhE5dWYmxN3pHQG70JTOU3OcghV8oO2TwB_xxza_SPlH1UrswzJTa6QmgMbcXaPHbhNB7TmX14MP6OYdcRDRsZxME1bd8uzR-n6toW5l6OjACv40CqG9jgvuHP8b775WzBU0aREWiPzvbTAtGgg_q9CubEzJKDjhaNYNkTyJWljFKmNYTTGHIPiY2rw7jbAeVQ1wiFyy_sk098g2vP4ZrVNowx8sY0Q#_=_

# {
#     "access_token":"EAAH57SeXPZAgBOw3GEz7SZCPv6ChD9a2SdZBNwWS276fRcIiXsKQQNMfvjGQS7YYDzJlZCywGUkUnKtfGI7HfEqUE1P3yfEZBqFLmk7vAJ0goaXGmuty3gDNxqRtx1vMktZBYJZBr6wKiSik9rGK8lAT23l1zkY3htok4UJ3QTIqPsgxPIhOHlB0KK6SH8HPfnDPkUk9ZBe98dy8e8XUwEPYShiqqZBr5CYISK2CkZAskDeHAGuRYFf3sKVSYf2Q4s",
#     "token_type":"bearer",
#     "expires_in":5183257
# }