import React from "react";
import EditableTable from './EditableTable'
import AddValueModal from './AddValueModal'
import AddRemarkModal from './AddRemarkModal'
import EditRemarkModal from './EditRemarkModal'
import HeadersTable from './HeadersTable'
import PathsTable from './PathsTable'
import RecordModal from './RecordModal'
import ShowCode from './ShowCode'
import LeadInModal from './LeadInModal'
import LeadInModelModal from './LeadInModelModal'
import {Button,List,Radio,message,Modal,Input,Select,Icon,Switch} from 'antd'
import Style from './Interfase.less'
import {inject, observer} from 'mobx-react';
import {toJS} from 'mobx';
import { Prompt } from 'react-router'
import {parseDate} from '@/filters'
import copy from 'copy-to-clipboard';
const ButtonGroup = Button.Group;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option=Select.Option;

@inject("interfases","project")
@observer
class Interfase extends React.Component {
  state = {
    resLeadInModalShow: false,
    reqLeadInModalShow: false,
    addValueModalShow:false,
    addRemarkModalShow:false,
    editRemarkModalShow:false,
    resLeadInModelModalShow:false,
    reqLeadInModelModalShow:false,
    editRemarkInfo:{},
    recordModalShow:false,
    resPreview: true,
    reqPreview: true,
  }
  addValue={}
  recordMessage=""
  forceSave=false
  addVersion=""


  saveInterfase = () => {
    this.props.interfases.closeEditable()
    this.fetchSaveInterfase()
    this.recordMessage=""
  }

  handleAddRemarkOk=(info)=>{
    this.forceSave=true;
    this.props.interfases.addRemark({interfaseId:this.props.interfases.data.id,...info})
  }

  handleAddHeader=()=>{
    this.props.interfases.addHeadersRow()
  }

  handleAddRemark=(e)=>{
    this.setState({addRemarkModalShow:true})
  }
  handleUpdateRemark=(info)=>{
    this.setState({editRemarkModalShow:true,editRemarkInfo:info})
  }
  handleUpdateRemarkOk=(info)=>{
    this.props.interfases.editRemark(this.state.editRemarkInfo.id,info)
  }
  handleDeleteRemark=(id)=>{
    Modal.confirm({
      title:'警告?',
      content:'确认删除备注?',
      onOk:()=>{
        this.forceSave=true;
        this.props.interfases.deleteRemark(id)
      },
    })
  }
  handleSyncSwaggerData=()=>{
    this.props.interfases.syncSwaggerData()
  }

  addRecord=()=>{
    this.forceSave=false;
    Modal.confirm({
      title:'添加修改记录',
      okText:"保存",
      content: <div><Input defaultValue={this.recordMessage} onChange={e=>this.recordMessage=e.target.value} ></Input><br/><Switch onChange={value=>this.forceSave=value} size="small" defaultChecked={this.forceSave} />强制保存</div>,
      onOk:()=>{
        this.saveInterfase()
      },
      onCancel:()=>{
        this.recordMessage="";
        this.forceSave=false;
      }
    })
  }
  handlerAddVersion=()=>{
    this.addVersion="";
    const ref =Modal.confirm({
      title: '添加版本标记',
      content: (
        <div>
          <Select defaultValue={this.addVersion} style={{width:200}} onChange={value=>(this.addVersion=value)}>
            {
              this.props.project.info.versions.slice().map(version=>(<Option value={version} key={version}>{version}</Option>))
            }
          </Select>
        </div>
      ),
      iconType:"plus-circle",
      okText: '添加',
      cancelText: '取消',
      onOk:()=>{
        ref.destroy();
        if(this.addVersion===""||this.props.interfases.data.versions.includes(this.addVersion)){
          return;
        }
        this.props.interfases.addVersion(this.addVersion)
      }
    });
  }

  edit = () => {
    this.props.interfases.fetchGetInterfase(this.props.interfases.data.id)
    this.props.interfases.openEditable()
    
  }
  cancel = () => {
    this.props.interfases.closeEditable()
    this.props.project.getProjectData()
  }
  resLeadInOk=(code)=>{
    this.props.interfases.leadInRes(code);
  }
  resLeadInModelOk=(code)=>{
    this.props.interfases.leadInModel('res',code);
  }
  reqLeadInModelOk=(code)=>{
    this.props.interfases.leadInModel('req',code);
  }
  reqLeadInOk=(code)=>{
    this.props.interfases.leadInReq(code);
  }
  addValueSuccess=(value)=>{
    this.addValue.value=value;
    this.props.interfases.addValue(this.addValue)
  }
  openAddValue=(type,key)=>{
    this.setState({addValueModalShow:true})
    this.addValue={type:type,key:key,value:null}
  }
  openRecord=()=>{
    this.setState({recordModalShow:true})
  }

