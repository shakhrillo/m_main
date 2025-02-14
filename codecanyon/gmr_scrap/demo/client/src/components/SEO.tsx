import { useState, useEffect } from "react";
import { filter } from "rxjs";
import { settingValue } from "../services/settingService";
import { Helmet } from "react-helmet";

/**
 * SEO component.
 * @returns JSX.Element
 */
export const SEO = () => {
    const [title, setTitle] = useState<string | null>(null);

    useEffect(() => {
        const subscription = settingValue({ tag: "title", type: "general" })
            .pipe(filter((data) => !!data?.value))
            .subscribe(({ value }) => {
                console.log(value);
                setTitle(value)
            });

        return () => subscription.unsubscribe();
    }, []);

    return <Helmet>
        <title>{ title }</title>
        <meta name="description" content="This is a dynamic page." />
    </Helmet>
};
