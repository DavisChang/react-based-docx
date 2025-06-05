import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './index.css';

interface WheelData {
  label: string;
  value: number;
  question: string;
}

const data: WheelData[] = [
  { label: 'Dell LAPTOP', value: 1, question: 'Dell LAPTOP' },
  { label: 'IMAC PRO', value: 2, question: 'IMAC PRO' },
  { label: 'SUZUKI', value: 3, question: 'SUZUKI' },
  { label: 'HONDA', value: 4, question: 'HONDA' },
  { label: 'FERRARI', value: 5, question: 'FERRARI' },
  { label: 'APARTMENT', value: 6, question: 'APARTMENT' },
  { label: 'IPAD PRO', value: 7, question: 'IPAD PRO' },
  { label: 'LAND', value: 8, question: 'LAND' },
  { label: 'MOTOROLLA', value: 9, question: 'MOTOROLLA' },
  { label: 'AAA BMW', value: 10, question: 'AAA BMW' },
  { label: 'TESLA', value: 11, question: 'TESLA' },
  { label: 'GALAXY', value: 12, question: 'GALAXY' },
  { label: 'NISSAN', value: 13, question: 'NISSAN' },
  { label: 'MAZDA', value: 14, question: 'MAZDA' },
  { label: 'TOYOTA', value: 15, question: 'TOYOTA' },
  { label: 'SONY', value: 16, question: 'SONY' },
  { label: 'XBOX', value: 17, question: 'XBOX' },
  { label: 'NOKIA', value: 18, question: 'NOKIA' },
  { label: 'LAMBORGHINI', value: 19, question: 'LAMBORGHINI' },
  { label: 'BUGATTI', value: 20, question: 'BUGATTI' },
];

function getRandomSpin(dataLength: number): { picked: number; rotation: number } {
  const ps = 360 / dataLength;
  const rng = Math.floor(Math.random() * 1440 + 360);
  const rotation = Math.round(rng / ps) * ps;
  let picked = Math.round(dataLength - (rotation % 360) / ps);
  picked = picked >= dataLength ? picked % dataLength : picked;
  return { picked, rotation: rotation + 90 - Math.round(ps / 2) };
}

const SpinWheel = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [question, setQuestion] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const oldPick = useRef<number[]>([]);
  const oldRotation = useRef<number>(0);
  const spinHandlerRef = useRef<(() => void) | null>(null);

  const initWheel = () => {
    const padding = { top: 20, right: 40, bottom: 0, left: 0 };
    const w = 500 - padding.left - padding.right;
    const h = 500 - padding.top - padding.bottom;
    const r = Math.min(w, h) / 2;

    const color = d3.scaleOrdinal<string, string>(d3.schemeCategory10);

    const svg = d3
      .select(svgRef.current)
      .attr('width', w + padding.left + padding.right)
      .attr('height', h + padding.top + padding.bottom);

    const container = svg
      .append('g')
      .attr('class', 'chartholder')
      .attr('transform', `translate(${w / 2 + padding.left}, ${h / 2 + padding.top})`);

    const vis = container.append('g');

    const pie = d3.pie<WheelData>().sort(null).value(() => 1);
    const arc = d3.arc<d3.PieArcDatum<WheelData>>().outerRadius(r).innerRadius(0);

    const arcs = vis
      .selectAll<SVGGElement, d3.PieArcDatum<WheelData>>('g.slice')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'slice');

    arcs
      .append('path')
      .attr('fill', (_: unknown, i: number) => color(i.toString()))
      .attr('d', arc);

    arcs
      .append('text')
      .attr('transform', function (d: d3.PieArcDatum<WheelData>) {
        const angle = (d.startAngle + d.endAngle) / 2;
        const x = Math.cos(angle - Math.PI / 2) * (r - 10);
        const y = Math.sin(angle - Math.PI / 2) * (r - 10);
        return `translate(${x}, ${y}) rotate(${(angle * 180) / Math.PI - 90})`;
      })
      .attr('text-anchor', 'end')
      .text((_, i) => data[i].label);

    const spin = () => {
      if (oldPick.current.length === data.length) return;
      const { picked, rotation } = getRandomSpin(data.length);
      if (oldPick.current.includes(picked)) {
        spin();
        return;
      }
      oldPick.current.push(picked);

      vis
        .transition()
        .duration(3000)
        .attrTween('transform', () => {
          const i = d3.interpolate(oldRotation.current % 360, rotation);
          return (t: number) => `rotate(${i(t)})`;
        })
        .on('end', () => {
          vis.selectAll('path').attr('fill', (_, i) => color(i.toString()));
          vis.selectAll('text').attr('fill', 'black').style('font-weight', 'normal');

          vis.select(`.slice:nth-child(${picked + 1}) path`).attr('fill', 'black');
          vis.select(`.slice:nth-child(${picked + 1}) text`).attr('fill', 'white').style('font-weight', 'bold');

          setQuestion(data[picked].question);
          setSelectedIndex(picked);
          oldRotation.current = rotation;
        });
    };

    spinHandlerRef.current = spin;

    svg
      .append('g')
      .attr('transform', `translate(${w + padding.left + padding.right}, ${h / 2 + padding.top})`)
      .append('path')
      .attr('d', `M-${r * 0.15},0L0,${r * 0.05}L0,${-r * 0.05}Z`)
      .attr('fill', 'black');

    container
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 60)
      .attr('fill', 'white')
      .style('cursor', 'pointer');

    container
      .append('text')
      .attr('x', 0)
      .attr('y', 15)
      .attr('text-anchor', 'middle')
      .text('Click to Spin')
      .style('font-weight', 'bold')
      .style('font-size', '30px');

    container.on('click', spin);
  };

  useEffect(() => {
    initWheel();
  }, []);

  const resetWheel = () => {
    setQuestion('');
    setSelectedIndex(null);
    oldPick.current = [];
    oldRotation.current = 0;
    d3.select(svgRef.current).selectAll('*').remove();
    initWheel();
  };

  const sendUserData = () => {
    console.log('sendUserData:', selectedIndex, selectedIndex !== null ? data[selectedIndex] : null);
  };

  return (
    <div>
      <div style={{ padding: '20px' }}>
        <h1>SpinWheel</h1>
        <button type="button" onClick={sendUserData}>
          Send User Data
        </button>
        <button type="button" onClick={resetWheel} style={{ marginLeft: '10px' }}>
          Reset Wheel
        </button>
      </div>
      <div style={{ position: 'relative' }}>
        <svg ref={svgRef}></svg>
        <div id="question">
          <h1>{question}</h1>
        </div>
      </div>
    </div>
  );
};

export default SpinWheel;
