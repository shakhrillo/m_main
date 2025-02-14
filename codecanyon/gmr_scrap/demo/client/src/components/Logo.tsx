import { useState, useEffect } from "react";
import { filter } from "rxjs";
import { settingValue } from "../services/settingService";

/**
 * Logo component.
 * @param props React.ImgHTMLAttributes<HTMLImageElement>
 * @returns JSX.Element
 */
export const Logo = (
    props: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
) => {
    const [logo, setLogo] = useState<string | null>(null);

    useEffect(() => {
        const subscription = settingValue({ tag: "logo", type: "general" })
            .pipe(filter((data) => !!data?.value))
            .subscribe(({ value }) => setLogo(value));

        return () => subscription.unsubscribe();
    }, []);

    return logo ? <img src={logo} alt="Logo" height={30} {...props} /> : 'Scrappio';
};