  handleProxyTypeChange=(e)=>{
    this.props.interfases.changeProxyType(e.target.value)
  }

  fetchSaveInterfase=()=> {
    const data=toJS(this.props.interfases.data);
    data.headers=data.headers.filter(item=>!!item.name);
    data.recordMessage=this.recordMessage;
    data.forceSave=this.forceSave
    this.forceSave=false;
    this.props.project.updateInterfase(this.props.interfases.data.id,data).then(()=>{
        message.success('保存成功');
    })
  }

  handleCopyModel=(type)=>{
    let model=JSON.parse(JSON.stringify(this.props.interfases.data[type]));
    function removeKey(data){
      for(let item of data){
        delete item.key;
        if(data.children){
          removeKey(data.children)
        }
      }
    }
    removeKey(model)
    if(copy(JSON.stringify(model,null,2))){
      message.success('复制成功');
    }
  }

  render() {
    //console.log(this.props.interfases.resMock)
    return (<div className={Style.wrapper}>
      <Prompt when={this.props.interfases.editable} message="当前接口未保存,确定跳转?"/>
      <EditRemarkModal info={this.state.editRemarkInfo} onClose={() => {
          this.setState({editRemarkModalShow: false})
        }}  visible={this.state.editRemarkModalShow} onOk={this.handleUpdateRemarkOk}></EditRemarkModal>
      <AddRemarkModal onClose={() => {
          this.setState({addRemarkModalShow: false})
        }}  visible={this.state.addRemarkModalShow} onOk={this.handleAddRemarkOk}></AddRemarkModal>
      <LeadInModal onClose={() => {
          this.setState({resLeadInModalShow: false})
        }} title="导入请求属性" visible={this.state.resLeadInModalShow} onOk={this.resLeadInOk} ></LeadInModal>
      <LeadInModal onClose={() => {
          this.setState({reqLeadInModalShow: false})
        }} title="导入响应属性" visible={this.state.reqLeadInModalShow} onOk={this.reqLeadInOk}></LeadInModal>
      <LeadInModelModal onClose={() => {
          this.setState({reqLeadInModelModalShow: false})
        }} title="导入请求模板" visible={this.state.reqLeadInModelModalShow} onOk={this.reqLeadInModelOk}></LeadInModelModal>
      <LeadInModelModal onClose={() => {
          this.setState({resLeadInModelModalShow: false})
        }} title="导入响应模板" visible={this.state.resLeadInModelModalShow} onOk={this.resLeadInModelOk}></LeadInModelModal>
      <AddValueModal onClose={() => {
          this.setState({addValueModalShow: false})
        }} title="导入属性" visible={this.state.addValueModalShow} onOk={value=>{this.addValueSuccess(value)}}></AddValueModal>
      <RecordModal onClose={() => {
          this.setState({recordModalShow: false})
        }} title="导入属性" visible={this.state.recordModalShow}></RecordModal>
      <div className={Style.header}>
        <ul>
          <li>
            <h3>
              {this.props.interfases.data.name}
              {(this.props.interfases.editable&&this.props.project.info.swaggerUrl)&&<span>&nbsp;<Button onClick={this.handleSyncSwaggerData} type="primary" size="small">同步swagger</Button>&nbsp;</span>}
               <Button onClick={this.openRecord} size="small">修改记录</Button>&nbsp;
              {this.props.interfases.editable&&<RadioGroup buttonStyle="solid" onChange={this.handleProxyTypeChange} value={this.props.interfases.data.proxyType}>
                <RadioButton value={0}>关闭mock</RadioButton>
                <RadioButton value={1}>开启mock</RadioButton>
                <RadioButton value={2}>合并mock</RadioButton>
              </RadioGroup>}
            </h3>
          </li>
          <li>地址:
            <a target="_blank" href={this.props.interfases.testUrl}>{this.props.project.info.gateway?this.props.interfases.data.gatewayUrl:this.props.interfases.data.url}</a>&nbsp;<Button onClick={()=>{copy(this.props.project.info.gateway?this.props.interfases.data.gatewayUrl:this.props.interfases.data.url)}} size="small">复制</Button>
          </li>
          <li>类型: {this.props.interfases.data.method}</li>
          <li>相关版本: {this.props.interfases.data.versions.slice().join("、")}&nbsp;{this.props.interfases.editable&&this.props.project.permission>2&&<Button onClick={this.handlerAddVersion} size="small">添加版本标记</Button>}</li>
          <li>简介: {this.props.interfases.data.description}</li>
        </ul>
        {this.props.project.permission>1&&<div>
          {
            this.props.interfases.editable
              ? <ButtonGroup >
                  <Button onClick={this.saveInterfase} type="primary">直接保存</Button>
                  <Button onClick={this.addRecord} type="primary">保存</Button>
                  <Button onClick={this.cancel}>&emsp;&emsp;取消&emsp;&emsp;</Button>
                </ButtonGroup>
              : <Button onClick={this.edit} type="primary">&emsp;&emsp;编辑&emsp;&emsp;</Button>
          }
        </div>}
      </div>



      <div className={Style.title}>
        <h3>Headers</h3>
        <div className={Style.titleRight}>
        {this.props.interfases.editable&&this.props.project.permission>2&&<Button onClick={()=>{this.handleAddHeader()}}>新建</Button>}
        </div>
      </div>
      <HeadersTable permission={this.props.project.permission}
data={toJS(this.props.interfases.data.headers)}></HeadersTable>



      {/\{/.test(this.props.project.info.gateway?this.props.interfases.data.gatewayUrl:this.props.interfases.data.url)&&<div>
        <div className={Style.title}>
          <h3>Path参数</h3>
        </div>
        <PathsTable permission={this.props.project.permission}
        data={toJS(this.props.interfases.data.paths)}></PathsTable>
      </div>}



      <div className={Style.title}>
        <h3>请求参数</h3>
        <div className={Style.titleRight}>
          <ButtonGroup >
            {this.props.interfases.editable&&this.props.project.permission>2&&<Button onClick={()=>{this.openAddValue('req',null)}}>新建</Button>}
            {this.props.interfases.editable&&<Button onClick={() => {
                this.setState({reqLeadInModalShow: true})
              }}>导入JSON</Button>}
              {this.props.interfases.editable&&<Button onClick={() => {
                this.setState({reqLeadInModelModalShow: true})
              }}>导入模板</Button>}
            <Button onClick={this.handleCopyModel.bind(this,'req')}>复制为模板</Button>
            <Button type={this.state.reqPreview
                ? 'primary'
                : ''} onClick={() => {
                this.setState({
                  reqPreview: !this.state.reqPreview
                })
              }}>预览</Button>
          </ButtonGroup>
        </div>
      </div>
      <EditableTable permission={this.props.project.permission} isReq onOpenAddValue={this.openAddValue} data={toJS(this.props.interfases.data.req)}></EditableTable>
      {
        this.state.reqPreview &&< div className = {
          Style.codeWrapper
        } >
          <ShowCode code={this.props.interfases.reqMock} title="请求模板"></ShowCode>
          <ShowCode code={this.props.interfases.reqCode}  title="请求属性"></ShowCode>
        </div>
      }



      <div className={Style.title}>
        <h3>响应内容</h3>
        <div className={Style.titleRight}>
          <ButtonGroup >
            {this.props.interfases.editable&&<Button onClick={()=>{this.openAddValue('res',null)}}>新建</Button>}
            {this.props.interfases.editable&&<Button onClick={() => {
                this.setState({resLeadInModalShow: true})
              }}>导入JSON</Button>}
            {this.props.interfases.editable&&<Button onClick={() => {
                this.setState({resLeadInModelModalShow: true})
              }}>导入模板</Button>}
            <Button onClick={this.handleCopyModel.bind(this,'res')}>复制为模板</Button>
            <Button type={this.state.resPreview
                ? 'primary'
                : ''} onClick={() => {
                this.setState({
                  resPreview: !this.state.resPreview
                })
              }}>预览</Button>
          </ButtonGroup>
        </div>
      </div>
      <EditableTable onOpenAddValue={this.openAddValue} permission={this.props.project.permission} data={toJS(this.props.interfases.data.res)}></EditableTable>
      {
        this.state.resPreview &&< div className = {
          Style.codeWrapper
        } >
          <ShowCode code={this.props.interfases.resMock}  title="响应模板"></ShowCode>
          <ShowCode code={this.props.interfases.resCode}  title="响应属性"></ShowCode>
        </div>
      }

      <div className={Style.title}>
        <h3>备注</h3>
        {this.props.project.permission>2&&<Button onClick={this.handleAddRemark} className={Style.titleBtn} size="small" type="primary">添加</Button>}
      </div>
      <List
      size="small"
      bordered
      dataSource={toJS(this.props.interfases.remarks.slice())}
      renderItem={item => (
        <List.Item actions={[<Icon onClick={this.handleUpdateRemark.bind(this,item)} type="edit"></Icon>,<Icon onClick={this.handleDeleteRemark.bind(this,item.id)} type="delete"></Icon>]}>
          <List.Item.Meta
                title={<div>{item.version}&emsp;{item.creator}</div>}
                description={<div className={Style.remarkMessage}>{item.message}</div>}
              />
          <div>{parseDate(item.createdAt)}</div>
        </List.Item>)}
      />
    </div>)
  }
}

export default Interfase;
