import React from "react";
import {List,Spin} from 'antd';
import { Link  } from 'react-router-dom'
import Style from "./RecordList.less";
import {inject, observer} from 'mobx-react';
import {recordType,formatDate} from "@/filters"
import InfiniteScroll from 'react-infinite-scroller';

@inject("home")
@observer
class Layout extends React.Component {
  state={
    loading:false,
    hasMore:true
  }
  params={
    page:2,
    pageSize:10
  }


  handleInfiniteOnLoad=()=>{
    this.setState({
      loading: true,
    });
    if (this.props.home.recordList.data.length >= this.props.home.recordList.total) {
      this.setState({
        hasMore: false,
        loading: false,
      });
      return;
    }
    this.props.home.getRecordList(this.params).then(()=>{
      this.params.page++;
      this.setState({
        loading: false,
      });
    })
  }

  render(){
    return (
      <div className={Style.infiniteContainer}>
      <InfiniteScroll
        initialLoad={false}
        pageStart={0}
        loadMore={this.handleInfiniteOnLoad}
        hasMore={!this.state.loading && this.state.hasMore}
        useWindow={false}
      >
      <List
        className={Style.list}
        bordered
        itemLayout="horizontal"
        dataSource={this.props.home.recordList.data}
        renderItem={item => (
          <List.Item actions={[<span className={Style.header}>{formatDate(item.createdAt
)}</span>]}>
            <Link to="/project">{item.creator}</Link> &nbsp;{recordType(item.type)}&nbsp;
            <span>
              {item.type==="DELETE_PROJECT"?<s>{item.projectName}</s>:
              (<Link to={`project/${item.projectId}`}>
              {item.projectName}
              </Link>)}
            </span>
            {item.moduleId&&<span>
                &nbsp;/&nbsp;
                {item.type==="DELETE_MODULE"?<s>{item.moduleName}</s>:
                (<Link to={`project/${item.projectId}?moduleId=${item.moduleId}`}>
                  {item.moduleName}
                </Link>)}
              </span>
            }
            {item.interfaseId&&<span>
              &nbsp;/&nbsp;
              {item.type==="DELETE_INTERFASE"?<s>{item.interfaseName}</s>:
              (<Link to={`project/${item.projectId}?moduleId=${item.moduleId}&interfaseId=${item.interfaseId}`}>
                {item.interfaseName}
              </Link>)}
            </span>}
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
    )
  }
}

export default Layout
