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
  const textareaRef = useRef(null);

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // Reset height
      textarea.style.height = `${textarea.scrollHeight}px`; // Adjust height to content
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [query]);

  const handleSubmit = () => {
    fetch("/execute-sql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Query result:", data);
      })
      .catch((error) => console.error("Error:", error));
  };

  const highlightSQL = (input) => {
    // Sort keywords by length to match multi-word keywords first
    const sortedKeywords = [...knownKeywords].sort((a, b) => b.length - a.length);
    const keywordPattern = new RegExp(
      `\\b(${sortedKeywords.join("|").replace(/ /g, "\\s")})\\b`,
      "gi"
    );

    return input
      .replace(/[\n\r]/g, "<br/>") // Handle line breaks
      .replace(keywordPattern, (match) => {
        return `<span style="color: blue; font-weight: bold;">${match.toUpperCase()}</span>`;
      })
  };

  return (
    <div className="container">
      <h1>SQL Injection Detection</h1>
      <h2>Enter an SQL query to determine if it's a potential SQL injection attempt</h2>
      <div className="editor-box">
        {/* Highlighted Layer */}
        <div
          className="highlight-layer"
          dangerouslySetInnerHTML={{ __html: highlightSQL(query) }}
        ></div>
        {/* Text Area */}
        <textarea
          ref={textareaRef}
          className="text-layer"
          value={query}
          onChange={handleQueryChange}
          placeholder="Write your SQL query here..."
        />
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
  
}

export default SQLEditor;
