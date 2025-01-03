import { IconCaretRight, IconInfoCircle } from "@tabler/icons-react";

const listData = [
  {
    text: "Go to the Google Maps",
    link: "https://www.google.com/maps",
  },
  { text: "Search for the place you want to scrape" },
  { text: "Click on the share button" },
  { text: "Click on the copy link button" },
  { text: "Paste the link in the input field" },
];

function ScrapHelper() {
  return (
    <>
      <div className="d-flex align-items-center">
        <IconInfoCircle size={24} className="me-2" />
        <h6 className="m-0">How to get the Google Maps URL</h6>
      </div>
      <ul className="list-unstyled small mb-0">
        {listData.map(({ text, link }, index) => (
          <li key={index} className="d-flex align-items-center mb-2">
            <IconCaretRight size={16} className="me-2" />
            {link ? (
              <a href={link} target="_blank" rel="noopener noreferrer">
                {text}
              </a>
            ) : (
              text
            )}
          </li>
        ))}
      </ul>
      <iframe
        className="w-100 rounded"
        height="200"
        src="https://www.youtube.com/embed/TMjezeeGVfY?si=j9XaBxKYwdfBdcdv"
        title="YouTube video player"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>
    </>
  );
}

export default ScrapHelper;
