import Logo from "../assets/logo_full.svg?react";
import { IndividualEvent } from "../types/types";
import { FileInput } from "./FileInput";
import { SelectedEventCard } from "./SelectedEventCard";

interface Props {
  selectedEvent?: IndividualEvent;
  onIcsChange: (data: string) => void;
}

export const Panel = ({ onIcsChange, selectedEvent }: Props) => {
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
        borderRadius: "0 5px 5px 0",
        boxSizing: "border-box",
      }}
    >
      <div>
        <Logo height={48} />
        <SelectedEventCard event={selectedEvent} />
      </div>
      <FileInput onChange={onIcsChange} />
    </div>
  );
};
