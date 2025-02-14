import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { filter } from "rxjs";
import { settingValue } from "../services/settingService";

/**
 * SEO component.
 * @returns JSX.Element
 */
export const SEO = () => {
    const [title, setTitle] = useState<string | null>(null);
    const [keywords, setKeywords] = useState<string | null>(null);
    const [description, setDescription] = useState<string | null>(null);

    useEffect(() => {
        const subscription = settingValue({ tag: "title", type: "general" })
            .pipe(filter((data) => !!data?.value))
            .subscribe(({ value }) => setTitle(value));

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        const subscription = settingValue({ tag: "keywords", type: "general" })
            .pipe(filter((data) => !!data?.value))
            .subscribe(({ value }) => setKeywords(value));

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        const subscription = settingValue({ tag: "description", type: "general" })
            .pipe(filter((data) => !!data?.value))
            .subscribe(({ value }) => setDescription(value));

        return () => subscription.unsubscribe();
    }, []);

    return <Helmet>
        <title>{ title }</title>
        <meta charSet="utf-8" />
        <meta name="keywords" content={ keywords || "" } />
        <meta name="description" content={ description || "" } />
    </Helmet>
};
