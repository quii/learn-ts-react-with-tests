import React, { Component } from 'react';
import ListManuscripts from "./list-manuscripts";
import {AddManuscript} from "./add-manuscript";

class App extends Component {
  render() {
    return <>
      <h1>Manuscript tracking system</h1>
      <ListManuscripts />
      <AddManuscript/>
    </>;
  }
}

export default App;
