import Quill from "quill";
import { useCallback, useRef } from "react";
import "quill/dist/quill.snow.css";

function App() {
  const quillEditorInstance = useRef<Quill>();

  const setQuillEditorRef = useCallback((reactElement: HTMLDivElement) => {
    if (!reactElement) {
      return;
    }

    const editorInstance = new Quill(
      reactElement,
      {
        modules: {},
        theme: "snow"  
      }
    );

    quillEditorInstance.current= editorInstance
  }, []);
  return (
    <div className="App App-header">
      <div ref={setQuillEditorRef} />
    </div>
  );
}

export default App;
