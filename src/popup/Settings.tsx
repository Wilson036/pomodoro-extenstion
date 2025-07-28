import { Button, Card, Form, InputNumber, Space, Typography, Collapse } from "antd";
import { useRef, useState } from "react";
const { Title } = Typography;

const Settings = ({ onToggleSettings }: { onToggleSettings: () => void }) => {
  const [form] = Form.useForm();
  const [activeKey, setActiveKey] = useState<string[]>(['0']);
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <Card
      style={{
        background: "#fff",
        borderRadius: "8px",
        textAlign: "center",
        padding: "12px",
      }}
    >
      <Title level={2}>設定</Title>
      <Form
        form={form}
        
      >
        <Form.List name="timeSettings">
          {(fields, { add, remove }) => (
            <>
              <div
                style={{
                  maxHeight: 248,
                  overflowY: "auto",
                  marginBottom: 12,
                }}
                ref={containerRef}
              >
                {fields.map((field, index) => (
                  <Collapse 
                    key={field.key}
                    defaultActiveKey={['1']} 
                    size="small"
                    style={{ borderRadius: 0 }}
                    activeKey={activeKey}
                    onChange={(key) => {
                      const keys = Array.isArray(key) ? key : key ? [key] : [];
                      setActiveKey(keys);
                    }}
                  >
                    <Collapse.Panel 
                      header={`Cycle ${index + 1}`} 
                      key={index}
                    >
                      <Form.Item
                        name={[field.name, "time"]}
                        style={{ marginBottom: 12 }}
                      >
                        <TimeSetting label="專注時間" />
                      </Form.Item>
                      <Form.Item
                        name={[field.name, "breakTime"]}
                      >
                        <TimeSetting label="休息時間" />
                      </Form.Item>
                      <Button 
                        type="link" 
                        danger 
                        onClick={() => remove(field.name)}
                        style={{ marginTop: 8 }}
                      >
                        刪除
                      </Button>
                    </Collapse.Panel>
                  </Collapse>
                ))}
              </div>
              <Form.Item>
                <Space>
                  <Button type="primary" onClick={() => {
                    add({ time: 0 });
                    setActiveKey([fields.length.toString()]);
                    setTimeout(() => {
                      containerRef.current?.scrollTo({
                        top: containerRef.current?.scrollHeight,
                        behavior: "smooth",
                      });
                    }, 100);
                  }}>
                    新增
                  </Button>
                  <Button type="primary" onClick={() => {
                    console.log('form.getFieldsValue()', form.getFieldsValue());
                  }}>
                    設定
                  </Button>
                </Space>
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
    </Card>
  );
};

export default Settings;

const TimeSetting = ({
  value,
  onChange,
  label,
}: {
  value?: { minutes: number; seconds: number };
  onChange?: (value: { minutes: number; seconds: number }) => void;
  label: string;
}) => {
  const { minutes, seconds } = value ?? { minutes: 0, seconds: 0 };
  return (
    <Space style={{ width: "100%" }}>
      <Typography.Text>{label}</Typography.Text>
      <InputNumber
        value={minutes}
        onChange={(value) => onChange?.({ minutes: value ?? 0, seconds })}
        changeOnWheel
        controls
        step={1}
        min={0}
        max={59}
        style={{ width: 50 }}
      />
      <InputNumber
        value={seconds}
        onChange={(value) => onChange?.({ minutes, seconds: value ?? 0 })}
        changeOnWheel
        controls
        step={1}
        min={0}
        max={59}
        style={{ width: 50 }}
      />
    </Space>
  );
};
