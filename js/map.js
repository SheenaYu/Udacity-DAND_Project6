!(function (d3) {

$("acontent").empty();

var width = 1000,
    height = 500;

//var terror_data;
var parseDate = d3.time.format("%e-%b-%y").parse;
var formatTime = d3.time.format("%B %d, %Y");

// arrange the layout the visualization
d3.select("#a_tab h1")
    .style("position", "absolute")
    .style("top", "100px")
    .style("left", "250px")

d3.select("acontent").append("p")
    .attr("id", "intro")
    .html("Click the play button to see the animation."+ "<br/>" +
          "Click the pause button to investigate the details of terrorist attacks of a particular year."+
          "<br/>" +"Circle size represents the number of casualties in the terrorist attack.")
    .style("position", "absolute")
    .style("top", "150px")
    .style("left", "260px");

d3.select("acontent").append("div")
    .attr("id", "slider");

d3.select("acontent").append("p")
    .attr("id", "hint");

d3.select("acontent").append("div")
    .attr("id", "vis")
    .style("position","absolute")
    .style("top", "260px")
    .style("left","100px");

d3.select("acontent")
  .append("p")
    .attr("id", "ref")
    .html("Source: Global Terrorism Database" + "<br/>" +
         "Acknowledgement: National Consortium for the Study of Terrorism and Responses to Terrorism (START)." + "<br/>"
         + "Retrieved from https://www.kaggle.com/START-UMD/gtd")
    .style("position", "absolute")
    .style("top", "800px")
    .style("left", "250px");

// Ordinal color scale
var fill = d3.scale.ordinal()
    .domain(["No", "Yes"])
    .range([ "#6CA9D6", "#F29319"]);

// set projection
var projection = d3.geo.albersUsa()
    .translate([width/2, height/2])    // translate to center of screen
    .scale([1000]); 

// create path variable
var geoPath = d3.geo.path( ).projection( projection );

// Define Zoom Function Event Listener
function zoomFunction() { 
  d3.select("#map")
    .attr("transform", "translate(" + d3.event.translate + ") scale (" + d3.event.scale + ")");
};

// Define Zoom Behavior
var zoom = d3.behavior.zoom()
    .scaleExtent([1, 4])
    .on("zoom", zoomFunction);

// Define tooltip functions
var tip = d3.tip()
    .attr('class', 'd3-tip')
    .direction('e')
    .offset([40, 5])
    .html(function(d) {
      return "<strong>Date: </strong>" + formatTime(d.date) + 
      "<br/>" + "<strong>State: </strong>" + d.state +"<br/>" + 
      "<strong>City: </strong>" + d.city + "<br/>" + "<strong>Attack Type: </strong>" 
      + d.attack_type +"<br/>" + "<strong>Weapon: </strong>" + d.weapon +"<br/>"+ 
      "<strong>Target: </strong>" + d.target +"<br/>"+ "<strong>Group: </strong>" + 
      d.group +"<br/>"+ "<strong>Fatalities: </strong>" + d.fatalities +"<br/>"+ 
      "<strong>Injuries: </strong>" + d.injuries + "<br/>" + "<strong>Summary: </strong>" + d.summary;
    })

// create svg variable
var svgContainer = d3.select( "#vis" )
  .append( "svg" )
    .attr( "width", width )
    .attr( "height", height )
    .call(tip); 
                     
// Define group for both the map and dots
var mapGroup = svgContainer.append("g")
    .attr("id", "map")
    .call(zoom);

// Define the div for the tooltip
var div = d3.select("#vis").append("div")   
    .attr("class", "tooltip");          


// define legend
var legendRectSize = 15, legendSpacing = 5;

var legendTitle = svgContainer.append("g")
    .attr("transform", "translate(" + (width-320) +","+ (height-460) + ")")
  .append("text")
    .attr("class", "legendText")
    .attr("font-family", "sans-serif")
    .attr("font-size", "13px")
    .text("Any fatalities?");

var legend = svgContainer
  .append("g")
    .attr("transform", "translate(" + (width - 300) + "," + (height - 450) + ")" )
    .selectAll("g")
    .data(fill.domain())
    .enter()
  .append("g")
    .attr("class", "legend")
    .attr('transform', function(d, i) {
      var height = legendRectSize;
      var x = 0;
      var y = i * 20 + 5;
      return 'translate(' + x + ',' + y + ')';
    });

legend.append('rect')
    .attr('width', legendRectSize)
    .attr('height', legendRectSize)
    .style('fill', fill)
    .style('stroke', fill);

legend.append('text')
    .attr('x', legendRectSize + legendSpacing)
    .attr('y', legendRectSize - 2)
    .attr("class", "legendText")
    .text(function(d) { return d; })
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px");
              
// Create a slider to provide a more granular way to investigate the terror attacks by year
var startYear = 1970,
    endYear = 2015,
    currentYear = startYear;

// Load data
d3.json("data/us-states.json", function (error, json) {
    if (error) return console.warn(error);

    mapGroup.append("path")
        .attr("d", geoPath(json))
        .style("fill", "#d9d9d9")
        .style("stroke", "#fff")
        .style("stroke-width", "1");

    function plot_points( data ) {
        // Clean data formats
        data.forEach(function(d) {
            d.date = parseDate(d.date);
            d.year = +d.year;
            d.longitude = +d.longitude;
            // Add jitter to avoid overplot in D3
            d.latitude = +d.latitude; //+ Math.random();
            d.longitude = +d.longitude; //+ Math.random()*0.5;
            d.fatalities = +d.fatalities;
            d.injuries = +d.injuries;
            d.totalVictims = d.fatalities + d.injuries; // The new "total victims" column
            if (d.fatalities === 0) { return d.anyFatalities = "No"; } 
            else { return d.anyFatalities = "Yes"; }; // Identify whether or not the terror attacks caused any fatalities
        });

        var totalVictims_max = d3.max( data, function( d ) {
            return d.totalVictims;
        });

        var radius = d3.scale.sqrt( ).domain( [ 0, totalVictims_max ] ).range( [ 3, 20 ] );

        // Define update function to filter data by year
        function update() {
            var filtered = data.filter(function(d) {
              return d.year === currentYear;
            });

            // Update the hint message by year
            d3.select('#hint')
              .text(" Terrorist Attacks in " + currentYear);

            // Append circles on the map
            var circles = mapGroup.selectAll('circle')
                .data( filtered ).enter()
              .append('circle')
                .attr('class', 'circles')
                .style( "fill", function(d) { return fill(d.anyFatalities); } )
                .style( 'stroke', 'grey' )
                .style( 'stroke-width', 0.3 )
                .style("opacity", 0)
                .attr( 'cx', function( d ) {
                    return projection([+d.longitude, +d.latitude])[ 0 ];
                })
                .attr( 'cy', function( d ) {
                    return projection([+d.longitude, +d.latitude])[ 1 ];
                })
                .attr( 'r', function( d ) {
                    return radius( +d.totalVictims);
                })
                .transition()
                .style("opacity", 0.5)
                .duration(200)
        };
        
        // Create a slider to play the animation
        var myslider =  chroniton()
            .domain([new Date(startYear, 1, 1), new Date(endYear, 1, 1)])
            .labelFormat(function(date) {
                return date.getFullYear();  
            })
            .width(800)
            .on("change", function(date) {
              var newYear = date.getFullYear();
              if (newYear != currentYear) { 
                currentYear = newYear;
                mapGroup.selectAll('circle').remove();
                update(); // Call the update function
                mapGroup.selectAll('circle')
                    .on("mouseover", function(d) {
                      tip.show(d);
                      d3.select(this).style('stroke', 'white').style('stroke-width', 2);
                    }) 
                    .on("mouseout", function(d) {
                      tip.hide(d);
                      d3.select(this).style('stroke', 'grey').style('stroke-width', 0.3)
                    });
              }
            })
            .keybindings(true)
            .playButton(true)
            .playbackRate(0.2)

        d3.select("#slider").call(myslider);
    };

    d3.csv( "data/terrorism_usa.csv", plot_points );
});

}) (d3);
