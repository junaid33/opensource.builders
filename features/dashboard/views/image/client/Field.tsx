"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldContainer } from "@/components/ui/field-container";
import { FieldLabel } from "@/components/ui/field-label";
import { FieldDescription } from "@/components/ui/field-description";
import bytes from "bytes";

export const SUPPORTED_IMAGE_EXTENSIONS = ['jpg', 'png', 'webp', 'gif'];

function useObjectURL(fileData?: File) {
  const [objectURL, setObjectURL] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (fileData) {
      const url = URL.createObjectURL(fileData);
      setObjectURL(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [fileData]);
  return objectURL;
}

export interface FieldProps {
  field: { path: string; label: string; description?: string };
  autoFocus?: boolean;
  value: any;
  onChange?: (value: any) => void;
}

export function validateImage({ file, validity }: { file: File; validity: ValidityState }): string | undefined {
  if (!validity.valid) {
    return "Something went wrong, please reload and try again.";
  }
  // check if the file is actually an image
  if (!file.type.includes("image")) {
    return `Sorry, that file type isn't accepted. Please try ${SUPPORTED_IMAGE_EXTENSIONS.reduce(
      (acc, curr, currentIndex) => {
        if (currentIndex === SUPPORTED_IMAGE_EXTENSIONS.length - 1) {
          acc += ` or .${curr}`;
        } else if (currentIndex > 0) {
          acc += `, .${curr}`;
        } else {
          acc += `.${curr}`;
        }
        return acc;
      },
      ""
    )}.`;
  }
  return undefined;
}

export function Field({ autoFocus, field, value, onChange }: FieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  
  const errorMessage = value?.kind === "upload" ? validateImage(value.data) : undefined;
  
  const onUploadChange = ({ currentTarget: { validity, files } }: React.ChangeEvent<HTMLInputElement>) => {
    const file = files?.[0];
    if (!file) return;
    onChange?.({
      kind: "upload",
      data: { file, validity },
      previous: value
    });
  };
  
  const inputKey = useMemo(() => Math.random(), [value]);
  const accept = useMemo(
    () => SUPPORTED_IMAGE_EXTENSIONS.map(ext => [`.${ext}`, `image/${ext}`].join(", ")).join(", "),
    []
  );

  return (
    <FieldContainer>
      <FieldLabel>{field.label}</FieldLabel>
      {field.description && (
        <FieldDescription id={`${field.path}-description`}>
          {field.description}
        </FieldDescription>
      )}
      <ImgView
        errorMessage={errorMessage}
        value={value || { kind: "empty" }}
        onChange={onChange}
        field={field}
        onClickUpload={() => inputRef.current?.click()}
      />
      <Input
        className="hidden"
        autoComplete="off"
        autoFocus={autoFocus}
        ref={inputRef}
        key={inputKey}
        name={field.path}
        onChange={onUploadChange}
        type="file"
        accept={accept}
        aria-describedby={field.description ? `${field.path}-description` : undefined}
        disabled={onChange === undefined}
      />
      {errorMessage && (
        <span className="block mt-2 text-red-500">
          {errorMessage}
        </span>
      )}
    </FieldContainer>
  );
}

interface ImgViewProps {
  errorMessage?: string;
  value: any;
  onChange?: (value: any) => void;
  field: { path: string; label: string };
  onClickUpload: () => void;
}

function ImgView({ errorMessage, value, onChange, field, onClickUpload }: ImgViewProps) {
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0
  });
  const imagePathFromUpload = useObjectURL(
    errorMessage === undefined && value?.kind === "upload"
      ? value.data.file
      : undefined
  );
  const imageSrc =
    value?.kind === "from-server" ? value.data.src : imagePathFromUpload;

  return (
    <div className="flex gap-2 items-end">
      <ImageWrapper url={value?.kind === "from-server" ? imageSrc : undefined}>
        {errorMessage ||
        (value?.kind !== "from-server" && value?.kind !== "upload") ? (
          <Placeholder />
        ) : (
          <Fragment>
            {value?.kind === "upload" && (
              <div className="absolute inset-0 text-white text-center break-words flex items-center p-6 bg-gray-900/65 leading-tight font-medium">
                Save to complete upload
              </div>
            )}
            <img
              onLoad={event => {
                if (value?.kind === "upload") {
                  setImageDimensions({
                    width: event.currentTarget.naturalWidth,
                    height: event.currentTarget.naturalHeight
                  });
                }
              }}
              className="object-contain w-full h-full"
              alt={`Image uploaded to ${field.path} field`}
              src={imageSrc || ""}
            />
          </Fragment>
        )}
      </ImageWrapper>
      {value?.kind === "from-server" || value?.kind === "upload" ? (
        onChange && (
          <div className="h-[120px] flex flex-col justify-end">
            {errorMessage === undefined ? (
              <ImageMeta
                {...(value.kind === "from-server"
                  ? {
                      width: value.data.width,
                      height: value.data.height,
                      url: value.data.src,
                      name: value.data.id && value.data.extension ? `${value.data.id}.${value.data.extension}` : undefined,
                      size: value.data.filesize
                    }
                  : {
                      width: imageDimensions.width,
                      height: imageDimensions.height,
                      size: value.data.file.size
                    })}
              />
            ) : null}
            <div className="flex gap-2 items-center">
              <Button
                size="sm"
                variant="outline"
                onClick={onClickUpload}
              >
                Change
              </Button>
              {value.kind === "from-server" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    onChange({ kind: "remove", previous: value });
                  }}
                >
                  Remove
                </Button>
              )}
              {value.kind === "upload" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    onChange(value.previous);
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        )
      ) : (
        <div className="flex gap-2 items-center">
          <Button
            size="sm"
            variant="outline"
            disabled={onChange === undefined}
            onClick={onClickUpload}
            type="button"
          >
            Upload Image
          </Button>
          {value?.kind === "remove" && value.previous && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                if (value.previous !== undefined) {
                  onChange?.(value.previous);
                }
              }}
            >
              Undo removal
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export function ImageMeta({ width = 0, height = 0, size, url, name }: { width?: number; height?: number; size?: number; url?: string; name?: string }) {
  return (
    <div className="p-1">
      <p className="text-sm">Size: {bytes(size || 0)}</p>
      <p className="text-sm">Dimensions: {`${width} x ${height}`}</p>
    </div>
  );
}

