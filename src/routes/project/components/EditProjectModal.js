import { Modal,Form, Input, Select } from 'antd';
import React from 'react'
import {inject, observer} from 'mobx-react';





const Option=Select.Option;
const FormItem=Form.Item;
const TextArea=Input.TextArea
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};

@inject("user")
@inject("project")
@observer
class EditProjectModal extends React.Component {

  componentDidMount(){
    if(this.props.user.userList.length===0){
      this.props.user.getUserList()
    }

  }

  componentWillReceiveProps(nextProps){
    if(nextProps.visible&&nextProps.visible!==this.props.visible){
      this.props.form.setFieldsValue({
        name: this.props.project.info.name,
        admin: this.props.project.info.admin.id,
        developers: this.props.project.info.developers.toJS().map(item=>item.id),
        guests: this.props.project.info.guests.toJS().map(item=>item.id),
        reporters: this.props.project.info.reporters.toJS().map(item=>item.id),
        proxy: this.props.project.info.proxy,
        description: this.props.project.info.description
      })
    }
  }

  handleOk = (e) => {
    this.props.form.validateFields((err, values) => {
      if (err) {
        return
      }

      this.props.onOk(values);
      this.props.form.resetFields()
      this.props.onClose();
    });
  }
  handleCancel = (e) => {
    this.props.form.resetFields()
    this.props.onClose();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Modal maskClosable={false}
          width={640}
          title="编辑项目"
          visible={this.props.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form>
            <FormItem
              {...formItemLayout}
              label="项目名称"
            >
              {getFieldDecorator('name', {
                rules: [{
                  required: true, message: '必填',
                }],
              })(
                <Input  disabled={this.props.project.info.permission<3} />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="管理员"
            >
              {getFieldDecorator('admin', {
                initialValue: ''
              })(
                <Select
                  disabled
                  showSearch
                  optionFilterProp=""
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {this.props.user.userList.map(user=>(
                    <Option key={user.id} value={user.id}>{user.name}</Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="开发者"
            >
              {getFieldDecorator('developers', {
                initialValue: []
              })(
                <Select
                  showSearch
                  disabled={this.props.project.info.permission<3}
                  mode="multiple"
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {this.props.user.userList.map(user=>(
                    <Option key={user.id} value={user.id}>{user.name}</Option>
                  ))}
                </Select>
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="使用者"
            >
              {getFieldDecorator('reporters', {
                initialValue: []
              })(
                <Select
                  showSearch
                  disabled={this.props.project.info.permission<3}
                  mode="multiple"
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {this.props.user.userList.map(user=>(
                    <Option key={user.id} value={user.id}>{user.name}</Option>
                  ))}
                </Select>
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="游客"
            >
              {getFieldDecorator('guests', {
                initialValue: []
              })(
                <Select
                  showSearch
                  disabled={this.props.project.info.permission<3}
                  mode="multiple"
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {this.props.user.userList.map(user=>(
                    <Option key={user.id} value={user.id}>{user.name}</Option>
                  ))}
                </Select>
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="代理地址"
            >
              {getFieldDecorator('proxy', {
                initialValue: ''
              })(
                <Input />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="简介"
            >
              {getFieldDecorator('description', {
                initialValue: ''
              })(
                <TextArea />
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(EditProjectModal);
