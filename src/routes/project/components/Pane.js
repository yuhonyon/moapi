import React from "react";
import Style from "./Pane.less";
import {Icon} from "antd"
import {withRouter} from "react-router-dom";
import {parseDate} from "@/filters"


class Pane extends React.Component {
  handleClick=()=>{
    this.props.history.push("/editor/"+this.props.project.id);
  }
  handleDelete=(e)=>{
    e.preventDefault();
    this.props.onDelete(this.props.project.id)
  }
  render(){
    return (
      <div className={Style.wrapper}>
        <h3 onClick={this.handleClick} >{this.props.project.name}</h3>
        <p>创建人:{this.props.project.admin.name}</p>
        <p>创建时间:{parseDate(this.props.project.createdAt)}</p>
        <p>上次更新时间:{parseDate(this.props.project.updatedAt)}</p>
        <p>当前版本:{this.props.project.version}</p>
        <div>{this.props.self&&<Icon onClick={this.handleDelete} type="delete"></Icon>}</div>
      </div>
    )
  }
}

export default withRouter(Pane)
