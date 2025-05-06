import { useCallback } from "react";

interface Props {
  onIcsChange: (data: string) => void;
}

export const Panel = ({ onIcsChange }: Props) => {
  const hanldeFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();

      reader.onload = () => {
        onIcsChange(reader.result as string);
      };

      reader.readAsText(file);
    },
    [onIcsChange]
  );

  return (
    <div
      style={{
        position: "fixed",
        width: "100vw",
        height: 38,
        zIndex: 100,
        backgroundColor: "#ffffffff",
        boxShadow: "0 0 6px 0 #00000088",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingInline: 25,
        borderRadius: "0 0 5px 5px",
        boxSizing: "border-box",
      }}
    >
      <span>Dori</span>
      <input type="file" onChange={hanldeFileChange} accept=".ics" />
    </div>
  );
};
