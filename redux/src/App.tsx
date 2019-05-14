import React, { Component } from 'react';
import ListManuscripts from "./list-manuscripts";

class App extends Component {
  render() {
    return <>
      <h1>Manuscript tracking system</h1>
      <ListManuscripts />
    </>;
  }
}

export default App;
