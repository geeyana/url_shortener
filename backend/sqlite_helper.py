import sqlite3
con = sqlite3.connect("temp.db")

def temp():
  cur = con.cursor()
  cur.execute("CREATE TABLE move(title, year, score)")
  print("success")
  
temp()