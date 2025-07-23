import { Button, Form, InputNumber, Space, Typography } from "antd";
const { Title } = Typography;

const Settings = ({ onToggleSettings }: { onToggleSettings: () => void }) => {
  const [form] = Form.useForm();
  return (
    <>
      <Title level={2}>設定</Title>
      <Form form={form} layout="vertical">
        <Form.List name="timeSettings">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field) => (
                <Form.Item
                  key={field.key}
                  label="時間"
                  name={[field.name, "time"]}
                >
                  <TimeSetting />
                </Form.Item>
              ))}
              <Form.Item>
                <Button type="primary" onClick={() => add({ time: 0 })}>
                  新增
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item>
          <Button type="primary" onClick={onToggleSettings}>
            返回
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default Settings;

const TimeSetting = ({
  value,
  onChange,
}: {
  value?: { minutes: number; seconds: number };
  onChange?: (value: { minutes: number; seconds: number }) => void;
}) => {
  const { minutes, seconds } = value ?? { minutes: 0, seconds: 0 };
  return (
    <Space>
      <InputNumber
        value={minutes}
        onChange={(value) => onChange?.({ minutes: value ?? 0, seconds })}
        changeOnWheel
        controls
        step={1}
        min={0}
        max={59}
      />
      <InputNumber
        value={seconds}
        onChange={(value) => onChange?.({ minutes, seconds: value ?? 0 })}
        changeOnWheel
        controls
        step={1}
        min={0}
        max={59}
      />
    </Space>
  );
};
