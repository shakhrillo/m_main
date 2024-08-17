from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
import json
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this with specific origins in production
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

DATA_FILE = Path("data.geojson")

# Load data from geojson file
def load_data():
    if DATA_FILE.exists():
        with open(DATA_FILE, "r") as f:
            return json.load(f).get("features", [])
    else:
        return []

# Save data to geojson file
def save_data(data):
    print(f"Saving {len(data)} entries to {DATA_FILE}")
    with open(DATA_FILE, "w") as f:
        json.dump({"type": "FeatureCollection", "features": data}, f, indent=4)

# Load initial data
data_store = load_data()

@app.get("/entries", response_model=List[Dict[str, Any]])
def get_entries():
    global data_store
    return data_store

@app.delete("/entries/{full_id}", response_model=Dict[str, Any])
def delete_entry(full_id: str):
    global data_store
    # Find the index of the item with the matching full_id
    for index, item in enumerate(data_store):
        if item['properties'].get('full_id') == full_id:
            # Remove the item from the list
            deleted_item = data_store.pop(index)
            save_data(data_store)  # Save data to file
            return deleted_item
    # Raise a 404 error if the item is not found
    raise HTTPException(status_code=404, detail="Entry not found")

# Run with: uvicorn main:app --reload
