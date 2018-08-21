import { Modal,Form, Input,Upload,Button,Icon } from 'antd';
import React from 'react'
import {inject, observer} from 'mobx-react';
import config from "@/config"
const FormItem=Form.Item;


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

@inject("interfases","user","project")
@observer
class ImportSwaggerModal extends React.Component {

  componentWillReceiveProps(nextProps){
    if(nextProps.visible&&nextProps.visible!==this.props.visible){
      this.props.form.setFieldsValue({
        url: nextProps.project.info.swaggerUrl,
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

  handleChange=()=>{

  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Modal maskClosable={false}
          width={640}
          title="导入Swagger"
          visible={this.props.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText="同步"
        >
          <Form>
            <FormItem
              {...formItemLayout}
              label="在线swagger"
            >
              {getFieldDecorator('url', {
                initialValue:''
              })(
                <Input />
              )}
            </FormItem>


            <FormItem
              {...formItemLayout}
              label="本地swagger文件"
            >
              {getFieldDecorator('message', {
                initialValue: ''
              })(
                <Upload
                  showUploadList={false}
                  onChange={this.handleChange}
                  action={`${config.baseURL}doc/upload?token=${this.props.user.userInfo.accessToken}&projectId=${this.props.project.projectId}`}
                  >
                   <Button>
                     <Icon type="upload" /> 上传
                   </Button>
                 </Upload>
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(ImportSwaggerModal);
