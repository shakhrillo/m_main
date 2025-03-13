import { JSX, useCallback, useEffect, useState } from "react";
import { Carousel, Image } from "react-bootstrap";
import { dockerContainerScreenshots } from "../../services/dockerService";
import { Timestamp } from "firebase/firestore";

interface IContainerScreenshots {
  containerId?: string;
}

export const ContainerScreenshots = ({
  containerId,
}: IContainerScreenshots): JSX.Element => {
  const [screenshots, setScreenshots] = useState<
    {
      id: string;
      url: string;
      createdAt: Timestamp;
    }[]
  >([]);

  const fetchScreenshots = useCallback(() => {
    if (!containerId) return;

    const subscription = dockerContainerScreenshots(containerId).subscribe({
      next: (data = []) => {
        setScreenshots(data);
      },
      error: (error) => console.error("Error fetching logs:", error),
    });

    return () => subscription.unsubscribe();
  }, [containerId]);

  useEffect(fetchScreenshots, [fetchScreenshots]);

  return (
    <Carousel className="container-screenshots" style={{ width: "100%" }}>
      {screenshots?.map((screenshot, index) => (
        <Carousel.Item key={index} className="container-screenshot">
          <Image
            src={screenshot?.url}
            alt={`Screenshot ${index}`}
            style={{ width: "100%" }}
          />
        </Carousel.Item>
      ))}
    </Carousel>
  );
};
