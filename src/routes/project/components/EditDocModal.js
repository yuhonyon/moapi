import { Modal,Upload, Button, Icon  ,message,Tree, Input} from 'antd';
import React from 'react'
import {inject, observer} from 'mobx-react';
import { Link  } from 'react-router-dom'
import config from "@/config"
import { Spin } from 'antd';

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
    docMenu:[],
    loading:false
  }


  componentWillReceiveProps(nextProps){
    if(nextProps.visible&&nextProps.visible!==this.props.visible){
      this.getDocMenu()
    }else if(this.props.visible){
      this.getDocMenu(this.state.docMenu)
    }
  }

  getDocMenu=(data)=>{
    data = data||JSON.parse(JSON.stringify(this.props.project.info.docMenu.slice()))
    const add = (docs, doc) => {
      for(let i =0;i<docs.length;i++){
        let menu=docs[i]
        if (menu.id&&menu.key == doc.id) {
          return false
        }else if (menu.children&&menu.children.length&&!add(menu.children, doc)) {
          return false
        }
      }  
      return true;  
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
    
    let addDoc=this.props.project.info.docs.slice().reduce((total,item,index)=>{
      if(add(data,item)){
        total.push({
          id:item.id,
          key:item.id,
          title:item.title
        })
      }
      return total
    },[])
    data=data.concat(addDoc)

    


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
    
    this.setState({loading:file.status==="uploading"})
    if (file.status === 'done') {
     message.success('上传成功')
     this.props.project.uploadDocFile(file.response.result)
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
        this.setState({docMenu:this.state.docMenu})
      },
      onCancel() {

      },
    });
    
  }

  handleRemoveMenu=(e)=>{

    const del = (data, key) => {
      for(let i =0;i<data.length;i++){
        let item=data[i]
        if (item.key == key) {
          
          if(item.children){
            data.push(...item.children)
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
      if (item.children && item.children.length&&item.children[0]) {
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
            action={`${config.baseURL}common/file/upload`}
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
        ><Spin tip="上传中..." spinning={this.state.loading}>

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
   </Spin>


        </Modal>
      </div>
    );
  }
}

export default EditDocModal;
