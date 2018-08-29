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
class EditRemarkModal extends React.Component {

  componentWillReceiveProps(nextProps){
    if(nextProps.visible&&nextProps.visible!==this.props.visible){
      this.props.form.setFieldsValue({
        version:nextProps.info.version,
        message:nextProps.info.message
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
          title="编辑备注"
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
                initialValue: '',
                rules: [{
                  required: true, message: '必填',
                }],
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

export default Form.create()(EditRemarkModal);
