import React from "react";
import AceEditor from 'react-ace';
import 'brace/mode/markdown';
import 'brace/theme/github';
import 'brace/ext/language_tools';
import 'brace/ext/searchbox';

class Editor extends React.Component {
  editor=null
  handleChange=(code)=>{
    this.props.onChange(code)
  }
  handleScroll=(e)=>{
    this.props.onScroll(e.container.getElementsByClassName('ace_cursor')[0].offsetTop)
  }
  getInstance=(editor)=>{
    this.editor=editor;
  }
  componentWillReceiveProps(nextProps){
    if(this.editor&&nextProps.preview!==this.props.preview){
      setTimeout(()=>{
        this.editor.resize()
      },100)
    }
  }
  render(){
    return (
      <AceEditor
            mode="markdown"
            theme="github"
            name="blah2"
            height='100vh'
            width='100%'
            onLoad={this.getInstance}
            onChange={this.handleChange}
            fontSize={14}
            showPrintMargin={false}
            showGutter={false}
            wrapEnabled={true}
            showLineNumbers={false}
            highlightActiveLine={true}
            value={this.props.code}
            onScroll={this.handleScroll}
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
