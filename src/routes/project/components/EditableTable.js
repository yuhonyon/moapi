import React from "react";
import { Table,Button,Input,Select ,Switch,Popover,Icon} from 'antd';
import Style from "./EditableTable.less"
import {inject,observer} from 'mobx-react';
import { DragSource, DropTarget } from 'react-dnd';
import WithDragDropContext from '@/components/WithDragDropContext';
const Option = Select.Option;
const { TextArea } = Input;


function dragDirection(
  dragIndex,
  hoverIndex,
  initialClientOffset,
  clientOffset,
  sourceClientOffset,
) {
  const hoverMiddleY = (initialClientOffset.y - sourceClientOffset.y) / 2;
  const hoverClientY = clientOffset.y - sourceClientOffset.y;
  if (dragIndex < hoverIndex && hoverClientY > hoverMiddleY) {
    return 'downward';
  }
  if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
    return 'upward';
  }
}

@inject("interfases")
@observer
class BodyRow extends React.Component {

  render() {
    const {
      isOver,
      connectDragSource,
      connectDropTarget,
      moveRow,
      dragRow,
      clientOffset,
      sourceClientOffset,
      initialClientOffset,
      ...restProps
    } = this.props;
    const style = { ...restProps.style, cursor: 'move' };

    let className = restProps.className;
    if (isOver && initialClientOffset) {
      const direction = dragDirection(
        dragRow.index,
        restProps.index,
        initialClientOffset,
        clientOffset,
        sourceClientOffset
      );
      if (direction === 'downward') {
        className += ' drop-over-downward';
      }
      if (direction === 'upward') {
        className += ' drop-over-upward';
      }
    }

    if(this.props.interfases.editable){
      return connectDragSource(
        connectDropTarget(
          <tr
            {...restProps}
            className={className}
            style={style}
          />
        )
      );
    }else{
      return <tr
        {...restProps}
        style={restProps.style}
      />
    }


  }
}

const rowSource = {
  canDrag(props, monitor){
    return document.activeElement.className!=='ant-input';
  },
  beginDrag(props) {
    return {
      index: props.index,
    };
  },
};

const rowTarget = {

  drop(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    if (dragIndex === hoverIndex) {
      return;
    }


    props.moveRow(dragIndex, hoverIndex);

    monitor.getItem().index = hoverIndex;
  },
};

const DragableBodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  sourceClientOffset: monitor.getSourceClientOffset(),
}))(
  DragSource('row', rowSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    dragRow: monitor.getItem(),
    clientOffset: monitor.getClientOffset(),
    initialClientOffset: monitor.getInitialClientOffset(),
  }))(BodyRow)
);

const editablePermission=(editable,permission,isReq,column)=>{
  if(!editable){
    return false;
  }
  if(permission>2){
    return true;
  }
  if(isReq||permission===1){
    return false;
  }
  if(column==="mockType"||column==="mockNum"||column==="mockValue"){
    return true;
  }
  return false;
}


