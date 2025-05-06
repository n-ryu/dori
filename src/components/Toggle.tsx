interface Props {
  value: boolean;
  onChange: (value: boolean) => void;
}

export const Toggle = ({ value, onChange }: Props) => {
  return (
    <>
      <label
        htmlFor="toggle"
        style={{
          position: "relative",
          border: "none",
          borderRadius: 5,
          background: value ? "#4477bb" : "#dddddd",
          height: 12,
          width: 30,
          display: "flex",
          alignItems: "center",
          padding: 2,
          cursor: "pointer",
          transition: "background 0.3s",
        }}
      >
        <div
          style={{
            position: "absolute",
            backgroundColor: "white",
            width: 8,
            height: 8,
            borderRadius: 4,
            left: value ? 2 : "100%",
            transform: value
              ? "translateX(0)"
              : "translateX(calc(-100% - 2px))",
            transition: "left 0.3s",
          }}
        />
      </label>
      <input
        id="toggle"
        checked={value}
        type="checkbox"
        style={{ display: "none" }}
        onChange={(e) => {
          onChange(e.target.checked);
        }}
      />
    </>
  );
};
