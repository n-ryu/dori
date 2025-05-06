import { IndividualEvent } from "../types/types";

interface Props {
  event?: IndividualEvent;
}

export const SelectedEventCard = ({ event }: Props) => {
  return (
    <div
      style={{
        borderTop: "1px solid #dddddd",
        margin: 10,
        paddingTop: 10,
        height: "100%",
        fontSize: 10,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      {event ? (
        <>
          <div
            style={{
              display: "grid",
              alignItems: "center",
              gridTemplateColumns: "1fr auto",
              fontWeight: 500,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                display: "inline-block",
                backgroundColor: event.event.color,
                marginRight: 5,
              }}
            />
            {event.event.summary}
          </div>
          <div>
            <div>{event.startDate.toString()}</div>
            <div>{event.endDate.toString()}</div>
          </div>
          <div>{event.event.description}</div>
        </>
      ) : (
        <span style={{ color: "#888888" }}>no item</span>
      )}
    </div>
  );
};
