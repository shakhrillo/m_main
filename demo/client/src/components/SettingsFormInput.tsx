import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { settingValue, updateSettingValue } from "../services/settingService";
import { filter, take } from "rxjs";

interface ISettingsFormInput {
  tag: string;
  type: string;
  label: string;
  helpText: string;
  inputType: string;
}

/**
 * Settings form input component
 * @param tag - Setting tag
 * @param type - Setting type
 * @param label - Input label
 * @param helpText - Help text
 * @param inputType - Input type
 * @returns Settings form input component
 */
export const SettingsFormInput = ({
  tag,
  type,
  label,
  helpText,
  inputType = "text",
}: ISettingsFormInput) => {
  const [info, setInfo] = useState(null as any);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (!tag || !type) return;

    const subscription = settingValue({ tag, type })
      .pipe(
        filter((data) => !!data),
        take(1),
      )
      .subscribe((data) => {
        setInfo(data);
        setInputValue(data.value);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [tag, type]);

  useEffect(() => {
    if (!info || !info.id) return;
    
    // Need to uncomment it
    // updateSettingValue(info.id, { value: inputValue });
  }, [inputValue, info]);

  return info ? (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      {inputType === "textarea" ? (
        <Form.Control
          as="textarea"
          rows={3}
          defaultValue={info.value}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={true}
        />
      ) : (
        <Form.Control
          type="text"
          defaultValue={info.value}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={true}
        />
      )}
      <Form.Text className="text-muted">{helpText}</Form.Text>
    </Form.Group>
  ) : (
    "Loading..."
  );
};
