import React from "react";
import ReactMarkdown from 'react-markdown'
import Editor from './components/Editor'
import Style from './Layout.less'
import { Input, Button ,message} from 'antd';
import { Link  } from 'react-router-dom'
import {inject, observer} from 'mobx-react';
const ButtonGroup = Button.Group;



@inject("doc")
@observer
class Layout extends React.Component {
  state={
    content:"",
    title:"",
    preview:true
  }
  previewDom = React.createRef()
  componentDidMount=()=>{
    this.props.doc.getDoc(this.props.match.params.docId).then(()=>{
      this.setState({content:this.props.doc.data.content,title:this.props.doc.data.title})
    })
  }
  handleCodeChange=(content)=>{
    this.setState({content:content})
  }
  handleTitleChange=(e)=>{
    this.setState({title:e.target.value})
  }
  handleSave=()=>{
    this.props.doc.updateDoc(this.props.match.params.docId,{
      title:this.state.title,
      content:this.state.content
    }).then(()=>{
      message.success("保存成功")
    })
  }
  handlePreview=(e)=>{
    this.setState({preview:!this.state.preview})
  }
  handleScroll=(e)=>{
    if(!this.state.preview){
      return;
    }
    this.previewDom.current.scrollTop=-e;
  }
  render(){
    return (
      <div className={Style.wrapper}>
        <div className={Style.header}>
          <div className={Style.title}>
            <Link to={`/project/${this.props.doc.data.projectId}`}>{this.props.doc.data.projectName}</Link>/<Input onChange={this.handleTitleChange}  value={this.state.title}/>.md
          </div>

          <ButtonGroup className={Style.btn}>
            <Button onClick={this.handleSave}>保存</Button>
            <Button onClick={this.handlePreview} type={this.state.preview?'primary':''}>预览</Button>
          </ButtonGroup>
        </div>
        <div className={Style.editor} style={{width:this.state.preview?"50%":"100%"}}>
          <Editor preview={this.state.preview} onChange={this.handleCodeChange} onScroll={this.handleScroll} code={this.state.content}></Editor>
        </div>
        {this.state.preview&&<div className={Style.preview} ref={this.previewDom}>
          <ReactMarkdown source={this.state.content} />
        </div>}
      </div>
    )
  }
}

export default Layout
