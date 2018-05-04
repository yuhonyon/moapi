import React from "react";
import EditableTable from './EditableTable'
import AddValueModal from './AddValueModal'
import RecordModal from './RecordModal'
import ShowCode from './ShowCode'
import LeadInModal from './LeadInModal'
import {Button,List,Radio} from 'antd'
import Style from './Interface.less'
import {inject, observer} from 'mobx-react';
const ButtonGroup = Button.Group;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

@inject("interfaces")
@observer
class Interface extends React.Component {
  state = {
    resLeadInModalShow: false,
    reqLeadInModalShow: false,
    addValueModalShow:false,
    recordModalShow:false,
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
    this.props.interfaces.leadInReq(code);
  }
  addValueSuccess=(value)=>{
    this.addValue.value=value;
    this.props.interfaces.addValue(this.addValue)
  }
  openAddValue=(type,key)=>{
    this.setState({addValueModalShow:true})
    this.addValue={type:type,key:key,value:null}
  }
  openRecord=()=>{
    this.setState({recordModalShow:true})
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
      <RecordModal onClose={() => {
          this.setState({recordModalShow: false})
        }} title="导入属性" visible={this.state.recordModalShow}></RecordModal>
      <div className={Style.header}>
        <ul>
          <li>
            <h3>
              {this.props.interfaces.details.name} <Button onClick={this.openRecord} type="primary" size="small">修改记录</Button>&emsp;
              {this.props.interfaces.editable&&<RadioGroup defaultValue="a">
                <RadioButton value="a">开启mock</RadioButton>
                <RadioButton value="b">关闭mock</RadioButton>
                <RadioButton value="c">累计mock</RadioButton>
              </RadioGroup>}
            </h3>
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
                  <Button onClick={this.save} type="primary">&emsp;&emsp;直接保存&emsp;&emsp;</Button>
                  <Button onClick={this.save} type="primary">&emsp;&emsp;保存&emsp;&emsp;</Button>
                  <Button onClick={this.cancel}>取消</Button>
                </ButtonGroup>
              : <Button onClick={this.edit} type="primary">&emsp;&emsp;编辑&emsp;&emsp;</Button>
          }
        </div>
      </div>

      <div className={Style.title}>
        <h3>备注</h3>
        {this.props.interfaces.editable&&<Button className={Style.titleBtn} size="small" type="primary">添加</Button>}
      </div>

      <List
      size="small"
      bordered
      dataSource={this.props.interfaces.details.remarks}
      renderItem={item => (
        <List.Item actions={[<a>编辑</a>, <a>删除</a>]}>
          <List.Item.Meta
                title={<div>{item.version}&emsp;{item.timeStamp}</div>}
                description={item.message}
              />
          <div>{item.name}</div>
        </List.Item>)}
      />

      <div className={Style.title}>
        <h3>请求参数</h3>
        <div className={Style.titleRight}>
          <ButtonGroup >
            {this.props.interfaces.editable&&<Button onClick={()=>{this.openAddValue('res',null)}}>新建</Button>}
            {this.props.interfaces.editable&&<Button onClick={() => {
                this.setState({resLeadInModalShow: true})
              }}>导入</Button>}
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
      <EditableTable onOpenAddValue={this.openAddValue} data={this.props.interfaces.details.res.toJS()}></EditableTable>
      {
        this.state.resPreview &&< div className = {
          Style.codeWrapper
        } >
          <ShowCode code={this.props.interfaces.resMock} title="请求模板"></ShowCode>
          <ShowCode code={this.props.interfaces.resCode}  title="请求属性"></ShowCode>
        </div>
      }



      <div className={Style.title}>
        <h3>响应内容</h3>
        <div className={Style.titleRight}>
          <ButtonGroup >
            {this.props.interfaces.editable&&<Button onClick={()=>{this.openAddValue('req',null)}}>新建</Button>}
            {this.props.interfaces.editable&&<Button onClick={() => {
                this.setState({reqLeadInModalShow: true})
              }}>导入</Button>}
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
      <EditableTable isReq data={this.props.interfaces.details.req.toJS()}></EditableTable>
      {
        this.state.reqPreview &&< div className = {
          Style.codeWrapper
        } >
          <ShowCode code={this.props.interfaces.reqMock}  title="响应模板"></ShowCode>
          <ShowCode code={this.props.interfaces.reqMock}  title="响应属性"></ShowCode>
        </div>
      }
    </div>)
  }
}

export default Interface;
