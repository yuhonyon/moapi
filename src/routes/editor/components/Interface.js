import React from "react";
import EditableTable from './EditableTable'
import AddValueModal from './AddValueModal'
import CodeEditor from './CodeEditor'
import LeadInModal from './LeadInModal'
import {Button} from 'antd'
import Style from './Interface.less'
import {inject, observer} from 'mobx-react';
const ButtonGroup = Button.Group

@inject("interfaces")
@observer
class Interface extends React.Component {
  state = {
    resLeadInModalShow: false,
    reqLeadInModalShow: false,
    addValueModalShow:false,
    resPreview: true,
    reqPreview: true
  }
  addValue={}
  save = () => {
    this.props.interfaces.closeEditable()
  }
  edit = () => {
    this.props.interfaces.openEditable()
  }
  cancel = () => {
    this.props.interfaces.closeEditable()
  }
  resLeadInOk=(code)=>{
    this.props.interfaces.leadInRes(code);
  }
  reqLeadInOk=(code)=>{
    //console.log(code)
  }
  addValueSuccess=(value)=>{
    this.addValue.value=value;
    this.props.interfaces.addValue(this.addValue)
  }
  openAddValue=(type,key)=>{
    this.setState({addValueModalShow:true})
    this.addValue={type:type,key:key,value:null}
  }
  render() {
    //console.log(this.props.interfaces.resMock)
    return (<div className={Style.wrapper}>
      <LeadInModal onClose={() => {
          this.setState({resLeadInModalShow: false})
        }} title="导入请求属性" visible={this.state.resLeadInModalShow} onOk={this.resLeadInOk} ></LeadInModal>
      <LeadInModal onClose={() => {
          this.setState({reqLeadInModalShow: false})
        }} title="导入响应属性" visible={this.state.reqLeadInModalShow} onOk={this.reqLeadInOk}></LeadInModal>
      <AddValueModal onClose={() => {
          this.setState({addValueModalShow: false})
        }} title="导入属性" visible={this.state.addValueModalShow} onOk={value=>{this.addValueSuccess(value)}}></AddValueModal>
      <div className={Style.header}>
        <ul>
          <li>
            <h3>{this.props.interfaces.details.name}</h3>
          </li>
          <li>地址:
            <a href="">{this.props.interfaces.details.url}</a>
          </li>
          <li>类型: {this.props.interfaces.details.methods}</li>
        </ul>
        <div>
          {
            this.props.interfaces.editable
              ? <ButtonGroup >
                  <Button onClick={this.save} type="primary">&emsp;&emsp;保存&emsp;&emsp;</Button>
                  <Button onClick={this.cancel}>取消</Button>
                </ButtonGroup>
              : <Button onClick={this.edit} type="primary">&emsp;&emsp;编辑&emsp;&emsp;</Button>
          }
        </div>
      </div>
      <div className={Style.buttonGroup}>
        <ButtonGroup >
          <Button onClick={()=>{this.openAddValue('res',null)}}>新建</Button>
          <Button onClick={() => {
              this.setState({resLeadInModalShow: true})
            }}>导入</Button>
          <Button type={this.state.resPreview
              ? 'primary'
              : ''} onClick={() => {
              this.setState({
                resPreview: !this.state.resPreview
              })
            }}>预览</Button>
        </ButtonGroup>
      </div>
      <EditableTable onOpenAddValue={this.openAddValue} data={this.props.interfaces.details.res.toJS()}></EditableTable>
      {
        this.state.resPreview &&< div className = {
          Style.codeWrapper
        } >
          <CodeEditor code={this.props.interfaces.resMock} title="请求模板"></CodeEditor>
          <CodeEditor code={this.props.interfaces.resCode}  title="请求属性"></CodeEditor>
        </div>
      }

      <div className={Style.buttonGroup}>
        <ButtonGroup >
          <Button>新建</Button>
          <Button onClick={() => {
              this.setState({resLeadInModalShow: true})
            }}>导入</Button>
          <Button type={this.state.reqPreview
              ? 'primary'
              : ''} onClick={() => {
              this.setState({
                reqPreview: !this.state.reqPreview
              })
            }}>预览</Button>
        </ButtonGroup>
      </div>
      <EditableTable isReq data={this.props.interfaces.details.req.toJS()}></EditableTable>
      {
        this.state.reqPreview &&< div className = {
          Style.codeWrapper
        } >
          <CodeEditor code={this.props.interfaces.reqMock}  title="响应模板"></CodeEditor>
        <CodeEditor code={this.props.interfaces.reqMock}  title="响应属性"></CodeEditor>
        </div>
      }
    </div>)
  }
}

export default Interface;
