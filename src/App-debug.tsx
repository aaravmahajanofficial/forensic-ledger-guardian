import React from "react";

const AppDebug = () => {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Debug App - React is Working!</h1>
      <p>If you can see this, React is rendering correctly.</p>
      <p>Current URL: {window.location.href}</p>
      <p>Current pathname: {window.location.pathname}</p>
    </div>
  );
};

export default AppDebug;
