import { use, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { settingValue, updateSettingValue } from "../services/settingService";

export const SettingsFormInput = ({
  tag,
  type,
  label,
  helpText,
}: {
  tag: string;
  type: string;
  label: string;
  helpText: string;
}) => {
  const [info, setInfo] = useState({} as any);

  useEffect(() => {
    const settings$ = settingValue({ tag, type }).subscribe((data) => {
      if (data) {
        setInfo(data);
      }
    });

    return () => {
      settings$.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!info || !info.id) return;
    console.log("info", info);
    updateSettingValue(info.id, { value: info.value });
  }, [info]);

  return (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type="text"
        value={info.value}
        onChange={(e) => setInfo({ ...info, value: e.target.value })}
      />
      <Form.Text className="text-muted">{helpText}</Form.Text>
    </Form.Group>
  );
};
