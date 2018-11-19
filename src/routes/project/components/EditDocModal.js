import { Modal,Upload, Button, Icon  ,message,Tree, Input} from 'antd';
import React from 'react'
import {inject, observer} from 'mobx-react';
import { Link  } from 'react-router-dom'
import config from "@/config"

const TreeNode = Tree.TreeNode;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};
@inject("project","user","doc")
@observer
class EditDocModal extends React.Component {

  state={
    docMenu:[]
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.visible){
      this.getDocMenu()
    }
  }

  getDocMenu=()=>{
    let data = JSON.parse(JSON.stringify(this.props.project.info.docMenu.slice()))
    const add = (data, key, item) => {
      let has=false;
      for(let i =0;i<data.length;i++){
        let menu=data[i]
        if (menu.key == key) {
          has=true;
          return
        }
        if (menu.children) {
          has=true;
          add(menu.children, key, item);
        }
      }
      if(!has){
        data.push({
          title:item.title,
          key:item.id,
          id:item.id
        })
      }
      
    };

    const remove=(data)=>{
      return data.filter((item,index)=>{
        if (!item.children&&item.id&&!this.props.project.info.docs.find(val=>val.id===item.id)) {
          return false
        }else if (item.children) {
          item.children=remove(item.children);
        }
        return true
      })
    }

    data=remove(data)
    this.props.project.info.docs.forEach(item=>{
      add(data,item.id,item)
    })

    


    this.setState({'docMenu':data})
  }

  handleOk = (e) => {
    this.props.onOk(this.state.docMenu);
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
    this.props.project.addDoc().then(()=>{
      message.success("添加成功")
    })
  }

  handleSaveCurDoc=()=>{
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

  handleAddMenu=()=>{
    this.state.docMenu.push({title:'新增目录',key:Date.now()})
    this.setState({docMenu:this.state.docMenu})
  }

  handleDrop = (info) => {

  
   
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    const dropPos = info.node.props.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    if(info.node.props.id&&dropPosition===0){
      return
    }
    

    const loop = (data, key, callback) => {
      data.forEach((item, index, arr) => {
        if (item.key == key) {
          return callback(item, index, arr);
        }
        if (item.children) {
          return loop(item.children, key, callback);
        }
      });
    };
    const data = this.state.docMenu
    // Find dragObject
    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert 示例添加到尾部，可以是随意位置
        item.children.push(dragObj);
      });
    } else if (
      (info.node.props.children || []).length > 0 // Has children
      && info.node.props.expanded // Is expanded
      && dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert 示例添加到尾部，可以是随意位置
        item.children.unshift(dragObj);
      });
    } else {
      let ar;
      let i;
      console.log(data,dropKey)
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if(!ar){
        return
      }
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    }
    this.setState({docMenu:data})
    
  }


  handleEditMenu=(item)=>{
    Modal.confirm({
      title: '目录名称',
      content: <Input onChange={e=>item.title=e.target.value} defaultValue={item.title} />,
      onOk:()=>{
        console.log(item.title)
        this.setState({docMenu:this.state.docMenu})
      },
      onCancel() {
        console.log('Cancel');
      },
    });
    
  }

  handleRemoveMenu=(e)=>{

    const del = (data, key) => {
      for(let i =0;i<data.length;i++){
        let item=data[i]
        if (item.key == key) {
          
          if(item.children){
            item.children.forEach(val=>{
              if(val.id){
                data.push(val)
              }
            })
          }
          data.splice(i,1)
          return
        }
        if (item.children) {
          del(item.children, key);
        }
      }
    };

    const data = this.state.docMenu
    del(data,e.key)
    this.setState({docMenu:data})

  }



  render() {
    const loop = data =>{ 
      
      return data.map((item) => {
        console.log(item.key)
      if (item.children && item.children.length) {
        return <TreeNode  key={item.key} title={(<div>{item.title}<Icon onClick={this.handleEditMenu.bind(this,item)} type="form"></Icon><Icon onClick={this.handleRemoveMenu.bind(this,item)} type="delete"></Icon></div>)}>{loop(item.children)}</TreeNode>;
      }else if(!item.id){
        return <TreeNode key={item.key} title={(<div>{item.title}<Icon onClick={this.handleEditMenu.bind(this,item)} type="form"></Icon><Icon onClick={this.handleRemoveMenu.bind(this,item)} type="delete"></Icon></div>)}></TreeNode>; 
      }
      let doc =this.props.project.docs.find(doc=>doc.id===item.id)
      if(!doc){
        return <TreeNode key={item.key} title={(<div>{item.title}(已删除))<Icon onClick={this.handleRemoveMenu.bind(this,item)}  type="delete"></Icon></div>)}></TreeNode>;
      }
      return <TreeNode id={doc.id} key={doc.id} title={(
      <div>
        <a target="_blank" href={`${config.baseURL}doc${!(doc.type==='md'||doc.type==='markedown'||!doc.type)?'/file':''}/preview/${doc.id}`}>
        {doc.title}
        </a>
        &nbsp;
        {(doc.type==='md'||doc.type==='markedown'||!doc.type)?<Link to={`/doc/${doc.id}`}><Icon type="form"></Icon></Link>:<a target="_blank" download href={`${config.baseURL}${doc.url}`}><Icon type="download" /></a>}
        <Icon onClick={this.handleDeleteDoc.bind(this,doc.id)} type="delete"></Icon>
      </div>
      )}></TreeNode>;
    });}
    
    return (
      <div>
        
        <Modal maskClosable={false}
          width={840}
          title={<div><span>附件管理</span>&nbsp;<Upload
            showUploadList={false}
            onChange={this.handleChange}
            action={`${config.baseURL}doc/upload?token=${this.props.user.userInfo.accessToken}&projectId=${this.props.project.projectId}`}
            >
             <Button>
               <Icon type="upload" /> 上传
             </Button>
             
           </Upload>&nbsp;
           <Button onClick={this.handleAddDoc}>
               <Icon type="plus" /> 添加MD文档
          </Button>&nbsp;
           <Button onClick={this.handleSaveCurDoc}><Icon type="save" />保存当前文档为附件</Button></div>}
          visible={this.props.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText="保存目录"
        >

        <Tree
        showLine
        draggable
        defaultExpandAll
        selectable={false}
        onDrop={this.handleDrop}
      >
       {loop(this.state.docMenu)}
      </Tree>

      <Button onClick={this.handleAddMenu}><Icon type="plus" />添加目录</Button>
        
        {/* <h3>附件列表</h3>
        <ul>
          {this.props.project.docs.map(item=>(
            <li key={item.id}>
              &nbsp;
              {(item.type==='md'||item.type==='markedown'||!item.type)?<Link to={`/doc/${item.id}`}><Icon type="form"></Icon></Link>:<a target="_blank" download href={`${config.baseURL}${item.url}`}><Icon type="download" /></a>}

              <Icon onClick={this.handleDeleteDoc.bind(this,item.id)} type="delete"></Icon>
            </li>
          ))}
        </ul> */}

        </Modal>
      </div>
    );
  }
}

export default EditDocModal;
