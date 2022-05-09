import Quill from "quill";
import { useCallback, useRef } from "react";
import { Poll } from "./quill/formats/poll";
import { Editor } from "./editor";
import { Component } from "react";

Quill.register(
  {
    'formats/poll': Poll,
  },
  true
);
const App = () => {
  return (
    <div className="App App-header">
      
      <Editor />
    </div>
  );
}


export default App
