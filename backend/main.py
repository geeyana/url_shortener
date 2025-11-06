# Endpoints

from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import RedirectResponse
import hash
from datetime import datetime
import sqlite_helper
import logging
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
db_file_path = "urls.db"
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # allow requests from anywhere
    allow_credentials=True,
    allow_methods=["*"],   # allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],   # allow all request headers
)

@app.get("/")
async def read_root():
	return {"Hello": "World"}


@app.post("/upload")
async def jsonReturns(request:Request):
	try:
		json_body = await request.json()
		url = json_body["url"]
		alias = json_body.get("alias", None)

		if alias is None:
			time = datetime.now()
			alias = hash.createAlias(alias, time)

		if sqlite_helper.insertURL(url, alias, db_file_path):
			return ({"url":url, "alias":alias})

		else:
			raise HTTPException(status_code = 400)

	except Exception:
		logging.error("ERROR - Could not create an alias")
		return HTTPException(status_code = 400, detail = "Invalid input")


@app.get("/search/{alias}")
async def searchAlias(alias):
    try:
        url = sqlite_helper.findURL(alias, db_file_path)
        return RedirectResponse(url)
    
    except:
        logging.error("ERROR - Could not find alias")
        return HTTPException(status_code = 400, detail = "No alias found")


@app.get("/all")
async def listAll():
    try:
        return sqlite_helper.showAll(db_file_path)
    
    except:
        logging.error("ERROR - Could not load all URLs")
        return HTTPException(status_code = 400, detail = "Problem loading URLs")


@app.delete("/delete/{alias}")
async def deleteURL(alias):
    try:
        sqlite_helper.deleteURL(alias)
        return ({"message": f"Deleted {alias}"})
    
    except:
        logging.error(f"ERROR - Could not delete {alias}")
        return HTTPException(status_code = 400, detail = "Problem deleting alias")