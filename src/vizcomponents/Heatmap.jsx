import * as d3 from "d3";
import { useRef } from "react";
import { useDimensions } from "./useDimensions";
import {useMemo} from "react";
import {ColorBar} from "./ColorBar";


export const ResponsiveHeatmap = (props) => {
  const chartRef = useRef(null);
  const chartSize = useDimensions(chartRef);
  return (
    <div ref={chartRef} style={{ width: '100%', height: '100%' }}>
      <Heatmap
        height={chartSize.height}
        width={chartSize.width}
        {...props} // pass all the props
      />
    </div>
  );
};

const Heatmap = ({ width, height, data, MARGIN}) => {
  const boundsWidth = width - MARGIN.left - MARGIN.right;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  // List of unique items that will appear on the heatmap Y axis
  const allYGroups = useMemo(() => [...new Set(data.map((d) => d.city))], [data]);
  // List of unique items that will appear on the heatmap X axis
  const allXGroups = useMemo(() => [...new Set(data.map((d) => d.week))], [data]);
  // Max absolute value, for colorbar (if the heatmap was showing anomalies...)
  {/*const maxAbsValue = Math.max(...data.map(d => Math.abs(d.value)));*/}
  // Min and max of the value property, used to build the color scale
  // non arrondis 
  {/*const [min, max] = useMemo(() => d3.extent(data.map((d) => d.value)), [data]);*/}
  // arrondis
  const min = Math.floor(Math.min(...data.map((d) => d.value)));
  const max = Math.ceil(Math.max(...data.map((d) => d.value)));

  const xScale = useMemo(() => {
    return d3
      .scaleBand()
      .range([0, boundsWidth])
      .domain(allXGroups)
      .padding(0.);
  }, [data, width]);

  const yScale = useMemo(() => {
    return d3
      .scaleBand()
      .range([0, boundsHeight])
      .domain(allYGroups)
      .padding(0.);
  }, [data, height]);

  const colorScale = useMemo(() => {
    return d3
      .scaleSequential()
      .interpolator(d3.interpolateRdYlBu)
      .domain([max, min]);
  }, [max, min]);

  const allRects = data.map((d, i) => {
    if (d.value === null) {
      return;
    }
    return (
      <rect
        key={i}
        x={xScale(d.week)}
        y={yScale(d.city)}
        width={xScale.bandwidth()}
        height={yScale.bandwidth()}
        fill={colorScale(d.value)}
      />
    );
  });

  const yLabels = allYGroups.map((name, i) => {
    const yPos = yScale(name);
    return (
      <text
        key={i}
        x={-5}
        y={yPos + yScale.bandwidth() / 2}
        textAnchor="end"
        dominantBaseline="middle"
        fontSize={14}
      >
        {name}
      </text>
    );
  });

  // Associate months to weeks
  const weekToMonth = useMemo(() => {
    const mapping = {};
    data.forEach((d) => {
      if (!mapping[d.week]) {
        mapping[d.week] = d.month; 
      }
    });
    return mapping;
  }, [data]);

  const xMonths = useMemo(() => {
    const monthLabels = [];
    let lastMonth = null;

    allXGroups.forEach((week) => {
      const month = weekToMonth[week];
      if (month !== lastMonth) {
        monthLabels.push(month);
        lastMonth = month;
      } else {
        monthLabels.push("");
      }
    });

    return monthLabels;
  }, [allXGroups, weekToMonth]);

  const xLabels = xMonths.map((month, i) => {
    const xPos = xScale(allXGroups[i]);
    return (
      <text
        key={i}
        x={xPos + xScale.bandwidth() / 2}
        y={boundsHeight + 15}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={14}
      >
        {month}
      </text>
    );
  });

  return (
    <div>
      <svg width={width} height={height}>
        <g transform={`translate( ${MARGIN.left}, ${MARGIN.top} )`}>
          {allRects}
          {yLabels}
          {xLabels}
        </g>
      </svg>
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <ColorBar height={65} width={400} colorScale={colorScale}/>
      </div>
    </div>
  );
};