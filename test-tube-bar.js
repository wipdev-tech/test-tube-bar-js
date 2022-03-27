const renderBar = (data) => {
  const svg = d3.select("svg#test-tube-bar");
  const width = +svg.attr("width");
  const height = +svg.attr("height");
  const margin = { top: 40, right: 40, bottom: 80, left: 100 };
  const innerWidth = width - margin.right - margin.left;
  const innerHeight = height - margin.top - margin.bottom;

  const xValue = (d) => d.cat;
  const yValue = (d) => d.val;

  // scales
  const yScale = d3.scaleLinear().domain([0, 1]).range([innerHeight, 0]);

  const xScale = d3
    .scaleBand()
    .domain(data.map(xValue))
    .range([0, innerWidth])
    .padding(0.4);

  const cScale = d3
    .scaleOrdinal()
    .domain(data.map(xValue))
    .range(["#e2733d", "#337f88", "#de4c68"]);

  // axes
  // const yAxis = d3.axisLeft(yScale);

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // g.append("g").call(yAxis);

  tubeBarsG = g
    .selectAll("rect.data")
    .data(data)
    .enter()
    .append("g")
    .classed("tube-bar", true);

  const arc = d3
    .arc()
    .innerRadius(0)
    .outerRadius(0.5 * xScale.bandwidth())
    .startAngle(Math.PI / 2)
    .endAngle((Math.PI * 3) / 2);

  // bg rects
  tubeBarsG
    .append("rect")
    .classed("bg-rect", true)
    .attr("x", (d) => xScale(xValue(d)))
    .attr("width", xScale.bandwidth())
    .attr("height", innerHeight);
  tubeBarsG
    .append("rect")
    .classed("bg-rect", true)
    .attr("x", (d) => xScale(xValue(d)) - 10)
    .attr("y", -30)
    .attr("width", xScale.bandwidth() + 20)
    .attr("height", 30);

  // tube base
  tubeBarsG
    .append("path")
    .attr("d", arc)
    .attr("fill", (d) => cScale(xValue(d)))
    .attr(
      "transform",
      (d) =>
        `translate(${
          xScale(xValue(d)) + 0.5 * xScale.bandwidth()
        },${innerHeight})`
    );

  // actual bars
  tubeBarsG
    .append("rect")
    .attr("fill", (d) => cScale(xValue(d)))
    .attr("x", (d) => xScale(xValue(d)))
    .attr("width", xScale.bandwidth())
    .attr("y", innerHeight)
    .transition()
    .duration(1500)
    .attr("y", (d) => yScale(yValue(d)))
    .attr("height", (d) => yScale(1 - yValue(d)));

  // labels
  tubeBarsG
    .append("text")
    .attr("fill", (d) => cScale(xValue(d)))
    .attr("x", (d) => xScale(xValue(d)) + 0.5 * xScale.bandwidth())
    .attr("y", -15)
    .text(0)
    .transition()
    .duration(1500)
    .textTween(function (d) {
      const i = d3.interpolate(0, yValue(d));
      return (t) => d3.format(".1%")(i(t));
    });
};

const data = [
  { cat: "Outpatient care & others", val: 0.392 },
  { cat: "Inpatient care (hospital)", val: 0.406 },
  { cat: "Medical goods (including pharmaceuticals)", val: 0.192 },
];

renderBar(data);
