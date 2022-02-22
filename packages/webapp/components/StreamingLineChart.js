import React from 'react';
import PropTypes from 'prop-types';
import ChartCanvas from 'ui/ChartCanvas';
import {
  scaleTime,
  scaleLinear,
  axisBottom,
  axisLeft,
  extent,
  line,
  curveMonotoneX,
} from 'd3';
import { parseISO } from 'date-fns';

function makeScale({ domain, range, scale = scaleLinear }) {
  return scale().domain(domain).range(range);
}

function draw(data) {
  return function ({ svg, width: _w, height: _h, canvas }) {
    data = data.map((d) => ({ ...d, t: parseISO(d.t) }));
    const root = svg.selectAll('.root').data([data]).join('g').attr('class', 'root');

    const xScale = makeScale({
      domain: extent(data, (d) => d.t),
      range: [canvas.left, canvas.right],
      scale: scaleTime,
    });

    const yScale = makeScale({
      domain: extent(data, (d) => d.v),
      range: [canvas.bottom, canvas.top],
      scale: scaleLinear,
    });

    const lineFn = line()
      .curve(curveMonotoneX)
      .defined((d) => !isNaN(d.v))
      .x((d) => xScale(d.t))
      .y((d) => yScale(d.v));

    root
      .selectAll('.line')
      .data([data])
      .join('path')
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke-width', '2px')
      .attr('d', lineFn);

    root
      .selectAll('.x-axis')
      .data([data])
      .join('g')
      .attr('class', 'x-axis')
      .attr('stroke', 'none')
      .call(function (g) {
        return g
          .attr('transform', `translate(0,${canvas.height})`)
          .call(axisBottom(xScale));
      });

    root
      .selectAll('.y-axis')
      .data([data])
      .join('g')
      .attr('class', 'y-axis')
      .attr('stroke', 'none')
      .call(function (g) {
        return g
          .attr('transform', `translate(${canvas.left}, 0)`)
          .call(axisLeft(yScale));
      });
  };
}

function StreamingLineChart({ data, id, className, background, fill, color, stroke }) {
  return (
    <ChartCanvas
      className={className}
      id={id}
      fil={fill}
      color={color}
      background={background}
      stroke={stroke}
      draw={draw(data)}
    ></ChartCanvas>
  );
}

StreamingLineChart.defaultProps = {};

StreamingLineChart.propTypes = {
  children: PropTypes.any,
};

export default StreamingLineChart;
