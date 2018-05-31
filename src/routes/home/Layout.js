import React from "react";
import { Row,Col } from 'antd';
import Style from "./Layout.less";
import {inject, observer} from 'mobx-react';
import WatchList from "./components/WatchList";
import RecordList from "./components/RecordList";

@inject("home")
@observer
class Layout extends React.Component {

  componentDidMount(){
    if(this.props.home.watchProjectList.length===0){
      this.props.home.getWatchProjectList()
    }else{
      this.props.home.getRecordList()
    }

  }

  render(){
    return (
      <div className={Style.wrapper}>
        <Row gutter={16}>
          <Col className="gutter-row" span={16}>
            <RecordList></RecordList>
          </Col>
          <Col className="gutter-row" span={8}>
            <WatchList></WatchList>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Layout
