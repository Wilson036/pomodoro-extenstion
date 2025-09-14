import { useSettingsInitializer } from '@/hooks/useSettingsInitializer';
import { saveSettings } from '@/utils/settingsStorage';
import {
  Button,
  Card,
  Form,
  InputNumber,
  Space,
  Typography,
  Collapse,
  Spin,
} from 'antd';
import { useEffect, useRef, useState } from 'react';
const { Title } = Typography;

const DEFAULT_CYCLE = [
  {
    focusTime: {
      minutes: 0,
      seconds: 0,
    },
    breakTime: {
      minutes: 0,
      seconds: 0,
    },
  },
];

const Settings = ({ onToggleSettings }: { onToggleSettings: () => void }) => {
  const [form] = Form.useForm();
  const [activeKey, setActiveKey] = useState<string[]>(['0']);
  const containerRef = useRef<HTMLDivElement>(null);
  const { settings, isLoading } = useSettingsInitializer();
  useEffect(() => {
    if (settings.length > 0) {
      form.setFieldsValue({ timeSettings: settings });
    }
  }, [settings, form]);
  return (
    <Spin spinning={isLoading}>
      <Card
        style={{
          background: '#fff',
          borderRadius: '8px',
          textAlign: 'center',
          padding: '12px',
        }}
      >
        <Title level={2}>設定</Title>
        <Form
          form={form}
          initialValues={{ timeSettings: DEFAULT_CYCLE }}
          onFinish={({ timeSettings }) => {
            saveSettings(timeSettings);
          }}
        >
          <Form.List name="timeSettings">
            {(fields, { add, remove }) => (
              <>
                <div
                  style={{
                    maxHeight: 248,
                    overflowY: 'auto',
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
                      onChange={key => {
                        const keys = Array.isArray(key)
                          ? key
                          : key
                          ? [key]
                          : [];
                        setActiveKey(keys);

                        // Auto-scroll when expanding panels
                        setTimeout(() => {
                          if (containerRef.current) {
                            const expandedPanels =
                              containerRef.current.querySelectorAll(
                                '.ant-collapse-item-active'
                              );
                            if (expandedPanels.length > 0) {
                              const lastExpandedPanel =
                                expandedPanels[expandedPanels.length - 1];
                              const panelRect =
                                lastExpandedPanel.getBoundingClientRect();
                              const containerRect =
                                containerRef.current.getBoundingClientRect();
                              const scrollTop = containerRef.current.scrollTop;
                              const containerHeight =
                                containerRef.current.clientHeight;
                              const targetScrollTop =
                                scrollTop +
                                (panelRect.bottom - containerRect.top) -
                                containerHeight;

                              containerRef.current.scrollTo({
                                top: Math.max(0, targetScrollTop),
                                behavior: 'smooth',
                              });
                            }
                          }
                        }, 300);
                      }}
                    >
                      <Collapse.Panel
                        header={
                          <div style={{ textAlign: 'center' }}>{`Cycle ${
                            index + 1
                          }`}</div>
                        }
                        key={index}
                      >
                        <Form.Item
                          name={[field.name, 'focusTime']}
                          style={{ marginBottom: 12 }}
                        >
                          <TimeSetting label="專注時間" />
                        </Form.Item>
                        <Form.Item name={[field.name, 'breakTime']}>
                          <TimeSetting label="休息時間" />
                        </Form.Item>
                        <Button
                          type="link"
                          danger
                          onClick={() => {
                            remove(field.name);
                            setActiveKey(prev =>
                              prev.filter(key => key !== field.name.toString())
                            );
                          }}
                          style={{
                            marginTop: 8,
                            display:
                              fields.length === 1 ? 'none' : 'inline-flex',
                          }}
                        >
                          刪除
                        </Button>
                      </Collapse.Panel>
                    </Collapse>
                  ))}
                </div>
                <Form.Item>
                  <Space style={{ width: '100%' }} direction="vertical">
                    <Button
                      onClick={() => {
                        add({ time: 0 });
                        setActiveKey([fields.length.toString()]);
                        setTimeout(() => {
                          containerRef.current?.scrollTo({
                            top: containerRef.current?.scrollHeight,
                            behavior: 'smooth',
                          });
                        }, 100);
                      }}
                      size="large"
                      style={{ width: '100%' }}
                    >
                      新增 Cycle
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      style={{ width: '100%' }}
                    >
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
    </Spin>
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
    <Space style={{ width: '100%' }}>
      <Typography.Text>{label}</Typography.Text>
      <InputNumber
        value={minutes}
        onChange={value => onChange?.({ minutes: value ?? 0, seconds })}
        changeOnWheel
        controls
        step={1}
        min={0}
        max={59}
        style={{ width: 50 }}
      />
      <InputNumber
        value={seconds}
        onChange={value => onChange?.({ minutes, seconds: value ?? 0 })}
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
