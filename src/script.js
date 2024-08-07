
    //Sets the dimensions of the graph.
    let w = 1000;
    let h = 800;
    let wpadding = 70;
    let hpadding = 70;

    //The local copy of data stored when data is fetched from the web.
    let dataSet

    let mouseover
    let mousemove
    let moveleave

    //Variables used for establishing the axis.
    let xScale
    let yScale
    let xAxisScale
    let yAxisScale
    let xAxis
    let yAxis

    //Appends the svg element to the graph.
    const svg = d3.select('#graph')
                .append("svg")
                .attr("id", "bar-graph")
                .attr("viewBox", "0 0 1000 800")


    //Fetches the data from the web then draws the graph.
      fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
        .then(response => response.json())
        .then(content => {
        dataSet = content;
         getScales();
         drawAxis();
         drawTooltip();
         drawChart();
         addLabels();
         drawLegend();
       })

    //Calculates the scales and axis for the graph.
    function getScales() {

        //Calculates the placement of the bars in the bar graph.
        xScale = d3.scaleLinear()
                    .domain([d3.min(dataSet, (d) => d.Year) - 1, d3.max(dataSet, (d) => d.Year) + 1])
                    .range([wpadding, w - wpadding])
        
        //Calculates the height of the bars in the graph.
        yScale = d3.scaleTime()
                          .domain([d3.min(dataSet, (d) => new Date(d.Seconds * 1000)), d3.max(dataSet, (d) => new Date(d.Seconds * 1000))])
                          .range([0, h - (2 * hpadding)]);

        //Calculates and defines the y-scale.
        yAxisScale = d3.scaleTime()
                       //.domain([d3.min(dataSet, (d) => d.Seconds), d3.max(dataSet, (d) => d.Seconds)])
                       .domain([d3.max(dataSet, (d) => new Date(d.Seconds * 1000)), d3.min(dataSet, (d) => new Date(d.Seconds * 1000))])
                       .range([0, (2 * hpadding) - h])

        
        //Calculates the x-axis using the minimum value of the data.
        xAxisScale = d3.scaleLinear()
                        .domain([d3.min(dataSet, (d) => d.Year) - 1, d3.max(dataSet, (d) => d.Year) + 1])
                        .range([wpadding, w - wpadding])
    }

//Draws the axis onto the graph.
function drawAxis() {
      //Retrieves the axis definitions from the scales calculated earlier.
      yAxis = d3
          .axisLeft(yAxisScale)
          .tickFormat(d3.timeFormat('%M:%S'))
      xAxis = d3.axisBottom(xAxisScale)
                .tickFormat(d3.format('d'))
              

      //Draws the y-axis and places it at the left.
      svg.append("g")
          .attr("id", "y-axis")
          .attr("class", "axis-label")
          .attr("transform", "translate(" + wpadding + ", " + (h - hpadding) + ")")
          .call(yAxis)
      
      //Draws the x-axis and places it at the bottom.
      svg.append("g")
          .attr("id", "x-axis")
          .attr("class", "axis-label")
          .attr("transform", "translate(0, " + (h - hpadding) + ")")
          .call(xAxis)
}

function drawTooltip() {
  //Adds the tooltip element to the graph.
  let tooltip = d3.select("#graph")
    .append("div")
    .attr("id", "tooltip")
    .style("visibility", "hidden")

    //Function called when mouse is over the element. Makes the tooltip visible.
    mouseover = () => {
      tooltip.style("visibility", "visible")
    }

    //Function called when mouse is not over any element. Makes the tooltip invisible.
    mouseleave = () => {
      tooltip.style("visibility", "hidden")
    }

    //Function called when mouse is over a specific bar. Changes the text of the tooltip to use the bar's data values.
    mousemove = (event, d) => {
      
      tooltip.html(d.Name + ": " + d.Nationality + "<br />" + "Year: " + d.Year + ", Time: " + d.Time + "<br>" + d.Doping)
              .attr("data-year", d.Year)
              .style("left", (event.pageX) + "px")
              .style("top", (event.pageY) + "px")          
    }
}

//Draws the chart based off of the data fetched earlier.
function drawChart() {
    //Adds the singular rectancle elements to the svg graph and changes their size and placement based off the dataSet's values.
    svg.selectAll("circle")
          .data(dataSet)
          .enter()
          .append("circle")
          .attr("class", "dot")
          .attr("data-xvalue", (d) => d.Year)
          .attr("data-yvalue", (d) => new Date(d.Seconds * 1000))
          .attr("cy", (d) => yScale(new Date(d.Seconds * 1000)) + hpadding)
          .attr('r', 5)
          .attr("cx", (d) => xScale(d.Year))
          .attr("style", (d) => {
            if(d.Doping === "") {
              return "fill: orange"
            }
            else {
              return "fill: blue"
            }
          })
          .on("mousemove", mousemove)
          .on("mouseleave", mouseleave)
          .on("mouseover", mouseover)
}

function addLabels() {
  //Appends a label for the x-axis to know what data its telling.
  svg.append("text")
  .attr("id", "x-axis-label")
  .attr("x", (w / 2) )
  .attr("y", (h - hpadding + 45) )
  .style("text-anchor", "middle")
  .text("Year")
  .attr("class", "axis-label")

//Appends the y-axis label.
svg.append("text")
  .attr("id", "y-axis-label")
  .attr("x", -h/6 + "px" )
  .attr("y", wpadding + 20 + "px" )
  .style("text-anchor", "middle")
  .text("Time in Minutes")
  .style("transform", "rotate(270deg)")
  .attr("class", "axis-label")

  //This adds the title text. 
  svg.append("text")
      .attr("id", "title")
      .attr("x", w / 2 + "px")
      .attr("y", hpadding / 1.5 + "px")
      .style("text-anchor", "middle")
      .text("Doping in Professional Bicycle Racing")
}

function drawLegend() {

  const legend = svg.append("svg")
    .attr("id", "legend")
    .attr("x", w/1.5)
    .attr("y", h/4)

  legend.append("rect")
    .attr("width", "20px")
    .attr("height", "20px")
    .attr("fill", "blue")
    .attr("class", "legendbox")

  legend.append("text")
    .text("Riders with doping allegations")
    .attr("x", 30)
    .attr("y", 15)
    .attr("class", "legend-text")

  legend.append("rect")
    .attr("width", "20px")
    .attr("height", "20px")
    .attr("fill", "orange")
    .attr("y", 30)
    .attr("class", "legendbox")

  legend.append("text")
    .text("No doping allegations")
    .attr("x", 30)
    .attr("y", 45)
    .attr("class", "legend-text")
}


      
      