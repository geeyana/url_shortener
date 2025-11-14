import './App.css'
import { isValidElement, useState, useEffect } from 'react'
import { fairyDustCursor } from "cursor-effects";

function App() {
  const [url, setURL] = useState("")
  const [alias, setAlias] = useState("")
  const [datalist, setDatalist] = useState([])
  const hostURL = "http://127.0.0.1:8000"

  class ValidationError extends Error {
    constructor(message) {
      super(message);
      this.name = "ValidationError";
    }
  }

  function isValidURL(string) {
    try {
      new URL(string)
      return true
    }
    catch (error) {
      return false
    }
  }

  const handleDelete = async (alias) => {
    try {
      const response = await fetch(`${hostURL}/delete/${alias}`, {
        method: "DELETE"
      })

      if (!response.ok) {
        throw new Error(`Failed to delete link. Status: ${response.status}`)
      }

      setDatalist(datalist.filter((item) => item.alias !== alias))
      alert("Successfully deleted")
    }

    catch (error) {
      alert("Something went wrong deleting")
      console.error("Could not delete.", error)
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    const data = {url: url,}

    if (alias.length > 0) {
      data.alias = alias
    }

    try {
      if (!isValidURL(url)) {
        throw new ValidationError("ERROR: Invalid URL");
      }

      const response = await fetch(`${hostURL}/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error(`HTTP Error. Status: ${response.status}`)
      }

      const result = await response.json()
      console.log(result)

      data.alias = result.alias
      data.link = `${hostURL}/s/${data.alias}`
      setDatalist([...datalist, data])
    }

    catch (error) {
      if (error instanceof ValidationError){
        alert("URL is invalid")
        return
      }

      else{
        console.error('Error uploading data:', error)
        alert(`Alias is taken, try again`)
      }
    }
  }
  
  useEffect(() => {
    new fairyDustCursor({
      parent: document.body,  
      colors: ["#ff84b1", "#ffe9eeff", "#ffa7c4ff"],
      fairySymbol: "★",
    });

    const fetchData = async () => {
      try {
        const response = await fetch(`${hostURL}/all`)
        const result = await response.json()

        if (result && Array.isArray(result)) {
          const updatedData = result.map(item => ({
            ...item, 
            link: `${hostURL}/s/${item.alias}`
          }))

          console.log(updatedData)
          setDatalist(updatedData)
        }

        else {
          setDatalist([])
        }
      }

      catch (error) {
        console.error("Something went wrong rendering data", error)
      }
    }
    fetchData()
  },[]) 

  return (
    <div className="main-container" style={{fontFamily: "gaegu, sans-serif"}}>
      <div id="header">
        <img src="/assets/bow.png" className="image"/>
        <img src="/assets/logo.png" className="logo"/>
        <img src="/assets/bow.png" className="image"/>
      </div>

      <form onSubmit={handleUpload}>
        <div id="inputs-container">
          <div id="column1">
            <input 
              id="url"
              type="text"
              placeholder="Enter URL - https://"
              value={url}
              onChange={(e) => setURL(e.target.value)}
            />
          </div>

          <div id="column2">
            <input
              id="user-alias"
              type="text"
              placeholder="Alias (optional)"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
            />
            <button id="submit-button" type="submit">Shorten!</button>
          </div>

        </div>
      </form>

      <div id="table">
        <table className="urlTable">
          <thead>
            <tr className="headerPanel">
              <th>URL</th>
              <th>Alias</th>
              <th>Link</th>
              <th id="trash"></th>
            </tr>
          </thead>

          <tbody>
            {datalist.map((data, index) => (
              <tr key={index}>
                <td>{data.url}</td>
                <td>{data.alias}</td>
                <td><a href={data.link} target="_blank">{data.link}</a></td>
                <td><button onClick={() => handleDelete(data.alias)}>delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) 
}

export default App
