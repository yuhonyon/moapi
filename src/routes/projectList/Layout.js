import React from 'react'
import { Tabs, Button, message, Modal, Select } from 'antd'
import Style from './Layout.less'
import { inject, observer } from 'mobx-react'
import Pane from './components/Pane'
import AddProjectModal from './components/AddProjectModal'
import EditProjectModal from './../project/components/EditProjectModal'
import fetchApi from '../../api'
const TabPane = Tabs.TabPane
const Option = Select.Option

@inject('projectList', 'project', 'doc')
@observer
class Layout extends React.Component {
  state = {
    addProjectModalShow: false,
    editProjectModalShow: false,
    interfaseList: [],
    tabsKey: 'all'
  }
  componentDidMount() {
    this.fetchProjectList()
  }
  openEditProjectModal = projectId => {
    this.props.project.getProjectInfo(projectId).then(() => {
      this.setState({ editProjectModalShow: true })
    })
  }
  handleUpdateProjectOk = info => {
    this.props.project
      .updateProject(this.props.project.info.id, info)
      .then(() => {
        this.fetchProjectList()
      })
  }
  closeEditProjectModal = () => {
    this.setState({ editProjectModalShow: false })
  }
  handleChange = key => {
    this.setState({ tabsKey: key }, () => {
      this.fetchProjectList()
    })
  }

  handleDeleteDoc = docId => {
    Modal.confirm({
      title: '警告',
      content: '确认要删除该文档吗',
      onOk: () => {
        this.props.doc.deleteDoc(docId).then(() => {
          message.success('删除成功')
          this.fetchProjectList()
        })
      }
    })
  }

  fetchProjectList() {
    if (this.state.tabsKey === 'self') {
      this.props.projectList.getSelfProjectList()
    } else if (this.state.tabsKey === 'relate') {
      this.props.projectList.getRelateProjectList()
    } else if (this.state.tabsKey === 'all') {
      this.props.projectList.getProjectList()
    } else if (this.state.tabsKey === 'develop') {
      this.props.projectList.getDevelopProjectList()
    }
  }

  handleAddProject = () => {
    this.setState({ addProjectModalShow: true })
  }

  handleAddProjectOk = info => {
    info.proxys = [info.proxy]
    this.props.projectList.addProject(info).then(data => {
      message.success('添加成功')
      this.props.history.push('/project/' + data.id)
    })
  }
  handleAddProjectClose = () => {
    this.setState({ addProjectModalShow: false })
  }
  handleShowMockUrl = url => {
    Modal.info({
      title: '在线mock地址',
      content: url + ' + 接口url'
    })
  }
  handleDeleteProject = projectId => {
    Modal.confirm({
      title: '警告',
      content: '确认要删除项目吗',
      onOk: () => {
        this.props.projectList.delProject(projectId).then(() => {
          message.success('删除成功')
          this.props.projectList.getSelfProjectList()
        })
      }
    })
  }

  handleSearch = value => {
    this.props.history.push('/project/' + value)
  }

  handleSearchInterfase = text => {
    fetchApi.fetchSearchInterfase(text).then(data => {
      this.setState({ interfaseList: data })
    })
  }

  render() {
    return (
      <div>
        <EditProjectModal
          onOk={this.handleUpdateProjectOk}
          onClose={this.closeEditProjectModal}
          visible={this.state.editProjectModalShow}
        />
        <AddProjectModal
          onOk={this.handleAddProjectOk}
          onClose={this.handleAddProjectClose}
          visible={this.state.addProjectModalShow}
        />
        <Tabs
          activeKey={this.state.tabsKey}
          onChange={this.handleChange}
          tabBarExtraContent={
            <Button onClick={this.handleAddProject}>添加项目</Button>
          }
        >
          <TabPane tab="所有项目" key="all">
            <div>
              <Select
                showSearch
                style={{ width: 300 }}
                placeholder="输入项目名快速查找项目"
                optionFilterProp="children"
                onChange={this.handleSearch}
                filterOption={(input, option) => {
                  return (
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  )
                }}
              >
                {this.props.projectList.all.map(item => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
              &emsp;
              <Select
                showSearch
                style={{ width: 300 }}
                placeholder="输入url或者接口名称快速查找接口"
                onChange={(e, option) => {
                  this.props.history.push(
                    `project/${option.props.projectid}?moduleId=${
                      option.props.moduleid
                    }&interfaseId=${option.props.interfaseid}`
                  )
                }}
                onSearch={this.handleSearchInterfase}
                filterOption={(input, option) => {
                  return (
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0 ||
                    option.props.value
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  )
                }}
              >
                {this.state.interfaseList.map(item => (
                  <Option
                    moduleid={item.moduleId}
                    interfaseid={item.id}
                    projectid={item.projectId}
                    key={item.id}
                    value={item.url + item.id}
                  >
                    {item.name}
                  </Option>
                ))}
              </Select>
              <br />
              <br />
            </div>
            {this.props.projectList.all.map(project => (
              <Pane
                onMockUrl={this.handleShowMockUrl}
                key={project.id}
                project={project}
              />
            ))}
            {this.props.projectList.all.length === 0 && (
              <div className={Style.noDataNote}>暂无项目</div>
            )}
          </TabPane>
          <TabPane tab="我的项目" key="self">
            {this.props.projectList.self.map(project => (
              <Pane
                onMockUrl={this.handleShowMockUrl}
                onDelete={this.handleDeleteProject}
                onUpdate={this.openEditProjectModal}
                onDeleteDoc={this.handleDeleteDoc}
                self
                editable
                key={project.id}
                project={project}
              />
            ))}
            {this.props.projectList.self.length === 0 && (
              <div className={Style.noDataNote}>暂无项目</div>
            )}
          </TabPane>
          <TabPane tab="参与项目" key="develop">
            {this.props.projectList.develop.map(project => (
              <Pane
                onMockUrl={this.handleShowMockUrl}
                onDeleteDoc={this.handleDeleteDoc}
                onUpdate={this.openEditProjectModal}
                editable
                key={project.id}
                project={project}
              />
            ))}
            {this.props.projectList.develop.length === 0 && (
              <div className={Style.noDataNote}>暂无项目</div>
            )}
          </TabPane>
          <TabPane tab="相关项目" key="relate">
            {this.props.projectList.relate.map(project => (
              <Pane
                onMockUrl={this.handleShowMockUrl}
                key={project.id}
                project={project}
              />
            ))}
            {this.props.projectList.relate.length === 0 && (
              <div className={Style.noDataNote}>暂无项目</div>
            )}
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

export default Layout
