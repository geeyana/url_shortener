def createAlias(url, time):
  temp = url + time
  temp = hash(temp)
  return str(temp)[:5]