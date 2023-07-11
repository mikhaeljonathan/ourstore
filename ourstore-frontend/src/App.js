import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap';
import { useNavigate } from "react-router";
import React, { useEffect } from "react";

export const BE_HOSTNAME = process.env.REACT_APP_BE_HOSTNAME || "skripsipastia.xyz";
export const BE_PORT = process.env.REACT_APP_BE_PORT || 443;
export const BE_PROTOCOL = process.env.REACT_APP_BE_PROTOCOL || "https";

function App() {
  const navigate = useNavigate();

  fetch(`${BE_PROTOCOL}://${BE_HOSTNAME}:${BE_PORT}/api/v1/themes`)
    .then(response => response.json())
    .then(data => {
      // Update the logo URL in the DOM
      // console.log(data.data[0].logoLink)
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = data.data[0].logoLink;
    })
    
  useEffect(() => {
    navigate('/login');
  }, [])

  return (
    <div>
      <h1>Ourstore</h1>
    </div>
  );
}

export default App;