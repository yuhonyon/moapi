import React from "react";
import ReactMarkdown from 'react-markdown'
import Editor from './components/Editor'
import Style from './Layout.less'
import { Input, Button ,message} from 'antd';
import { Link  } from 'react-router-dom'
import {inject, observer} from 'mobx-react';
import config from "@/config"
import axios from "axios"
const ButtonGroup = Button.Group;



@inject("doc",'user')
@observer
class Layout extends React.Component {
  state={
    content:"",
    title:"",
    preview:true
  }
  editor={}
  previewDom = React.createRef()
  componentDidMount=()=>{
    this.props.doc.getDoc(this.props.match.params.docId).then(()=>{
      this.setState({content:this.props.doc.data.content,title:this.props.doc.data.title})
    })

    document.addEventListener('paste',  (event)=> {
        var isChrome = false;
        if (event.clipboardData || event.originalEvent) {
            var clipboardData = (event.clipboardData || event.originalEvent.clipboardData);
            if(clipboardData.items){
                var  items = clipboardData.items,
                    len = items.length,
                    blob = null;
                isChrome = true;
                for (var i = 0; i < len; i++) {
                    if (items[i].type.indexOf("image") !== -1) {
                        blob = items[i].getAsFile();
                    }
                }
                if(blob!==null){
                    console.log(event)
                    var blobUrl=URL.createObjectURL(blob);
      
                    var reader = new FileReader();
                    var fd = new FormData(document.forms[0]);
                    fd.append("file", blob, 'image.png');

                    axios.post(`${config.baseURL}doc/img?token=${this.props.user.userInfo.accessToken}`,fd,{
                      headers: {
                        "Content-Type": "multipart/form-data"
                      }
                    }).then(data=>{
                      this.editor.insert(`![](${data.data.url})`)
                    })
                    event.preventDefault()
                }
            }
        }
    },true)
  }
  handleCodeChange=(content)=>{
    this.setState({content:content})
  }
  handleTitleChange=(e)=>{
    this.setState({title:e.target.value})
  }
  handleGetEditor=(editor)=>{
    console.log(editor)
    this.editor=editor
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
            <Button type="primary"><a target="_blank" href={`${config.baseURL}doc/preview/${this.props.match.params.docId}`}>查看</a></Button>
          </ButtonGroup>
        </div>
        <div className={Style.editor} style={{width:this.state.preview?"50%":"100%"}}>
          <Editor onLoad={this.handleGetEditor} preview={this.state.preview} onChange={this.handleCodeChange} onScroll={this.handleScroll} code={this.state.content}></Editor>
        </div>
        {this.state.preview&&<div className={Style.preview} ref={this.previewDom}>
          <ReactMarkdown source={this.state.content} />
        </div>}
      </div>
    )
  }
}

export default Layout
