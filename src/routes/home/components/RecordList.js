import React from "react";
import {message,Modal,Button,List,Icon} from 'antd';
import { Link  } from 'react-router-dom'
import Style from "./RecordList.less";
import {inject, observer} from 'mobx-react';
import {recordType} from "@/filters"

@inject("home")
@observer
class Layout extends React.Component {


  render(){
    return (
      <List
        className={Style.list}
        bordered
        itemLayout="horizontal"
        dataSource={this.props.home.recordList}
        renderItem={item => (
          <List.Item actions={[<span className={Style.header}>16小时前</span>]}>
            <Link to="/project">{item.creator}</Link> &nbsp;{recordType(item.type)}&nbsp;
            <span>
              <Link to={`project/${item.projectId}`}>
                {item.projectName}
              </Link>
            </span>
            {item.moduleId&&<span>
                &nbsp;/&nbsp;
                <Link to={`project/${item.projectId}?moduleId=${item.moduleId}`}>
                  {item.moduleName}
                </Link>
              </span>
            }
            {item.interfaseId&&<span>
              &nbsp;/&nbsp;
              <Link to={`project/${item.projectId}?moduleId=${item.moduleId}&interfaseId=${item.interfaseId}`}>
                {item.interfaseName}
              </Link>
            </span>}
          </List.Item>
        )}
      />
    )
  }
}

export default Layout
