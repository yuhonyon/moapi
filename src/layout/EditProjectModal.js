import { Modal,Form, Input, Select } from 'antd';
import React from 'react'
import {inject, observer} from 'mobx-react';
import intl from "react-intl-universal";




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
      //this.props.user.getUserList()
    }

  }

  componentWillReceiveProps(nextProps){
    if(nextProps.visible&&nextProps.visible!==this.props.visible){
      this.props.form.setFieldsValue({
        proxy: this.props.project.data.proxy,
        name: this.props.project.data.name,
        description: this.props.project.data.description
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
          title={intl.get('header.setModal.title')}
          visible={this.props.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form>
            <FormItem
              {...formItemLayout}
              label={intl.get('header.setModal.name')}
            >
              {getFieldDecorator('name', {
                initialValue: '',
                rules: [{
                  required: true, message: intl.get('required'),
                }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={intl.get('header.setModal.proxy')}
            >
              {getFieldDecorator('proxy', {
                initialValue: ''
              })(
                <Input />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label={intl.get('header.setModal.description')}
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
