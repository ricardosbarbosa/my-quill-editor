import Quill from "quill";
import { useCallback, useRef } from "react";
import "quill/dist/quill.snow.css";

import QuillBetterTable from 'quill-better-table'

// Quill.register({
//   'modules/better-table': QuillBetterTable
// }, true)

function App() {
  const quillEditorInstance = useRef<Quill>();

  const setQuillEditorRef = useCallback((reactElement: HTMLDivElement) => {
    if (!reactElement) {
      return;
    }

    const editorInstance = new Quill(
      reactElement,
      {
        // debug: 'info',
        modules: {
          // toolbar: '#toolbar'
          toolbar: {
            container: [["bold"], ["table"]],
            handlers: {
              table(enabled:boolean) {
                
                if (enabled) {
                  console.log("ok")
                  // @ts-ignore
                  // const tableModule = this.quill.getModule("better-table");
                  const tableModule = this.quill.getModule('table');
                  tableModule.insertTable(3, 3);
                }
              }
            }
          },
          // keyboard: {
            // bindings: QuillBetterTable.keyboardBindings
          // },
          table: true,
          // 'better-table': {
          //   operationMenu: {
          //     insertColumnRight: {
          //       text: "insertColumnRight"
          //     },
          //     insertColumnLeft: {
          //       text: "insertColumnLeft"
          //     },
          //     insertRowUp: {
          //       text: "insertRowUp"
          //     },
          //     insertRowDown: {
          //       text: "insertRowDown"
          //     },
          //     mergeCells: {
          //       text: "mergeCells"
          //     },
          //     unmergeCells: {
          //       text: "unmergeCells"
          //     },
          //     deleteColumn: {
          //       text: "deleteColumn"
          //     },
          //     deleteRow: {
          //       text: "deleteRow"
          //     },
          //     deleteTable: {
          //       text: "deleteTable"
          //     },
          //     items: {
          //       unmergeCells: {
          //         text: 'Another unmerge cells name'
          //       }
          //     }
          //   },
          // },
        },
        placeholder: 'Compose an epic...',
        readOnly: false,
        theme: 'snow'
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
