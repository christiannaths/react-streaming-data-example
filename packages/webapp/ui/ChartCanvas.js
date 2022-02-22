import React from 'react';
import { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withResizeDetector } from 'react-resize-detector';
import { select } from 'd3';

const DEFAULT_MARGIN = {
  top: 16,
  right: 16,
  bottom: 16,
  left: 32,
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: ${(p) => p.$background || 'transparent'};
  fill: ${(p) => p.$fill || 'white'};
  color: ${(p) => p.$color || 'white'};
  stroke: ${(p) => p.$stroke || 'transparent'};
`;

const Svg = styled.svg`
  width: 100%;
  height: 0;
  display: block;
  flex: 1 1 auto;
`;

function defaultDrawFn({ svg, width, height, canvas }) {
  const data = [];

  const root = svg.selectAll('.root').data([data]).join('g').attr('class', 'root');

  root
    .selectAll('.border')
    .data([data])
    .join('rect')
    .attr('class', 'border')
    .attr('stroke', 'magenta')
    .attr('fill', 'none')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', width)
    .attr('height', height);

  root
    .selectAll('.canvas')
    .data([data])
    .join('rect')
    .attr('class', 'canvas')
    .attr('stroke', 'cyan')
    .attr('fill', 'none')
    .attr('x', canvas.left)
    .attr('y', canvas.top)
    .attr('width', canvas.width)
    .attr('height', canvas.height);

  root
    .selectAll('.canvas-label')
    .data([0])
    .join('text')
    .attr('class', 'canvas-label')
    .attr('fill', 'cyan')
    .attr('text-anchor', 'start')
    .attr('alignment-baseline', 'hanging')
    .attr('font-size', 10)
    .attr('x', canvas.left + 4)
    .attr('y', canvas.top + 4)
    .text(`Canvas Area`);

  root
    .selectAll('.breakeven-label')
    .data([0])
    .join('text')
    .attr('class', 'breakeven-label')
    .attr('fill', 'silver')
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .attr('x', canvas.width / 2 + canvas.left)
    .attr('y', canvas.height / 2)
    .text(`Draw something here`);
}

function ChartCanvas({
  id: svgId,
  className,
  draw,
  children,
  width: resizeWidth,
  height: resizeHeight,
  targetRef,
  minDrawHeight,
  minDrawWidth,
  margin: marginProp,
  containerProps,
  svgProps,
  background,
  fill,
  color,
  stroke,
}) {
  const m = useMemo(() => ({ ...DEFAULT_MARGIN, ...marginProp }), [marginProp]);
  const width = useMemo(() => Math.floor(resizeWidth), [resizeWidth]);
  const height = useMemo(() => Math.floor(resizeHeight), [resizeHeight]);

  useEffect(() => {
    if (!svgId) return;
    if (width < minDrawWidth || height < minDrawHeight) return;

    draw({
      width,
      height,
      margin: m,
      svg: select(`#${svgId}`),
      canvas: {
        top: m.top,
        left: m.left,
        right: width - m.right,
        bottom: height - m.bottom,
        height: height - (m.top + m.bottom),
        width: width - (m.left + m.right),
      },
    });
  }, [draw, height, m, minDrawHeight, minDrawWidth, svgId, width]);

  return (
    <Container
      ref={targetRef}
      {...containerProps}
      className={className}
      $color={color}
      $fill={fill}
      $background={background}
      $stroke={stroke}
    >
      <Svg id={svgId} aria-label="chart" {...svgProps}>
        {children}
      </Svg>
    </Container>
  );
}

ChartCanvas.defaultProps = {
  draw: defaultDrawFn,
  width: 0,
  height: 0,
  minDrawWidth: 28,
  minDrawHeight: 28,
};

ChartCanvas.propTypes = {
  draw: PropTypes.func.isRequired,
  margin: PropTypes.object,
};

export default withResizeDetector(ChartCanvas, {
  refreshMode: 'debounce',
  refreshRate: 350,
  trailing: true,
});
