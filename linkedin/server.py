import psycopg2

try:
    # Connect to your postgres DB
    conn = psycopg2.connect(
        dbname="mydb",
        user="myuser",
        password="mypassword",
        host="localhost",      # e.g., 'localhost' or an IP
        port="4500"            # default PostgreSQL port
    )

    # Open a cursor to perform database operations
    cur = conn.cursor()

    # Execute a query
    cur.execute("SELECT version();")

    # Retrieve query results
    db_version = cur.fetchone()
    print("Database version:", db_version)

    # Clean up
    cur.close()
    conn.close()

except Exception as e:
    print("Error:", e)
