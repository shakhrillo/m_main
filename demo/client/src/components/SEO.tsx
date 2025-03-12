import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { filter } from "rxjs";
import { settingValue } from "../services/settingService";

/**
 * SEO component.
 * @returns JSX.Element
 */
export const SEO = () => {
  const [meta, setMeta] = useState({
    title: "",
    keywords: "",
    description: "",
  });

  useEffect(() => {
    const tags = ["title", "keywords", "description"];
    const subscriptions = tags.map((tag) =>
      settingValue({ tag, type: "general" })
        .pipe(filter((data) => !!data?.value))
        .subscribe(({ value }) =>
          setMeta((prev) => ({ ...prev, [tag]: value })),
        ),
    );
    return () => subscriptions.forEach((sub) => sub.unsubscribe());
  }, []);

  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta charSet="utf-8" />
      <meta name="keywords" content={meta.keywords} />
      <meta name="description" content={meta.description} />
    </Helmet>
  );
};
