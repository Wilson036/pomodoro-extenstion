import { Button, Form, InputNumber, Space, Typography } from 'antd';

const { Title } = Typography;

function App() {
  const onFinish = (values: { group: number }) => {
    chrome.storage.sync.set(values, () => {
      chrome.runtime.sendMessage({
        type: 'update-group',
        group: values.group,
      });
    });
  };
  return (
    <Space direction="vertical" size={16}>
      <Title>番茄鐘設定</Title>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="番茄鐘組數" name="group">
          <InputNumber min={1} max={10} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            設定
          </Button>
        </Form.Item>
      </Form>
    </Space>
  );
}

export default App;