const EditableCell = ({ editable, value, onChange,identify,column }) => {
  let cell;
  if(!editable){
    if(typeof value==='boolean'){
      if(identify==='switch'){
        value=value?'是':'否';
      }else{
        value=value?'true':'false';
      }
      
    }
    cell= value
  }else if(!identify){
    cell= <Input value={value}  onChange={e => onChange(e.target.value)} />
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
  return <div className={Style.cell} style={{whiteSpace:identify==='textarea'?'pre-wrap':null}}>{cell}</div>
}



const data = [];

@inject("interfases")
@observer
class EditableTable extends React.Component{

  columns = [{
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    className: Style.flex,
    render:(text,record)=>this.renderColumns(text,record,'name')
  }, {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    render:(text,record)=>this.renderColumns(text,record,'type',['Object','Number','Array','Boolean','String','Float','Integer'])
  }, {
    title: '必填',
    dataIndex: 'required',
    key: 'required',
    render:(text,record)=>this.renderColumns(text,record,'required','switch')
  }, {
    title: <div>
      规则类型<Popover content={<a target="_blank" href="http://mockjs.com/examples.html">mock.js文档</a>} title="提示">
              <Icon type="question-circle" theme="outlined" />
            </Popover>
    </div>,
    dataIndex: 'mockType',
    key: 'mockType',
    render:(text,record)=>this.renderColumns(text,record,'mockType',['String','Number','Array','Boolean','Object','RegExp'])
  }, {
    title: <div>
      规则量<Popover content={<a target="_blank" href="http://mockjs.com/examples.html">mock.js文档</a>} title="提示">
              <Icon type="question-circle" theme="outlined" />
            </Popover>
    </div>,
    dataIndex: 'mockNum',
    key: 'mockNum',
    render:(text,record)=>this.renderColumns(text,record,'mockNum')
  }, {
    title: '规则值/默认值',
    dataIndex: 'mockValue',
    key: 'mockValue',
    render:(text,record)=>this.renderColumns(text,record,'mockValue','textarea')
  }, {
    title: '简介',
    dataIndex: 'description',
    key: 'description',
    render:(text,record)=>this.renderColumns(text,record,'description','textarea')
  },
  {
    title: '操作',
    dataIndex: 'operate',
    key: 'operate',
    render:(text,record)=>this.renderOperate(text,record)
  }]

  // operate={
  //   title: '操作',
  //   dataIndex: 'operate',
  //   key: 'operate',
  //   render:(text,record)=>this.renderOperate(text,record)
  // }
  state = { data };

  components = {
    body: {
      row: DragableBodyRow,
    },
  }

  moveRow = (dragIndex, hoverIndex) => {
    this.props.interfases.changeSort(this.props.isReq?'req':'res',dragIndex, hoverIndex)
    // this.setState(
    //   update(this.state, {
    //     data: {
    //       $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
    //     },
    //   }),
    // );
  }



  renderOperate(text,record){
    if(!this.props.interfases.editable){
      return <Button shape="circle" icon="copy" onClick={()=>{this.props.onCopy(record)}} />
    }
    return (
      <div>
        <Button type="danger" shape="circle" icon="delete" onClick={()=>{
            this.handleDel(record.key)
          }} />
        <Button shape="circle" icon="copy" onClick={()=>{this.props.onCopy(record)}} />
      {(record.type==='Array'||record.type==='Object')&&<Button type="primary" shape="circle" icon="plus-circle-o" onClick={()=>{this.props.onOpenAddValue(this.props.isReq?'req':'res',record.key)}} />}
      </div>
    )
  }
  renderColumns(text,record,column,identify){
      return <EditableCell
                editable={editablePermission(this.props.interfases.editable,this.props.permission,this.props.isReq,column)}
                value={text}
                onChange={value=>this.handleChange(value,record.key,column)}
                identify={identify}
                column={column}
              />
  }



  handleDel(key){



    this.props.interfases.delField(this.props.isReq?'req':'res',key)

  }



  handleChange(value, key, column) {
    this.props.interfases.changeField(this.props.isReq?'req':'res',value, key, column)
  }

  componentDidMount(){
    // if(!this.props.isReq){
    //   this.columns.splice(2,1);
    // }
  }
  // componentWillUpdate(nextProps){
  //     if(this.props.interfases.editable&&this.columns[this.columns.length-1].key!=='operate'){
  //       this.columns.push(this.operate)
  //     }else if(!this.props.interfases.editable&&this.columns[this.columns.length-1].key==='operate'){
  //       this.columns.splice(-1,1);
  //     }
  // }
  render(){

    // if(this.props.isReq&&this.columns[2].key==="required"){
    //   this.columns.splice(2,1);
    // }
    // if(!this.props.interfases.editable&&this.columns[this.columns.length-1].key==='operate'){
    //   this.columns.splice(-1,1);
    // }else if(this.columns[this.columns.length-1].key!=='operate'){
    //   this.columns.push(this.operate)
    // }
    return <Table size="small" className={Style.table} pagination={false}
      components={this.components}
        onRow={(record, index) => ({
          index,
          moveRow: this.moveRow,
        })}
         columns={this.columns} bordered dataSource={this.props.data} toRender={this.props.interfases.editable} />
  }
}


export default WithDragDropContext(EditableTable);
