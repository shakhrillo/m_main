from typing import Union

from fastapi import FastAPI

app = FastAPI()

@app.get("/border/{border_id}")
def read_root(border_id: int):
    return {
        "border_id": border_id,
        "border_name": "",
        "border_location": "",
        "border_country": "",
        "wait_time": [],
        "required_documents": [],
        "roads_conditions": [],
        "restaurants": [],
        "restrooms": [],
        "children_playground": [],
        "money_exchange": [],
        "atm": [],
        "nearest_hotel": [],
        "attentions": [],
        "bribes": [],
        "security": []
    }


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}