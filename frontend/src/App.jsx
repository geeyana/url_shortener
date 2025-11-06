import './App.css'
import { isValidElement, useState } from 'react'

function App() {
  const [url, setURL] = useState("")
  const [alias, setAlias] = useState("")
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

  const handleUpload = async (e) => {
    e.preventDefault()
    const data = {url: url,}

    if (alias.length > 0) {
      data.alias = alias;
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
    }

    catch (error) {
      if (error instanceof ValidationError){
        alert("URL is invalid")
        return;
      }

      else{
        console.error('Error uploading data:',error)
        alert(`Alias is taken, try again`)
      }
    }
  }

  return (
    <div className="main-container">
      <div id="header">
        <h1>URL Shortener WOW!</h1>
      </div>

      <form onSubmit={handleUpload}>
        <div id="inputs-container">
          <div id="column1">
            <input 
              id="url"
              type="text"
              placeholder="Enter URL"
              value={url}
              onChange={(e) => setURL(e.target.value)}
            />
          </div>

          <div id="column2">
            <input
              id="user-alias"
              type="text"
              placeholder="Enter alias"
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
            <tr>
              <td id="url-display">https://google.com/</td>
              <td id="alias-display">ggl</td>
              <td><a id="link-display" href="https://google.com/" target="_blank">https://google.com/</a></td>
              <td id="delete"><button>delete</button></td>
            </tr>

            <tr>
              <td id="url-display">https://youtube.com/</td>
              <td id="alias-display">yt</td>
              <td><a id="link-display" href="https://youtube.com/" target="_blank">https://youtube.com/</a></td>
              <td id="delete"><button>delete</button></td>
            </tr>

            <tr>
              <td id="url-display">https://github.com/</td>
              <td id="alias-display">gh</td>
              <td><a id="link-display" href="https://github.com/" target="_blank">https://github.com/</a></td>
              <td id="delete"><button>delete</button></td>
            </tr>

            <tr>
              <td id="url-display">https://twitter.com/</td>
              <td id="alias-display">twtr</td>
              <td><a id="link-display" href="https://twitter.com/" target="_blank">https://twitter.com/</a></td>
              <td id="delete"><button>delete</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App
