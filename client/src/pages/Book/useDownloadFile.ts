import { AxiosResponse } from "axios";
import { useRef, useState } from "react";

interface DownloadFileProps {
  readonly apiDefinition: () => Promise<AxiosResponse<Blob>>;
  readonly onError: () => void;
  readonly getFileName: () => string;
}

interface DownloadedFileInfo {
  readonly download: () => Promise<void>;
  readonly ref: React.MutableRefObject<HTMLAnchorElement | null>;
  readonly name: string | undefined;
  readonly url: string | undefined;
}

export const useDownloadFile = ({
  apiDefinition,
  onError,
  getFileName,
}: DownloadFileProps): DownloadedFileInfo => {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const [url, setFileUrl] = useState<string>();
  const [name, setFileName] = useState<string>();

  const download = async () => {
    try {
      const { data } = await apiDefinition();
      const url = URL.createObjectURL(new Blob([data]));
      setFileUrl(url);
      setFileName(getFileName());
      ref.current?.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      onError();
    }
  };

  return { download, ref, url, name };
};
