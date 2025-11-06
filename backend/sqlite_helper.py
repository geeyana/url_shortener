import sqlite3
import logging
from datetime import datetime


def createTable(db_file):
  try:
    db = sqlite3.connect(db_file)
    cursor = db.cursor()
    query = "CREATE TABLE IF NOT EXISTS urls(id INTEGER PRIMARY KEY, url TEXT, alias TEXT, timestamp TEXT)"
    cursor.execute(query)
    db.commit()
    
  except:
    logging.error(f"ERROR: Couldn't create {db_file} :(")


def insertURL(url, alias, db_file):
  try:
    db = sqlite3.connect(db_file)
    cursor = db.cursor()
    
    if (not isAliasInDatabase(alias, db_file)):
      time = datetime.now()
      query = f"INSERT INTO urls(url, alias, timestamp) VALUES ('{url}', '{alias}', '{time}')"
      cursor.execute(query)
      db.commit()
      return True
    
    else:
      print("ERROR - Alias already exists")
      return False
    
  except Exception as e:
    logging.error(f"ERROR - Inserting {url} with {alias} to {db_file}: {e}")


def findURL(alias, db_file):
  try:
    db = sqlite3.connect(db_file)
    cursor = db.cursor()
    query = f"SELECT url FROM urls WHERE alias='{alias}'"
    res = cursor.execute(query)
    return res.fetchone()[0]
  
  except:
    logging.error(f"ERROR - Couldn't find URL")
    # TODO: return


def showAll(db_file):
  try:
    db = sqlite3.connect(db_file)
    cursor = db.cursor()
    query = f"SELECT * FROM urls"
    res = cursor.execute(query)
    listData = []
    allItems = res.fetchall()
    
    for row in allItems:
      temp = {
        "id" : row[0], 
        "url" : row[1],
        "alias" : row[2],
        "timestamp" : row[3]
      }
      listData.append(temp)
      
    return listData
  
  except:
    logging.error("ERROR - Failed to execute showAll()")
    # TODO: return


def deleteURL(alias, db_file):
  try:
    db = sqlite3.connect(db_file)
    cursor = db.cursor()
    query = f"DELETE FROM urls WHERE alias='{alias}'"
    cursor.execute(query)
    db.commit()
    
  except:
    logging.error("ERROR - Failed to delete")
    # TODO: return


def isAliasInDatabase(alias, db_file):
  try:
    db = sqlite3.connect(db_file)
    cursor = db.cursor()
    query = f"SELECT url FROM urls WHERE alias='{alias}'"
    res = cursor.execute(query)
    
    if res.fetchone() is None:
      return False
    
    else:
      return True
    
  except:
    logging.error("ERROR - Alias not in database")