import React from "react";
import Style from "./Pane.less";
import {Icon,Tooltip} from "antd"
import {withRouter} from "react-router-dom";
import {formatDate} from "@/filters"
import config from "@/config"
import { Link  } from 'react-router-dom'


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
  handleDeleteDoc=(id)=>{
    this.props.onDeleteDoc(id)
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
        <p>创建时间:{formatDate(this.props.project.createdAt)}</p>
        <p>更新时间:{formatDate(this.props.project.updatedAt)}</p>
        <div className={Style.fileWraper}>其他文档:
           <ul >
            {this.props.project.docs.slice(0,4).map(item=>(
              <li key={item.id}>
                <Tooltip title={item.title}>
                  <a target="_blank" className={Style.docLink} href={`${config.baseURL}doc/preview/${item.id}`}>{item.title}</a>
                </Tooltip>
                &nbsp;

                {(item.type==='md'||item.type==='markedown'||!item.type)?<Link to={`/doc/${item.id}`}><Icon type="form"></Icon></Link>:[<a target="_blank"  href={`${config.baseURL}doc/file/preview/${item.id}`}><Icon type="eye"  /></a>,<a target="_blank" download href={`${config.baseURL}${item.url}`}><Icon type="download" /></a>]}

                <Icon onClick={this.handleDeleteDoc.bind(this,item.id)} type="delete"></Icon>
              </li>
            ))}
           </ul>
           {this.props.project.docs.length>4&&<Link to={`/project/${this.props.project.id}`}>查看更多附件>></Link>}
        </div>
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
