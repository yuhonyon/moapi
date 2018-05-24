import React  from 'react';


import Routes from '../routes'
import Header from "./Header"

function CoreLayout(props){
  return (<div className="app-layout">
    <Header/>
    <div className="app-content" style={{
      padding:'20px'
    }}>
      <Routes/>
    </div>
    <div className="app-footer" style={{
        textAlign: 'center'
      }}>

    </div>
  </div>);
}

export default CoreLayout
