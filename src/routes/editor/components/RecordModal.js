import { Modal,List, message, Avatar, Spin } from 'antd';
import React from 'react'
import reqwest from 'reqwest';
import Style from './RecordModal.less'
import InfiniteScroll from 'react-infinite-scroller';

const fakeDataUrl = 'https://randomuser.me/api/?results=5&inc=name,gender,email,nat&noinfo';


class RecordModal extends React.Component {
  state = {
    data: [],
    loading: false,
    hasMore: true,
  }
  handleCancel = (e) => {
    this.props.onClose();
  }
  getData = (callback) => {
    reqwest({
      url: fakeDataUrl,
      type: 'json',
      method: 'get',
      contentType: 'application/json',
      success: (res) => {
        callback(res);
      },
    });
  }
  componentDidMount() {
    this.getData((res) => {
      this.setState({
        data: res.results,
      });
    });
  }
  handleInfiniteOnLoad = () => {
    let data = this.state.data;
    this.setState({
      loading: true,
    });
    if (data.length > 14) {
      this.setState({
        hasMore: false,
        loading: false,
      });
      return;
    }
    this.getData((res) => {
      data = data.concat(res.results);
      this.setState({
        data,
        loading: false,
      });
    });
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
                dataSource={this.state.data}
                renderItem={item => (
                  <List.Item key={item.id}>
                    <List.Item.Meta
                      title={<a href="https://ant.design">{item.name.last}</a>}
                      description={item.email}
                    />
                    <div>Content</div>
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
