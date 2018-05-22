import React from "react";
import {message,Modal,Button,List,Icon} from 'antd';
import { Link  } from 'react-router-dom'
import Style from "./RecordList.less";
import {inject, observer} from 'mobx-react';
import {recordType,parseDate} from "@/filters"

@inject("home")
@observer
class Layout extends React.Component {
  formatDate(date){
    let diffdate=Date.now()-new Date(date).getTime();
    if(diffdate<60000){
      return diffdate/1000+"秒前";
    }else if(diffdate<60000*60){
      return parseInt(diffdate/60000)+"分钟前";
    }else if(diffdate<60000*60*24){
      return parseDate(diffdate,"HH小时mm分钟前");
    }else{
      return parseDate(date,"yyyy-MM-dd HH:mm");
    }
  }

  render(){
    return (
      <List
        className={Style.list}
        bordered
        itemLayout="horizontal"
        dataSource={this.props.home.recordList}
        renderItem={item => (
          <List.Item actions={[<span className={Style.header}>{this.formatDate(item.createdAt
)}</span>]}>
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
