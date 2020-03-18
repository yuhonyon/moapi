import { Modal,List, Spin, Button ,message} from 'antd';
import React from 'react'
import fetchApi from '@/api';
import * as JsDiff from 'diff';
import Style from './RecordModal.less'
import InfiniteScroll from 'react-infinite-scroller';
import {inject, observer} from 'mobx-react';
import {parseDate,recordType} from "@/filters"
const confirm = Modal.confirm;
@inject("interfases")
@observer
class RecordModal extends React.Component {
  state = {
    records: {
      data:[],
      total:1000
    },
    loading: false,
    hasMore: true,
  }
  handleCancel = (e) => {
    this.props.onClose();
  }
  params={
    page:1,
    pageSize:10
  }
  fetchData = () => {
    fetchApi.fetchGetInterfaseRecord(this.props.interfases.data.id,this.params).then(data=>{
      this.params.page++;
      let records = this.state.records;
      records.data=records.data.concat(data.data);
      records.total=data.total;
      this.setState({
        records:records ,
        loading: false,
      });
    })
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.visible&&nextProps.visible!==this.props.visible){
      this.params.page=1;
      this.setState({
        records:{data:[],total:0}
      });
      this.fetchData()
    }
  }
  formatDate(date){
    let diffdate=Date.now()-new Date(date).getTime();
    if(diffdate<60000){
      return parseInt(diffdate/1000,10)+"秒前";
    }else if(diffdate<60000*60){
      return parseInt(diffdate/60000,10)+"分钟前";
    }else if(diffdate<60000*60*24){
      return parseDate(diffdate,"HH小时mm分钟前");
    }else{
      return parseDate(date,"yyyy-MM-dd HH:mm");
    }
  }
  handleInfiniteOnLoad = () => {
    this.setState({
      loading: true,
    });
    if (this.state.records.data.length >= this.state.records.total) {
      this.setState({
        hasMore: false,
        loading: false,
      });
      return;
    }
    this.fetchData();
  }
  handleRecovery=(history)=>{
    confirm({
      title: '提示',
      content: '确定还原该记录',
      
      onOk:()=> {
        this.props.interfases.recoveryRecord(history);
        this.props.onClose();
      },
      onCancel() {},
    });
  }


   changed=(obj1,obj2)=> {
    const diff = JsDiff.diffJson(obj1,obj2);
    const fragment = document.createElement('div');
    for (let i=0; i < diff.length; i++) {
  
      if (diff[i].added && diff[i + 1] && diff[i + 1].removed) {
        const swap = diff[i];
        diff[i] = diff[i + 1];
        diff[i + 1] = swap;
      }
  
      let node;
      if (diff[i].removed) {
        node = document.createElement('del');
        node.appendChild(document.createTextNode(diff[i].value));
      } else if (diff[i].added) {
        node = document.createElement('ins');
        node.appendChild(document.createTextNode(diff[i].value));
      } else {
        node = document.createTextNode(diff[i].value.replace(/^([\s|\S]{1000})([\s|\S]*)([\s|\S]{1000})$/,"$1\n****省略****\n****省略****\n****省略****\n$3"));
      }
      fragment.appendChild(node);
    }
  
    return fragment;
  }

  handleDiff=(id)=>{
    const data=this.state.records.data.filter(item=>!!item.history)
    const index = data.findIndex(item=>item.id===id);
    if(index>=0&&data[index].history&&data[index+1]&&data[index+1].history){
      const keys=['versions','res','req','name','url','proxyType','headers','method','paths','proxyUrl']
      const obj1=keys.reduce((total,item)=>{
        total[item]=data[index+1].history[item];
        return total;
      },{})
      const obj2=keys.reduce((total,item)=>{
        total[item]=data[index].history[item];
        return total;
      },{})
      const diffDom=this.changed(obj1,obj2)
      console.log(diffDom)
      Modal.info({
        width:840,
        maskClosable:true,
        title: '更新内容',
        content: (
          <pre  dangerouslySetInnerHTML={{__html: diffDom.innerHTML}}></pre>
        ),
        onOk() {},
      });
      
    }else{
      message.error('缺失历史参考');
    }
  }

  render() {
    return (
      <div>
        <Modal maskClosable={false}
          width={640}
          title="修改记录"
          visible={this.props.visible}
          onCancel={this.handleCancel}
        >
          <div className={Style.infiniteContainer}>
            <InfiniteScroll
              initialLoad={false}
              pageStart={0}
              loadMore={this.handleInfiniteOnLoad}
              hasMore={!this.state.loading && this.state.hasMore}
              useWindow={false}
            >
              <List
                dataSource={this.state.records.data}
                renderItem={item => (
                  <List.Item key={item.id}>
                    <List.Item.Meta
                      title={<span>{item.creator}{recordType(item.type)}&nbsp;{item.history&&<span><Button onClick={()=>this.handleRecovery(item.history)} size="small">还原</Button>&nbsp;<Button onClick={()=>this.handleDiff(item.id)} size="small">修改内容</Button></span>}</span>}
                      description={<p>{item.type==="DELETE_REMARK"?<s>{item.message}</s>:(item.message||"直接保存")}{item.history&&<span>({item.history.versions.join('、')})</span>}</p>}
                    />
                    {this.formatDate(item.createdAt)}
                  </List.Item>
                )}
              >
                {this.state.loading && this.state.hasMore && (
                  <div className={Style.loadingContainer}>
                    <Spin />
                  </div>
                )}
              </List>
            </InfiniteScroll>
          </div>
        </Modal>
      </div>
    );
  }
}

export default RecordModal;
