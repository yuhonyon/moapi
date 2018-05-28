import React from "react";
import Style from "./Pane.less";
import {Icon,Tooltip} from "antd"
import {withRouter} from "react-router-dom";
import {parseDate} from "@/filters"
import config from "@/config"


class Pane extends React.Component {
  handleClick=()=>{
    this.props.history.push("/project/"+this.props.project.id);
  }
  handleDelete=(e)=>{
    e.preventDefault();
    this.props.onDelete(this.props.project.id)
  }
  handleUpdate=(e)=>{
    e.preventDefault();
    this.props.onUpdate(this.props.project.id)
  }
  onMockUrl=(e)=>{
    e.preventDefault();
    this.props.onMockUrl(`${config.baseURL}project/mock/${this.props.project.id}/`)
  }
  render(){
    return (
      <div className={Style.wrapper}>
        <h3 onClick={this.handleClick} >{this.props.project.name}</h3>
        <p>管理员:{this.props.project.admin.name}</p>
        <p>当前版本:{this.props.project.version}</p>
        <p>创建时间:{parseDate(this.props.project.createdAt)}</p>
        <p>更新时间:{parseDate(this.props.project.updatedAt)}</p>
        <div className={Style.btnBox}>
          <Tooltip title="在线mock地址">
            <Icon onClick={this.onMockUrl} type="cloud-o"></Icon>
          </Tooltip>
          <Tooltip title="文档地址">
            <a target="_blank" href={`${config.baseURL}project/doc/${this.props.project.id}/`}>
              <Icon type="file-text"></Icon>
            </a>
          </Tooltip>
          {
          this.props.editable&&<Tooltip title="编辑">
            <Icon onClick={this.handleUpdate} type="form"></Icon>
          </Tooltip>}
          {
          this.props.self&&<Tooltip title="删除">
            <Icon onClick={this.handleDelete} type="delete"></Icon>
          </Tooltip>}

        </div>
      </div>
    )
  }
}

export default withRouter(Pane)
