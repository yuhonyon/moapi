import { Modal,Upload, Button, Icon  ,message} from 'antd';
import React from 'react'
import {inject, observer} from 'mobx-react';
import { Link  } from 'react-router-dom'
import config from "@/config"
@inject("project","user","doc")
@observer
class EditDocModal extends React.Component {



  handleOk = (e) => {
    this.props.onOk();
    this.props.onClose();
  }
  handleCancel = (e) => {
    this.props.onClose();
  }


  handleChange =({ file })=> {
    if (file.status !== 'uploading') {
     message.success('上传成功')
     this.props.project.getProjectInfo()
   }
  }
  handleAddDoc=()=>{
    this.props.project.saveDoc().then(()=>{
      message.success("保存成功")
    })
  }

  handleDeleteDoc=(docId)=>{
    Modal.confirm({
    title: '警告',
    content: '确认要删除该文档吗',
    onOk:()=> {
      this.props.doc.deleteDoc(docId).then(()=>{
        message.success('删除成功')
        this.props.project.getProjectInfo()
      })
    },
  });
  }



  render() {
    return (
      <div>
        <Modal maskClosable={false}
          width={640}
          title={<div><span>markdown文档</span>&nbsp;<Upload
            showUploadList={false}
            onChange={this.handleChange}
            action={`${config.baseURL}doc/upload?token=${this.props.user.userInfo.accessToken}&projectId=${this.props.project.projectId}`}
            >
             <Button>
               <Icon type="upload" /> 上传
             </Button>
           </Upload>&nbsp;<Button onClick={this.handleAddDoc}>保存当前文档为附件</Button></div>}
          visible={this.props.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
        <ul>
          {this.props.project.docs.map(item=>(
            <li key={item.id}>
              <a target="_blank" href={`${config.baseURL}doc/preview/${item.id}`}>{item.title}</a>&nbsp;
              <Link to={`/doc/${item.id}`}><Icon type="form"></Icon></Link>
              <Icon onClick={this.handleDeleteDoc.bind(this,item.id)} type="delete"></Icon>
            </li>
          ))}
        </ul>

        </Modal>
      </div>
    );
  }
}

export default EditDocModal;
