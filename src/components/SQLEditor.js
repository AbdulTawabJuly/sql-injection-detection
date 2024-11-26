import React, { useState, useRef, useEffect } from "react";

const knownKeywords = [
  "SELECT",
  "FROM",
  "WHERE",
  "INSERT",
  "UPDATE",
  "DELETE",
  "CREATE",
  "DROP",
  "JOIN",
  "GROUP BY",
  "ORDER BY",
  "HAVING",
  "LIMIT",
  "OFFSET",
  "AND",
  "OR",
  "NOT",
  "IN",
  "IS",
  "NULL",
  "AS",
  "ON",
  "DESC",
  "ASC",
  "SUM",
  "COUNT",
];

function SQLEditor() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(""); 
  const textareaRef = useRef(null);

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; 
      textarea.style.height = `${textarea.scrollHeight}px`; 
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [query]);

  const handleSubmit = () => {
    fetch("http://localhost:5000/detect_sql_injection", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sql_query: query }),
    })
      .then((response) => {
        console.log(response)
        if (!response.ok) {
          throw new Error("Backend not available");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Received data:", data); 
        setResult(data.result || data.error); 
      })
      .catch((error) => {
        console.error("Error:", error);
        setResult("Error: Backend is not running or an issue occurred.");
      });
  };
  

  const highlightSQL = (input) => {
    const sortedKeywords = [...knownKeywords].sort((a, b) => b.length - a.length);
    const keywordPattern = new RegExp(
      `\\b(${sortedKeywords.join("|").replace(/ /g, "\\s")})\\b`,
      "gi"
    );

    return input
      .replace(/[\n\r]/g, "<br/>") 
      .replace(keywordPattern, (match) => {
        return `<span style="color: blue; font-weight: bold;">${match.toUpperCase()}</span>`;
      });
  };

  return (
    <div className="container">
      <h1>SQL Injection Detection</h1>
      <h2>Enter an SQL query to determine if it's a potential SQL injection attempt</h2>
      <div className="editor-box">
        <div
          className="highlight-layer"
          dangerouslySetInnerHTML={{ __html: highlightSQL(query) }}
        ></div>
        <textarea
          ref={textareaRef}
          className="text-layer"
          value={query}
          onChange={handleQueryChange}
          placeholder="Write your SQL query here..."
        />
        <button onClick={handleSubmit}>Submit</button>
      </div>

      <div className="result-box">
        {result && (
          <div className="white">
            <h3>Result:</h3>
            <p >{result}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SQLEditor;
