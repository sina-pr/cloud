import React, { useState } from 'react';
import Desktop from './Desktop';
import './App.css';

const App = () => {
  const [files, setFiles] = useState([]);

  return (
    <div className="App">
      <Desktop files={files} setFiles={setFiles} />
    </div>
  );
};

export default App;
