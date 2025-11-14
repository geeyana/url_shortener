def createAlias(url, time):
  time_str = time.isoformat()
  temp = str(url) + str(time_str)
  temp = hash(temp)
  return str(temp)[:5]