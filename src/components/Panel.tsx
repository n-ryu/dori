import Logo from "../assets/logo_full.svg?react";
import { FileInput } from "./FileInput";

interface Props {
  onIcsChange: (data: string) => void;
}

export const Panel = ({ onIcsChange }: Props) => {
  return (
    <div
      style={{
        position: "fixed",
        width: 180,
        height: "100vh",
        zIndex: 100,
        backgroundColor: "#ffffffff",
        boxShadow: "0 0 6px 0 #00000088",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        paddingInline: 25,
        paddingTop: 10,
        paddingBottom: 25,
        borderRadius: "0 0 5px 5px",
        boxSizing: "border-box",
      }}
    >
      <Logo height={48} />
      <FileInput onChange={onIcsChange} />
    </div>
  );
};
