import { Modal,Form, Input,Select } from 'antd';
import React from 'react'
import {inject, observer} from 'mobx-react';
const FormItem=Form.Item;
const TextArea=Input.TextArea
const Option=Select.Option;

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

@inject("interfases")
@observer
class AddRemarkModal extends React.Component {

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
          title="添加备注"
          visible={this.props.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form>
            <FormItem
              {...formItemLayout}
              label="版本"
            >
              {getFieldDecorator('version', {
                initialValue: this.props.interfases.curVersion||this.props.interfases.data.versions[this.props.interfases.data.versions.length-1],
                rules: [{
                  required: true, message: '必填',
                }],
              })(
                <Select >
                  {
                    this.props.interfases.data.versions.map(item=>(
                      <Option key={item} value={item}>{item}</Option>
                    ))
                  }
                </Select>
              )}
            </FormItem>


            <FormItem
              {...formItemLayout}
              label="备注"
            >
              {getFieldDecorator('message', {
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

export default Form.create()(AddRemarkModal);
