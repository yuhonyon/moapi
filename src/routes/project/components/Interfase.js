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
import {mergePath,getInterface} from '@/utils'
const ButtonGroup = Button.Group;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option=Select.Option;
const TextArea=Input.TextArea;
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
    reqPreview: true
  }
  addValue={}
  recordMessage=""
  forceSave=false
  addVersion=""
  


  saveInterfase = () => {
    this.props.interfases.closeEditable()
    return this.fetchSaveInterfase()
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
    let remark="";
    Modal.confirm({
      title:'是否保存接口',
      okText:"保存",
      content: <div>
        <br/>
        <h5>修改记录:</h5>
        <Input defaultValue={this.recordMessage} onChange={e=>this.recordMessage=e.target.value} ></Input>
        <br/>
        <br/>
        <h5>备注:</h5>
        <TextArea defaultValue={remark} onChange={e=>remark=e.target.value} ></TextArea>
        <br/>
        <br/>
        <Switch onChange={value=>this.forceSave=value} size="small" defaultChecked={this.forceSave} />强制保存</div>,
      onOk:()=>{
        this.saveInterfase().then(()=>{
          if(remark){
            this.handleAddRemarkOk({version:this.props.project.info.version,
              message:remark})
          }
          remark='';
          this.recordMessage="";
        });
        
      },
      onCancel:()=>{
        this.recordMessage="";
        this.forceSave=false;
        remark='';
      }
    })
  }
  handlerAddVersion=()=>{
    this.addVersion=this.props.project.info.version;
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
  resLeadInOk=({code,target,increment})=>{
    this.props.interfases.leadInRes(code,target,increment);
  }
  resLeadInModelOk=({code,target})=>{
    this.props.interfases.leadInModel('res',code,target);
  }
  reqLeadInModelOk=({code,target})=>{
    this.props.interfases.leadInModel('req',code,target);
  }
  reqLeadInOk=({code,target,increment})=>{
    this.props.interfases.leadInReq(code,target,increment);
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
    if(!this.props.interfases.editable){
      this.fetchSaveInterfase()
    }
    
  }

  fetchSaveInterfase=()=> {
    const data=toJS(this.props.interfases.data);
    data.headers=data.headers.filter(item=>!!item.name);
    data.recordMessage=this.recordMessage;
    data.forceSave=this.forceSave
    this.forceSave=false;
    return this.props.project.updateInterfase(this.props.interfases.data.id,data).then((data)=>{
        message.success('保存成功');
        return data;
    })
  }

  handleCopyModel=(type)=>{
    if(copy(type==='res'?this.props.interfases.resModel:this.props.interfases.resModel)){
      message.success('复制成功');
    }
  }

  handleCopyRow=(record)=>{
    let model=JSON.parse(JSON.stringify(record));
    function removeKey(data){
      for(let item of data){
        delete item.key;
        if(item.children){
          item.children=removeKey(item.children)
        }
      }
      return data;
    }

    if(model.children){
      model.children=removeKey(model.children);
    }else{
      delete model.key
    }

    if(copy(JSON.stringify(model,null,2))){
      message.success('复制成功');
    }
  }

  handleDev=()=>{
    message.info('开发中...')
  }

  handleGenerateTS=()=>{
  const name=this.props.interfases.data.method.replace(/^(\w)(\w*)$/,($,$1,$2)=>$1+$2.toLowerCase())+this.props.interfases.data.url.replace(/([0-9.])|(\/{0,1}\{.*\})/g,'').replace(/[\_/\-]+(\w)/g,($,$1)=>{
    return $1.toUpperCase()
}).replace(/^[a-z]/g,($)=>{
    return $.toUpperCase()
})
  const hasParam=this.props.interfases.reqModel!=='[]';
  const hasReponse=this.props.interfases.resModel!=='[]';
  let urlParam=/{(.*)\}/.test(this.props.interfases.data.url)?((hasParam?',':'')+this.props.interfases.data.url.match(/\{(.*)\}/)[1])+':string':'';
  let code ='';
  if(hasParam){
    code+=getInterface(name+'Param',JSON.parse(this.props.interfases.reqModel),'')
  }
  if(hasReponse){
    code+=getInterface(name,JSON.parse(this.props.interfases.resModel),'')
  }
  code+=`
// ${this.props.interfases.data.name}
export function fetch${name}(${hasParam?'param: I'+name+'Param':''}${urlParam}) {
  return fetch.${this.props.interfases.data.method.toLowerCase()}${hasReponse?'<I'+name+'>':''}('${this.props.interfases.data.url.replace(/\{/g,'${')}'${hasParam?',param':''});
}
  `
  Modal.info({
    title: 'TS代码(头部菜单可生成所有接口代码)',
    width:680,
    content: <pre>{code}</pre>,
    onOk: () => {
      copy(code)
    },
    okText: '复制'
  })
  }



  handleGenerateJS=()=>{
    const name=this.props.interfases.data.method.replace(/^(\w)(\w*)$/,($,$1,$2)=>$1+$2.toLowerCase())+this.props.interfases.data.url.replace(/([0-9.])|(\/{0,1}\{.*\})/g,'').replace(/[\_/\-]+(\w)/g,($,$1)=>{
      return $1.toUpperCase()
  }).replace(/^[a-z]/g,($)=>{
      return $.toUpperCase()
  })
    const hasParam=this.props.interfases.reqModel!=='[]';
    let urlParam=/{(.*)\}/.test(this.props.interfases.data.url)?((hasParam?',':'')+this.props.interfases.data.url.match(/\{(.*)\}/)[1]):'';

    let code ='';
    code+=`
  // ${this.props.interfases.data.name}
  export function fetch${name}(${hasParam?'param':''}${urlParam}) {
    return fetch.${this.props.interfases.data.method.toLowerCase()}(\`${this.props.interfases.data.url.replace(/\{/g,'${')}\`${hasParam?',param':''});
  }
    `
    Modal.info({
      title: 'JS代码(头部菜单可生成所有接口代码)',
      width:680,
      content: <pre>{code}</pre>,
      onOk: () => {
        copy(code)
      },
      okText: '复制'
    })
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
          this.setState({reqLeadInModalShow: false})
        }} title="导入请求属性" type="req" visible={this.state.reqLeadInModalShow} onOk={this.reqLeadInOk} ></LeadInModal>
      <LeadInModal onClose={() => {
          this.setState({resLeadInModalShow: false})
        }} title="导入响应属性" type="res" visible={this.state.resLeadInModalShow} onOk={this.resLeadInOk}></LeadInModal>
      <LeadInModelModal onClose={() => {
          this.setState({reqLeadInModelModalShow: false})
        }} title="导入请求模板" type="req" visible={this.state.reqLeadInModelModalShow} onOk={this.reqLeadInModelOk}></LeadInModelModal>
      <LeadInModelModal onClose={() => {
          this.setState({resLeadInModelModalShow: false})
        }} title="导入响应模板" type="res" visible={this.state.resLeadInModelModalShow} onOk={this.resLeadInModelOk}></LeadInModelModal>
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
              {this.props.project.permission>1&&<RadioGroup buttonStyle="solid" onChange={this.handleProxyTypeChange} value={this.props.interfases.data.proxyType}>
                <RadioButton value={0}>关闭mock</RadioButton>
                <RadioButton value={1}>开启mock</RadioButton>
                {/* <RadioButton value={2}>合并mock</RadioButton> */}
              </RadioGroup>}
            </h3>
          </li>
          <li>地址:&nbsp;
            <a target="_blank" href={this.props.interfases.testUrl}>{this.props.interfases.data.url}</a>&nbsp;<Button onClick={()=>{copy(this.props.interfases.data.url)}} size="small">复制</Button>
          </li>
          <li>mock地址:&nbsp;
            {mergePath(this.props.project.mockUrl,this.props.interfases.data.url)}&nbsp;<Button onClick={()=>{copy(mergePath(this.props.project.mockUrl,this.props.interfases.data.url))}} size="small">复制</Button>
          </li>
          <li>代理地址:&nbsp;
            {mergePath(this.props.interfases.realProxyUrl,this.props.interfases.data.url)}&nbsp;<Button onClick={()=>{copy(mergePath(this.props.interfases.realProxyUrl,this.props.interfases.data.url))}} size="small">复制</Button>
          </li>
          <li>类型:&nbsp; {this.props.interfases.data.method}</li>
          <li>相关版本:&nbsp; {this.props.interfases.data.versions.slice().join("、")}&nbsp;{this.props.interfases.editable&&this.props.project.permission>2&&<Button onClick={this.handlerAddVersion} size="small">添加版本标记</Button>}</li>
          <li>简介:&nbsp; {this.props.interfases.data.description}</li>
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
        <h3>实验功能</h3>
      </div>

      <div>
        <Button onClick={this.handleGenerateJS}>生成JS代码</Button>&nbsp;
        <Button onClick={this.handleGenerateTS}>生成TS代码</Button>&nbsp;
        <a target="_blank" href={this.props.interfases.testUrl}><Button >测试接口</Button></a>&nbsp;
        <Button onClick={this.handleDev}>生成DtoClass</Button>&nbsp;
        <Button onClick={this.handleDev}>生成curl</Button>&nbsp;
        <Button onClick={this.handleDev}>复制接口</Button>
      </div>





      <div className={Style.title}>
        <h3>备注</h3>
        {this.props.project.permission>2&&<Button onClick={this.handleAddRemark} className={Style.titleBtn} size="small" type="primary">添加</Button>}
      </div>
      <List
      size="small"
      bordered
      loadMore={this.props.interfases.loadRemarkMoreVisible&&this.props.interfases.remarks.length>3?(
        <div onClick={this.props.interfases.loadRemarkMore} style={{
          textAlign: 'center', height: 32, lineHeight: '32px',cursor:'pointer'
        }}
        >
          查看更多
        </div>
      ):null}
      dataSource={this.props.interfases.remarks.slice(this.props.interfases.loadRemarkMoreVisible?-3:0).reverse()}
      renderItem={item => (
        <List.Item actions={[<Icon onClick={this.handleUpdateRemark.bind(this,item)} type="edit"></Icon>,<Icon onClick={this.handleDeleteRemark.bind(this,item.id)} type="delete"></Icon>]}>
          <List.Item.Meta
                title={<div>{item.version}&emsp;{item.creator}</div>}
                description={<div className={Style.remarkMessage}>{item.message}</div>}
              />
          <div>{parseDate(item.createdAt)}</div>
        </List.Item>)}

      />



      <div className={Style.title}>
        <h3>Headers</h3>
        <div className={Style.titleRight}>
        {this.props.interfases.editable&&this.props.project.permission>2&&<Button onClick={()=>{this.handleAddHeader()}}>新建</Button>}
        </div>
      </div>
      <HeadersTable permission={this.props.project.permission}
data={toJS(this.props.interfases.data.headers)}></HeadersTable>



      {/\{/.test(this.props.interfases.data.url)&&<div>
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
      <EditableTable onCopy={this.handleCopyRow} permission={this.props.project.permission} isReq onOpenAddValue={this.openAddValue} data={toJS(this.props.interfases.data.req)}></EditableTable>
      {
        this.state.reqPreview &&< div className = {
          Style.codeWrapper
        } >
          <ShowCode maxHeight={500} code={this.props.interfases.reqModel} title="请求模板"></ShowCode>
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
      <EditableTable onCopy={this.handleCopyRow} onOpenAddValue={this.openAddValue} permission={this.props.project.permission} data={toJS(this.props.interfases.data.res)}></EditableTable>
      {
        this.state.resPreview &&< div className = {
          Style.codeWrapper
        } >
          <ShowCode maxHeight={500}  code={this.props.interfases.resModel}  title="响应模板"></ShowCode>
          <ShowCode code={this.props.interfases.resCode}  title="响应属性"></ShowCode>
        </div>
      }

      
    </div>
    )
  }
}

export default Interfase;
