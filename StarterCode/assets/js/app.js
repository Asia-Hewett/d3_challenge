var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

//append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//initial params
var chartData = null;

var chosenXAxis = 'poverty'
var chosenYAxis = 'healthcare'

var xAxisLabels = ["poverty", "age", "income"];  // Default 
var yAxisLabels = ["obesity", "smokes", "healthcare"];
var labelsTitle = { "poverty": "In Poverty (%)", 
                    "age": "Age (Median)", 
                    "income": "Household Income (Median)",
                    "obesity": "Obese (%)", 
                    "smokes": "Smokes (%)", 
                    "healthcare": "Lacks Healthcare (%)" };

function xScale(healthData,chosenXAxis){
  var xLinearScale = d3.scaleLinear()
      .domain([d3.min(healthData, d=>d[chosenXAxis])*0.9, d3.max(healthData,d=>d[chosenXAxis])*1.1])
      .range([0,width])
  return xLinearScale;

}

function yScale(healthData, chosenYAxis) {
  // Create Scales.
  var yLinearScale = d3.scaleLinear()
      .domain([d3.min(healthData, d => d[chosenYAxis]) * .9,d3.max(healthData, d => d[chosenYAxis]) * 1.1 ])
      .range([height, 0]);

  return yLinearScale;
}

    // Function used for updating xAxis var upon click on axis label.
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

  return xAxis;
}

  // Function used for updating yAxis var upon click on axis label.
  function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
          .duration(1000)
          .call(leftAxis);
  
    return yAxis;
  }
  
  // Function used for updating circles group with a transition to new circles.
  function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
  
    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]))
      .attr("cy", d => newYScale(d[chosenYAxis]));
  
    return circlesGroup;
  }
  
