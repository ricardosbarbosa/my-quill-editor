import React, { Component } from 'react';
import Quill from 'quill';
import defer from 'lodash/defer';
import map from 'lodash/map';

// import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import { Poll } from './quill/formats/poll';

Quill.register(
  {
    // 'formats/header': Header,
    'formats/poll': Poll,
  },
  true
);

class Editor extends Component {
  constructor(props) {
    super(props);
    this.editor = null;
    this.editorContainer = React.createRef();
    this.state = {
      embedBlots: [],
    };
  }

  componentDidMount() {
    this.editor = new Quill(this.editorContainer.current, {
      placeholder: 'Start typing',
      readOnly: false,
      formats: ['poll'],
      theme: 'snow',
      modules: {
          toolbar: '#toolbar',
          // toolbar: {
          //   container: [["bold"], ["table"]],
          //   handlers: {
          //     table(enabled) {
                
          //       if (enabled) {
          //         console.log("ok")
          //         // @ts-ignore
          //         // const tableModule = this.quill.getModule("better-table");
          //         const tableModule = this.quill.getModule('table');
          //         tableModule.insertTable(3, 3);
          //       }
          //     }
          //   }
          // },
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
    });

    let blots = [];
    /** Listener to listen for custom format */
    this.editor.scroll.emitter.on('blot-mount', (blot) => {
      blots.push(blot);
      defer(() => {
        if (blots.length > 0) {
          this.onMount(...blots);
          blots = [];
        }
      });
    });
    this.editor.scroll.emitter.on('blot-unmount', this.onUnmount);
  }

  onMount = (...blots) => {
    const embeds = blots.reduce(
      (memo, blot) => {
        memo[blot.id] = blot;
        return memo;
      },
      { ...this.state.embedBlots }
    );
    this.setState({ embedBlots: embeds });
  };

  onUnmount = (unmountedBlot) => {
    const { [unmountedBlot.id]: blot, ...embedBlots } = this.state.embedBlots;
    this.setState({ embedBlots });
  };

  renderPoll() {
    const range = this.editor.getSelection(true);
    const type = 'poll';
    const data = {};
    /** Call pollFormat */
    this.editor.insertEmbed(range.index, type, data);
    console.log(this.editor.getContents());
  }

  render() {
    return (
      <>
      <div id="toolbar" >
        
        <select className="ql-size">
          <option value="small"></option>
          <option selected></option>
          <option value="large"></option>
          <option value="huge"></option>
        </select>
        <button className="ql-bold"></button>
        <button className="ql-script" value="sub"></button>
        <button className="ql-script" value="super"></button>
        
        <button className="ql-custom" onClick={() => this.renderPoll()}>Poll</button>
        
        
        {/* <button onClick={() => renderPoll()}>Poll 2</button> */}

      </div>
        <div spellCheck={false} ref={this.editorContainer}>
          {map(this.state.embedBlots, (blot) => blot.renderPortal(blot.id))}
        </div>
        
      </>
    );
  }
}

export { Editor };
