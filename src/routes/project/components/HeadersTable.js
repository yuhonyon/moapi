import React from "react";
import { Table,Button,Input} from 'antd';
import Style from "./HeadersTable.less"
import {inject,observer} from 'mobx-react';
import intl from "react-intl-universal";
const { TextArea } = Input;


const EditableCell = ({ editable, value, onChange,identify,column }) => {
  let cell;
  if(!editable){
    cell= value
  }else if(!identify){
    cell= <Input value={value} onChange={e => onChange(e.target.value)} />
  }else{
    cell= <TextArea value={value} onChange={e => onChange(e.target.value)} autosize />
  }
  return <div className={Style.cell}>{cell}</div>
}



@inject("interfases")
@observer
class HeadersTable extends React.Component{


  columns = [{
    title: intl.get("project.attr.name"),
    dataIndex: 'name',
    key: 'key',
    render:(text,record)=>this.renderColumns(text,record,'name')
  },{
    title: intl.get("project.attr.value"),
    dataIndex: 'value',
    key: 'value',
    render:(text,record)=>this.renderColumns(text,record,'value')
  }, {
    title: intl.get("project.attr.description"),
    dataIndex: 'description',
    key: 'description',
    render:(text,record)=>this.renderColumns(text,record,'description','textarea')
  }]

  operate={
    title: intl.get("project.attr.operate"),
    dataIndex: 'operate',
    key: 'operate',
    render:(text,record)=>this.renderOperate(text,record)
  }


  renderOperate(text,record){
    if(!this.props.interfases.editable){
      return null
    }
    return (
        <Button type="danger" shape="circle" icon="delete" onClick={()=>{
            this.handleDel(record.key)
          }} />
    )
  }
  renderColumns(text,record,column,identify){
      return <EditableCell
                editable={this.props.interfases.editable&&this.props.permission>2}
                value={text}
                onChange={value=>this.handleChange(value,record.key,column)}
                identify={identify}
                column={column}
              />
  }



  handleDel(key){

    this.props.interfases.delHeadersRow(key)

  }



  handleChange(value, key, column) {
    this.props.interfases.changeHeadersField(value, key, column)
  }

  componentWillUpdate(nextProps){
      if(this.props.interfases.editable&&this.columns[this.columns.length-1].key!=='operate'){
        this.columns.push(this.operate)
      }else if(!this.props.interfases.editable&&this.columns[this.columns.length-1].key==='operate'){
        this.columns.splice(-1,1);
      }
  }
  render(){
    return <Table size="small" className={Style.table} pagination={false} columns={this.columns} bordered dataSource={this.props.data} toRender={this.props.interfases.editable} />
  }
}


export default HeadersTable;
