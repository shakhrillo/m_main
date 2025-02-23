import { useState, useEffect } from "react";
import { filter } from "rxjs";
import { settingValue } from "../services/settingService";
import FIcon from "react-favicon";

/**
 * Favicon component.
 * @returns JSX.Element
 */
export const Favicon = () => {
  const [favicon, setFavicon] = useState<string | null>(null);

  useEffect(() => {
    const subscription = settingValue({ tag: "favicon", type: "general" })
      .pipe(filter((data) => !!data?.value))
      .subscribe(({ value }) => setFavicon(value));

    return () => subscription.unsubscribe();
  }, []);

  return favicon && <FIcon url={favicon} />
};
