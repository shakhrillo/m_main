import { useState, useEffect } from "react";
import { filter } from "rxjs";
import { settingValue } from "../services/settingService";
import LogoImg from "../assets/logo_scrappio.png";

/**
 * Logo component.
 * @param props React.ImgHTMLAttributes<HTMLImageElement>
 * @returns JSX.Element
 */
export const Logo = (
  props: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
) => {
  const [logo, setLogo] = useState<string>(LogoImg);

  useEffect(() => {
    const subscription = settingValue({ tag: "logo", type: "general" })
      .pipe(filter((data) => Boolean(data?.value)))
      .subscribe(({ value }) => setLogo(value));

    return () => subscription.unsubscribe();
  }, []);

  return <img src={logo} alt="Logo" height={30} {...props} />;
};
