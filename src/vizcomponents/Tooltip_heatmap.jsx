export const Tooltip = ({ interactionData }) => {
  if (!interactionData) {
    return null;
  }

  const {
    yValue,
    xLabel,
    xPos,
    yPos,
    value,
    placement,
    colorValue
  } = interactionData;

  {/*console.log("Tooltip render", {
    xPos,
    yPos,
    placement,
    yValue,
    xLabel,
  });*/}

  return (
    <div
      className={`tooltip ${
        placement === "left" ? "tooltip-left" : "tooltip-right"
      }`}
      style={{
        position: "absolute", // DO NOT PUT IN THE CSS. It is ignored there, for some reason
        left: xPos,
        top: yPos,
        transform:
          placement === "left" ? "translate(-120%,-50%)" : "translate(5%,-50%)",
      }}
    >
      <div className="tooltip-title">
        <b>{yValue}</b>
      </div>
      <p> {xLabel} </p>
      <div className="tooltip-content" style={{ borderColor: colorValue }}>
        <b> {value + " °C"} </b>
      </div>
    </div>
  );
};
