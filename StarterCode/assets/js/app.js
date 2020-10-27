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
  
  // Function used for updating text in circles group with a transition to new text.
  function renderText(circletextGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
    circletextGroup.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]))
      .attr("y", d => newYScale(d[chosenYAxis]));
        
    return circletextGroup;
  }
  
  // Function used for updating circles group with new tooltip.
  function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
  
    // X Axis
    if (chosenXAxis === "poverty") {
        var xlabel = "Poverty: ";
    }
    else if (chosenXAxis === "income") {
        var xlabel = "Median Income: "
    }
    else {
        var xlabel = "Age: "
    }
  
    // Y Axis
    if (chosenYAxis === "healthcare") {
        var ylabel = "Lacks Healthcare: ";
    }
    else if (chosenYAxis === "smokes") {
        var ylabel = "Smokers: "
    }
    else {
        var ylabel = "Obesity: "
    }
  
    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .style("background", "black")
    .style("color", "white")
    .offset([120, -60])
    .html(function(d) {
        if (chosenXAxis === "age") {
            // All yAxis tooltip labels presented and formated as %.
            // Display Age without format for xAxis.
            return (`${d.state}<hr>${xlabel} ${d[chosenXAxis]}<br>${ylabel}${d[chosenYAxis]}%`);
          } else if (chosenXAxis !== "poverty" && chosenXAxis !== "age") {
            // Display Income in dollars for xAxis.
            return (`${d.state}<hr>${xlabel}$${d[chosenXAxis]}<br>${ylabel}${d[chosenYAxis]}%`);
          } else {
            // Display Poverty as percentage for xAxis.
            return (`${d.state}<hr>${xlabel}${d[chosenXAxis]}%<br>${ylabel}${d[chosenYAxis]}%`);
          }      
    });
  
    circlesGroup.call(toolTip);
    //mouseon event
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
    //mouseout event
     .on("mouseout", function(data,index) {
      toolTip.hide(data)
    });
  
  return circlesGroup;
  }
  
  
  // Import Data
  d3.csv("assets/data/data.csv").then(function(healthData) {
  
      // Step 1: Parse Data/Cast as numbers
      // ==============================
      healthData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        data.age = +data.age;
        data.income = +data.income;
        data.smokes = +data.smokes;
        data.obesity = +data.obesity;
      });
  
