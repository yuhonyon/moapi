import React from "react";
import EditableTable from './EditableTable'
import AddValueModal from './AddValueModal'
import AddRemarkModal from './AddRemarkModal'
import HeadersTable from './HeadersTable'
import RecordModal from './RecordModal'
import ShowCode from './ShowCode'
import LeadInModal from './LeadInModal'
import {Button,List,Radio,message,Modal,Input,Select,Icon,Switch} from 'antd'
import Style from './Interfase.less'
import {inject, observer} from 'mobx-react';
import {toJS} from 'mobx';
import {parseDate} from '@/filters'
import intl from "react-intl-universal";
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
    this.props.interfases.addRemork({interfaseId:this.props.interfases.data.id,...info})
  }

  handleAddHeader=()=>{
    this.props.interfases.addHeadersRow()
  }

  handleAddRemark=(e)=>{
    this.setState({addRemarkModalShow:true})
  }
  handleDeleteRemark=(id)=>{
    Modal.confirm({
      title:'警告?',
      content:'确认删除备注?',
      onOk:()=>{
        this.props.interfases.deleteRemark(id)
      },
    })
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
    this.props.interfases.openEditable()
  }
  cancel = () => {
    this.props.interfases.closeEditable()
    this.props.project.getProjectData()
  }
  resLeadInOk=(code)=>{
    this.props.interfases.leadInRes(code);
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

  render() {
    //console.log(this.props.interfases.resMock)
    return (<div className={Style.wrapper}>
      <AddRemarkModal onClose={() => {
          this.setState({addRemarkModalShow: false})
        }}  visible={this.state.addRemarkModalShow} onOk={this.handleAddRemarkOk}></AddRemarkModal>
      <LeadInModal onClose={() => {
          this.setState({resLeadInModalShow: false})
        }} title="导入请求属性" visible={this.state.resLeadInModalShow} onOk={this.resLeadInOk} ></LeadInModal>
      <LeadInModal onClose={() => {
          this.setState({reqLeadInModalShow: false})
        }} title="导入响应属性" visible={this.state.reqLeadInModalShow} onOk={this.reqLeadInOk}></LeadInModal>
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
              {this.props.interfases.data.name} &emsp;
              {this.props.interfases.editable&&<RadioGroup onChange={this.handleProxyTypeChange} value={this.props.interfases.data.proxyType}>
                <RadioButton value={0}>{intl.get('project.mock.off')}</RadioButton>
                <RadioButton value={1}>{intl.get('project.mock.on')}</RadioButton>
                <RadioButton value={2}>{intl.get('project.mock.merge')}</RadioButton>
              </RadioGroup>}
            </h3>
          </li>
          <li>{intl.get("project.url")}:
            <a target="_blank" href={this.props.interfases.testUrl}>{this.props.interfases.data.url}</a>
          </li>
          <li>{intl.get("project.method")}: {this.props.interfases.data.method}</li>
          <li>{intl.get("project.description")}: {this.props.interfases.data.description}</li>
        </ul>
        {this.props.project.permission>1&&<div>
          {
            this.props.interfases.editable
              ? <ButtonGroup >
                  <Button onClick={this.saveInterfase} type="primary">&emsp;&emsp;{intl.get("project.btn.save")}&emsp;&emsp;</Button>
                  <Button onClick={this.cancel}>&emsp;&emsp;{intl.get("project.btn.cancel")}&emsp;&emsp;</Button>
                </ButtonGroup>
              : <Button onClick={this.edit} type="primary">&emsp;&emsp;{intl.get("project.btn.edit")}&emsp;&emsp;</Button>
          }
        </div>}
      </div>



      <div className={Style.title}>
        <h3>Headers</h3>
        <div className={Style.titleRight}>
        {this.props.interfases.editable&&this.props.project.permission>2&&<Button onClick={()=>{this.handleAddHeader()}}>{intl.get("project.btn.add")}</Button>}
        </div>
      </div>
      <HeadersTable permission={this.props.project.permission}
data={toJS(this.props.interfases.data.headers)}></HeadersTable>



      <div className={Style.title}>
        <h3>{intl.get("project.req")}</h3>
        <div className={Style.titleRight}>
          <ButtonGroup >
            {this.props.interfases.editable&&this.props.project.permission>2&&<Button onClick={()=>{this.openAddValue('req',null)}}>{intl.get("project.btn.add")}</Button>}
            {this.props.interfases.editable&&<Button onClick={() => {
                this.setState({reqLeadInModalShow: true})
              }}>{intl.get("project.btn.leadIn")}</Button>}
            <Button type={this.state.reqPreview
                ? 'primary'
                : ''} onClick={() => {
                this.setState({
                  reqPreview: !this.state.reqPreview
                })
              }}>{intl.get("project.btn.preview")}</Button>
          </ButtonGroup>
        </div>
      </div>
      <EditableTable permission={this.props.project.permission} isReq onOpenAddValue={this.openAddValue} data={toJS(this.props.interfases.data.req)}></EditableTable>
      {
        this.state.reqPreview &&< div className = {
          Style.codeWrapper
        } >
          <ShowCode code={this.props.interfases.reqMock} title={intl.get("project.resMock")}></ShowCode>
          <ShowCode code={this.props.interfases.reqCode}  title={intl.get("project.req")}></ShowCode>
        </div>
      }



      <div className={Style.title}>
        <h3>{intl.get("project.res")}</h3>
        <div className={Style.titleRight}>
          <ButtonGroup >
            {this.props.interfases.editable&&<Button onClick={()=>{this.openAddValue('res',null)}}>{intl.get("project.btn.add")}</Button>}
            {this.props.interfases.editable&&<Button onClick={() => {
                this.setState({resLeadInModalShow: true})
              }}>{intl.get("project.btn.leadIn")}</Button>}
            <Button type={this.state.resPreview
                ? 'primary'
                : ''} onClick={() => {
                this.setState({
                  resPreview: !this.state.resPreview
                })
              }}>{intl.get("project.btn.preview")}</Button>
          </ButtonGroup>
        </div>
      </div>
      <EditableTable permission={this.props.project.permission} data={toJS(this.props.interfases.data.res)}></EditableTable>
      {
        this.state.resPreview &&< div className = {
          Style.codeWrapper
        } >
          <ShowCode code={this.props.interfases.resMock}  title={intl.get("project.resMock")}></ShowCode>
          <ShowCode code={this.props.interfases.resCode}  title={intl.get("project.res")}></ShowCode>
        </div>
      }

    </div>)
  }
}

export default Interfase;
