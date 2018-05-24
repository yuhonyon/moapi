import { Modal,List, Spin } from 'antd';
import React from 'react'
import fetchApi from '@/api';
import Style from './RecordModal.less'
import InfiniteScroll from 'react-infinite-scroller';
import {inject, observer} from 'mobx-react';

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
      this.fetchData()
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
  render() {
    return (
      <div>
        <Modal
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
                      title={<a href="https://ant.design">{item.creator}</a>}
                      description={item.type+item.message}
                    />
                    <div>{item.createdAt}</div>
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
