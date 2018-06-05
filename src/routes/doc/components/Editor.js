import React from "react";
import AceEditor from 'react-ace';
import 'brace/mode/markdown';
import 'brace/theme/github';
import 'brace/ext/language_tools';
import 'brace/ext/searchbox';

class Editor extends React.Component {

  handleChange=(code)=>{
    this.props.onChange(code)
  }
  render(){
    return (
      <AceEditor
            mode="markdown"
            theme="github"
            name="blah2"
            height='100vh'
            width='100%'
            onChange={this.handleChange}
            fontSize={14}
            showPrintMargin={true}
            showGutter={false}
            highlightActiveLine={true}
            value={this.props.code}
            setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showLineNumbers: false,
            tabSize: 2,
            }}/>
    )
  }
}

export default Editor
