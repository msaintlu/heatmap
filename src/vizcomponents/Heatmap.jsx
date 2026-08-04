import * as d3 from "d3";
import { useRef } from "react";
import { useDimensions } from "./useDimensions";
import {useMemo} from "react";


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
  const [min, max] = useMemo(() => d3.extent(data.map((d) => d.value)), [data]);
 
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

  return (
    <div>
      <svg width={width} height={height}>
        <g
          transform={
            `translate( ${MARGIN.left}, ${MARGIN.top} )`
          }
        >
          {allRects}
        </g>
      </svg>
    </div>
  );
};