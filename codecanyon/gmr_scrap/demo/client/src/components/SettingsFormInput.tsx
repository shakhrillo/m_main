import { use, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { settingValue, updateSettingValue } from "../services/settingService";
import { filter, take } from "rxjs";

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
  const [info, setInfo] = useState(null as any);

  useEffect(() => {
    if (!tag || !type) return;
    console.log("tag", tag);
    console.log("type", type);

    const subscription = settingValue({ tag, type })
      .pipe(
        filter((data) => !!data),
        take(1),
      )
      .subscribe((data) => {
        console.log(data);
        setInfo(data);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [tag, type, setInfo]);

  useEffect(() => {
    if (!info || !info.id) return;

    updateSettingValue(info.id, { value: info.value });
  }, [info]);

  return info ? (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type="text"
        value={info.value}
        onChange={(e) => setInfo({ ...info, value: e.target.value })}
      />
      <Form.Text className="text-muted">{helpText}</Form.Text>
    </Form.Group>
  ) : (
    "Loading..."
  );
};
