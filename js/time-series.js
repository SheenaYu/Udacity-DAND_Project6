!(function (d3) {

$("bcontent").empty();

var margin = {top: 80, right: 200, bottom: 20, left: 150},
    width = 1060 - margin.left - margin.right,
    height = 570 - margin.top - margin.bottom;

// Move the title and introduction to appropriate position
d3.select("#b_tab h1")
    .style("position", "absolute")
    .style("top", "100px")
    .style("left", "150px")

d3.select("bcontent").append("p")
    .attr("id", "intro2")
    .html("Hover over the line chart to see the exact number of terrorist attacks in a particular year on the right."+ "<br/>" +
          "Click the grey box on the right to select a state, click again to deselect the state."+
          "<br/>" +"You can select multiple states at a time.")
    .style("font-style", "italic")
    .style("position", "absolute")
    .style("top", "150px")
    .style("left", "160px");

var parseYear = d3.time.format("%Y").parse,
    formatYear = d3.time.format("%Y");

var bisectYear = d3.bisector(function(d) { return d.year; }).left;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

// Define color scale
var color = d3.scale.ordinal()
    .range(["#3957ff", "#d3fe14", "#c9080a", "#fec7f8", "#0b7b3e", "#0bf0e9", "#c203c8", "#fd9b39", 
    "#888593", "#906407", "#98ba7f", "#fe6794", "#10b0ff", "#ac7bff", "#fee7c0", "#964c63", "#1da49c", 
    "#0ad811", "#bbd9fd", "#fe6cfe", "#297192", "#d1a09c", "#78579e", "#81ffad", "#739400", "#ca6949", 
    "#d9bf01", "#646a58", "#d5097e", "#bb73a9", "#ccf6e9", "#9cb4b6", "#b6a7d4", "#9e8c62", "#6e83c8", 
    "#01af64", "#a71afd", "#cfe589", "#d4ccd1", "#fd4109", "#bf8f0e", "#2f786e", "#4ed1a5", "#d8bb7d", 
    "#a54509", "#6a9276", "#a4777a", "#fc12c9", "#606f15", "#3cc4d9", "#f31c4e"])

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .interpolate("monotone")
    .x(function (d) { return x(d.year); })
    .y(function (d) { return y(d.numberOfAttacks); });

var maxY; // Defined later to update yAxis

var svg = d3.select("bcontent").append("svg")
    .attr("width",  width  + margin.left + margin.right)
    .attr("height", height + margin.top  + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Create invisible rect for mouse tracking
svg.append("rect")
    .attr("width", width)
    .attr("height", height)                                    
    .attr("x", 0) 
    .attr("y", 0)
    .attr("id", "mouse-tracker")
    .style("fill", "white");


//Load the data
d3.csv("data/time_series_by_state.csv", function (error, data) {

    var varNames = d3.keys(data[0]).filter(function (key) { return key !== 'year';});
    color.domain(varNames);

    // Change data formats
    data.forEach(function(d) {
      d.year = parseYear(d.year);
    })
    
    // Reformat the data 
    var seriesData = varNames.map(function (name) {
      return {
        name: name,
        values: data.map(function (d) {
          return {
            year: d.year, 
            numberOfAttacks: +(d[name]),
          };
        }),
        visible: (name === "California" ? true : false)
      };
    });

    x.domain(d3.extent(data, function(d) { return d.year; }));

    y.domain([0,
      d3.max(seriesData, function (c) { 
        return d3.max(c.values, function (d) { return d.numberOfAttacks; });
      })]
    );

    // Draw line graph
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height) + ")")
        .call(xAxis)
        .selectAll("text")  
        .style("text-anchor", "middle")
        .style("font-size", "10px")
        .style("font-family", "sans-serif")
        .attr("dx", "-.2em")
        .attr("dy", "1em");
      
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", -230)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Number of Terrorist Attacks");

    // Draw grid lines
    svg.append("g")         
      .attr("class", "grid")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis
          .tickSize(-height, 0, 0)
          .tickFormat("")
      )

    // Draw the lines
    var series = svg.selectAll(".series")
        .data(seriesData)
        .enter()
      .append("g")
        .attr("class", "series");

    series.append("path")
      .attr("class", "line")
      .attr("id", function(d) {
        return "line-" + d.name;
      })
      .attr("d", function (d) { 
        return d.visible ? line(d.values) : null; 
      })
      .style("stroke", function (d) { 
        return color(d.name); 
      });
    
      // draw legend
      var legendSpace = 500 / 51;     

      series.append("rect")
          .attr("width", 7)
          .attr("height", 7)                                    
          .attr("x", width + (margin.right/3)) 
          .attr("y", function (d, i) { return (legendSpace)+i*(legendSpace) - 8; })  // spacing
          .attr("fill",function(d) {
            return d.visible ? color(d.name) : "#F1F1F2"; // If array key "visible" = true then color rect, if not then make it grey 
          })
          .attr("class", "legend-box")
          .on("click", function(d) { // On click make d.visible 
            d.visible = !d.visible; // If array key for this data selection is "visible" = true then make it false, if false then make it true

            maxY = findMaxY(seriesData); // Find max Y rating value categories data with "visible"; true
            y.domain([0,maxY]); // Redefine yAxis domain based on highest y value of categories data with "visible"; true
            svg.select(".y.axis")
                .transition()
                .call(yAxis);   

            series.select("path")
                .transition()
                .attr("d", function(d){
                  return d.visible ? line(d.values) : null; // If d.visible is true then draw line for this d selection
                })

            series.select("rect")
                .transition()
                .attr("fill", function(d) {
                return d.visible ? color(d.name) : "#F1F1F2";
              });
          })

          .on("mouseover", function(d) {
            d3.select(this)
                .transition()
                .attr("fill", function(d) { return color(d.name); });

            d3.select("#line-" + d.name)
                .transition()
                .style("stroke-width", 2.5);  
          })

          .on("mouseout", function(d) {
              d3.select(this)
                  .transition()
                  .attr("fill", function(d) {
                  return d.visible ? color(d.name) : "#F1F1F2";});

              d3.select("#line-" + d.name)
                  .transition()
                  .style("stroke-width", 1.5);
          })

        series.append("text")
            .attr("x", width + (margin.right/3) + 15) 
            .attr("y", function (d, i) { return (legendSpace)+i*(legendSpace); }) 
            .text(function(d) { return d.name; }); 

        // Hover line 
        var hoverLineGroup = svg.append("g") 
            .attr("class", "hover-line");

        var hoverLine = hoverLineGroup // Create line with basic attributes
          .append("line")
            .attr("id", "hover-line")
            .attr("x1", 10).attr("x2", 10) 
            .attr("y1", 0).attr("y2", height + 10)
            .style("pointer-events", "none") // Stop line interferring with cursor
            .style("opacity", 1e-6); // Set opacity to zero 

        var columnNames = d3.keys(data[0]).slice(1); 

        var focus = series.select("g") // create group elements to house tooltip text
            .data(columnNames) // bind each column name date to each g element
            .enter()
          .append("g") //create one <g> for each columnName
            .attr("class", "focus"); 

        focus.append("text") 
            .attr("class", "ts-tooltip")
            .attr("x", width + 20) // position tooltips  
            .attr("y", function (d, i) { return (legendSpace)+i*(legendSpace); });       

        // Add mouseover events for hover line.
        d3.select("#mouse-tracker") // select chart plot background rect #mouse-tracker
            .on("mousemove", mousemove) // on mousemove activate mousemove function defined below
            .on("mouseout", function() {
                d3.select("#hover-line")
                  .style("opacity", 1e-6); // On mouse out making line invisible
            });

        function mousemove() { 
          var mouse_x = d3.mouse(this)[0]; // Finding mouse x position on rect
          var graph_x = x.invert(mouse_x); 
          
          d3.select("#hover-line") // select hover-line and changing attributes to mouse position
              .attr("x1", mouse_x) 
              .attr("x2", mouse_x)
              .style("opacity", 1); // Making line visible

          // Legend tooltips 
          var x0 = x.invert(d3.mouse(this)[0]), 
              i = bisectYear(data, x0, 1), // Find the index of our data array 
              d0 = data[i - 1],
              d1 = data[i],
              /*d0 is the combination of Year and numberOfAttacks that is in the data array at the index to the left of the cursor 
              and d1 is the combination of Year and numberOfAttacks that is in the data array at the index to the right of the cursor.*/
              d = x0 - d0.year > d1.year - x0 ? d1 : d0; //d is now the data row for the year closest to the mouse position
              focus.select("text").text(function(columnName){
                return (formatYear(d.year) + ": " + d[columnName]);
              });
        }; 
});
        
function findMaxY(data) {  // Define function "findMaxY"
  var maxYValues = data.map(function(d) { 
    if (d.visible) {
      return d3.max(d.values, function(value) { // Return max rating value
        return value.numberOfAttacks; })
    }
  });
  return d3.max(maxYValues);
};

}) (d3);