import React from "react";
import { Table,Button,Input,Select ,Switch} from 'antd';
import Style from "./EditableTable.less"
import {inject,observer} from 'mobx-react';
const Option = Select.Option;
const { TextArea } = Input;




const EditableCell = ({ editable, value, onChange,identify }) => {
  let cell;
  if(!editable){
    if(typeof value==='boolean'){
      value=value?'是':'否';
    }
    cell= value
  }else if(!identify){
    cell= <Input value={value} onChange={e => onChange(e.target.value)} />
  }else if(identify==='switch'){
    cell= <Switch size="small" checked={value} onChange={value => onChange(value)} />
  }else if(identify==='textarea'){
    cell= <TextArea value={value} onChange={e => onChange(e.target.value)} autosize />

  }else{
    cell= <Select value={value} onChange={value => onChange(value)}>
              {
                identify.map((type)=><Option value={type} key={type}>{type}</Option>)
              }
          </Select>
  }
  return <div className={Style.cell}>{cell}</div>
}



const data = [{
  key: '0',
  name: 'list',
  type: 'Object',
  required: true,
  mockType: 'String',
  mockNum: 1,
  mockValue: "12",
  description: '注意是打发斯蒂芬',
  children:[
    {
      key: '0-0',
      name: 'list',
      type: 'String',
      required: true,
      mockType: 'String',
      mockNum: 1,
      mockValue: "12",
      description: '注意是打发斯蒂芬'
    }
  ]
}];

@inject("interfaces")
@observer
class EditableTable extends React.Component{


  columns = [{
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    render:(text,record)=>this.renderColumns(text,record,'name')
  }, {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    render:(text,record)=>this.renderColumns(text,record,'type',['Object','Number','Array','Boolean','String','Long','Enum','Long[]','Number[]','String[]'])
  }, {
    title: '必填',
    dataIndex: 'required',
    key: 'required',
    render:(text,record)=>this.renderColumns(text,record,'required','switch')
  }, {
    title: '规则类型',
    dataIndex: 'mockType',
    key: 'mockType',
    render:(text,record)=>this.renderColumns(text,record,'mockType',['String','Number','Array','Boolean','Object'])
  }, {
    title: '规则量',
    dataIndex: 'mockNum',
    key: 'mockNum',
    render:(text,record)=>this.renderColumns(text,record,'mockNum')
  }, {
    title: '规则值',
    dataIndex: 'mockValue',
    key: 'mockValue',
    render:(text,record)=>this.renderColumns(text,record,'mockValue','textarea')
  }, {
    title: '简介',
    dataIndex: 'description',
    key: 'description',
    render:(text,record)=>this.renderColumns(text,record,'description','textarea')
  }]

  operate={
    title: '操作',
    dataIndex: 'operate',
    key: 'operate',
    render:(text,record)=>this.renderOperate(text,record)
  }
  state = { data };
  renderOperate(text,record){
    if(!this.props.interfaces.editable){
      return null
    }
    return (
      <div>
        <Button type="danger" shape="circle" icon="delete" />
        {(record.type==='Array'||record.type==='Object')&&<Button type="primary" shape="circle" icon="plus-circle-o"/>}
      </div>
    )
  }
  renderColumns(text,record,column,identify){
      return <EditableCell
                editable={this.props.interfaces.editable}
                value={text}
                onChange={value=>this.handleChange(value,record.key,column)}
                identify={identify}
              />
  }
  handleChange(value, key, column) {
    const newData = [...this.props.data];
    const keys=key.split('-');
    let curKey='';
    let target={children:newData};
    for(let i =0;i< keys.length;i++){
      curKey+=keys[i];
      target = target.children.filter(item => curKey === item.key)[0];
      curKey+="-"
    }
    if (target) {
      target[column] = value;
      this.props.interfaces.changeReq(newData)
    }
  }
  componentDidMount(){
    if(this.props.isReq){
      this.columns.splice(2,1);
    }
  }
  componentWillReceiveProps(nextProps){
    console.log(this.props.interfaces.editable,nextProps.interfaces.editable,1)
    if(this.props.interfaces.editable!==nextProps.interfaces.editable){
      if(nextProps.interfaces.editable){
        this.columns.push(this.operate)
      }else{
        this.columns.splice(-1,1);
      }
    }
  }
  render(){

    // if(this.props.isReq&&this.columns[2].key==="required"){
    //   this.columns.splice(2,1);
    // }
    // if(!this.props.interfaces.editable&&this.columns[this.columns.length-1].key==='operate'){
    //   this.columns.splice(-1,1);
    // }else if(this.columns[this.columns.length-1].key!=='operate'){
    //   this.columns.push(this.operate)
    // }
    return <Table size="small" className={Style.table} pagination={false} columns={this.columns} bordered dataSource={this.props.data} toRender={this.props.interfaces.editable} />
  }
}


export default EditableTable;
