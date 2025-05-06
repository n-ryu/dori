import { useCallback, useRef, useState } from "react";

interface Props {
  onChange: (data: string) => void;
}

export const FileInput = ({ onChange }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [filename, setFilename] = useState<string>();

  const hanldeFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setFilename(file.name);

      const reader = new FileReader();

      reader.onload = () => {
        onChange(reader.result as string);
      };

      reader.readAsText(file);
    },
    [onChange]
  );

  return (
    <>
      <div style={{ width: "100%" }}>
        <label
          htmlFor="file-input"
          style={{
            cursor: "pointer",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              padding: 5,
              textAlign: "center",
              width: "100%",
              fontSize: 10,
            }}
          >
            {filename ?? "please import ics file"}
          </div>
          <div
            style={{
              padding: 5,
              textAlign: "center",
              width: "100%",
              background: "#333333",
              borderRadius: 5,
              color: "white",
              fontSize: 10,
            }}
          >
            import
          </div>
        </label>
        <input
          id="file-input"
          ref={inputRef}
          type="file"
          onChange={hanldeFileChange}
          accept=".ics"
          style={{ display: "none" }}
        />
      </div>
    </>
  );
};