export function ImageWrapper({ children, url }: { children: React.ReactNode; url?: string }) {
  const commonClasses = "relative overflow-hidden flex-shrink-0 leading-none bg-muted/40 rounded-md text-center w-[120px] h-[120px] border";
  
  if (url) {
    return (
      <a
        className={`block ${commonClasses}`}
        target="_blank"
        href={url}
        rel="noreferrer"
      >
        {children}
      </a>
    );
  }
  return (
    <div className={commonClasses}>
      {children}
    </div>
  );
}

export function Placeholder() {
  return (
    <svg
      className="w-full h-full"
      width="120"
      height="120"
      viewBox="0 0 121 121"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M47.8604 45.6729H72.8604C73.5234 45.6729 74.1593 45.9362 74.6281 46.4051C75.097 46.8739 75.3604 47.5098 75.3604 48.1729V73.1729C75.3604 73.8359 75.097 74.4718 74.6281 74.9406C74.1593 75.4095 73.5234 75.6729 72.8604 75.6729H47.8604C47.1973 75.6729 46.5614 75.4095 46.0926 74.9406C45.6237 74.4718 45.3604 73.8359 45.3604 73.1729V48.1729C45.3604 47.5098 45.6237 46.8739 46.0926 46.4051C46.5614 45.9362 47.1973 45.6729 47.8604 45.6729ZM47.8604 65.6729V73.1729H72.8604V70.6729L66.6104 64.4229L64.6229 66.4104C64.1544 66.876 63.5208 67.1373 62.8604 67.1373C62.1999 67.1373 61.5663 66.876 61.0979 66.4104L54.1104 59.4229L47.8604 65.6729ZM68.3729 62.6479L72.8604 67.1354V48.1729H47.8604V62.1354L52.3479 57.6479C52.8163 57.1822 53.4499 56.9209 54.1104 56.9209C54.7708 56.9209 55.4044 57.1822 55.8729 57.6479L62.8604 64.6354L64.8479 62.6479C65.3163 62.1822 65.9499 61.9209 66.6104 61.9209C67.2708 61.9209 67.9044 62.1822 68.3729 62.6479ZM66.1937 57.5409C65.5771 57.9529 64.852 58.1729 64.1104 58.1729C63.1158 58.1729 62.162 57.7778 61.4587 57.0745C60.7554 56.3712 60.3604 55.4174 60.3604 54.4229C60.3604 53.6812 60.5803 52.9561 60.9923 52.3395C61.4044 51.7228 61.9901 51.2421 62.6753 50.9583C63.3605 50.6745 64.1145 50.6002 64.8419 50.7449C65.5694 50.8896 66.2376 51.2468 66.762 51.7712C67.2864 52.2956 67.6436 52.9638 67.7883 53.6913C67.933 54.4187 67.8587 55.1727 67.5749 55.8579C67.2911 56.5431 66.8104 57.1288 66.1937 57.5409ZM64.8048 53.3835C64.5993 53.2462 64.3576 53.1729 64.1104 53.1729C63.7788 53.1729 63.4609 53.3046 63.2265 53.539C62.992 53.7734 62.8604 54.0913 62.8604 54.4229C62.8604 54.6701 62.9337 54.9118 63.071 55.1173C63.2084 55.3229 63.4036 55.4831 63.632 55.5777C63.8604 55.6723 64.1117 55.6971 64.3542 55.6488C64.5967 55.6006 64.8194 55.4816 64.9942 55.3067C65.1691 55.1319 65.2881 54.9092 65.3363 54.6667C65.3846 54.4242 65.3598 54.1729 65.2652 53.9445C65.1706 53.7161 65.0104 53.5209 64.8048 53.3835Z"
        fill="#b1b5b9"
      />
    </svg>
  );
} 