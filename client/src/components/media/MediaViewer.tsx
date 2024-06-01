import { Loader, Utensils } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { getImages } from "@/lib/getImages";

type MediaViewerProps = {
  id: string;
  imageFill?: "object-cover" | "object-contain";
  showLoader?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

const MediaViewer = ({
  id,
  imageFill,
  showLoader = true,
  ...rest
}: MediaViewerProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const response = await getImages(id);
      const data = response.imageUrl;
      setImageUrl(data);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div {...rest}>
      {isLoading ? (
        <div className="flex h-full items-center justify-center">
          {showLoader ? <Loader className="animate-spin" size={24} /> : null}
        </div>
      ) : imageUrl ? (
        <img
          src={imageUrl || ""}
          alt={imageUrl || "Preview"}
          className={cn("h-full w-full rounded-md object-contain", imageFill)}
        />
      ) : (
        <Utensils size={18} />
      )}
    </div>
  );
};

export default MediaViewer;
