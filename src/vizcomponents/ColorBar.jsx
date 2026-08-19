import * as d3 from "d3";
import { useEffect, useRef, useMemo } from "react";

export const ColorBar = ({
  height,
  width,
  colorScale,
  interactionData
}) => {
  const COLOR_LEGEND_MARGIN = { top: 0, right: 0, bottom: 50, left: 0 };
  const boundsWidth = width - COLOR_LEGEND_MARGIN.right - COLOR_LEGEND_MARGIN.left;
  const boundsHeight = height - COLOR_LEGEND_MARGIN.top - COLOR_LEGEND_MARGIN.bottom;

  const domain = colorScale.domain();
  const max = domain[0];
  const min = domain[domain.length - 1];
  const xScale = d3.scaleLinear().range([0, boundsWidth]).domain([min, max]);
  const canvasRef = { current: null };

  const hoveredValue = interactionData?.value;
  const x = hoveredValue ? xScale(hoveredValue) : null;
  const triangleWidth = 9;
  const triangleHeight = 6;
  const triangle = x ? (
    <polygon
      points={`${x},0 ${x - triangleWidth / 2},${-triangleHeight} ${
        x + triangleWidth / 2
      },${-triangleHeight}`}
      fill="grey"
    />
  ) : null;

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!context) {
      return;
    }

    for (let i = 0; i < boundsWidth; ++i) {
      context.fillStyle = colorScale( min + ((max-min) * i) / boundsWidth) ;
      context.fillRect(i, 0, 1, boundsHeight);
    }
  }, [width, height]);

  const allTicks = domain.map((tick) => {
    return (
      <g key={tick}>
        <text
          x={xScale(tick)}
          y={boundsHeight + 20}
          fontSize={14}
          textAnchor="middle"
        >
          {tick + " °C"}
        </text>
      </g>
    );
  });

  return (
    <div style={{ width, height }}>
      <div
        style={{
          position: "relative",
          transform: `translate(${COLOR_LEGEND_MARGIN.left}px,
            ${COLOR_LEGEND_MARGIN.top}px`,
        }}
      >
        <canvas ref={canvasRef} width={boundsWidth} height={boundsHeight} />
        <svg
          width={boundsWidth}
          height={boundsHeight}
          style={{ position: "absolute", top: 0, left: 0, overflow: "visible" }}
        >
          {allTicks}
          {triangle}
        </svg>
      </div>
    </div>
  );
};
