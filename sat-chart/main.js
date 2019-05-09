var width = 500;
var height= 500;

d3.csv("calvinCollegeSeniorScores.csv", function(csv) {
    for (var i=0; i<csv.length; ++i) {
    csv[i].GPA = Number(csv[i].GPA);
    csv[i].SATM = Number(csv[i].SATM);
    csv[i].SATV = Number(csv[i].SATV);
    csv[i].ACT = Number(csv[i].ACT);
    }
    var satmExtent = d3.extent(csv, function(row) { return row.SATM; });
    var satvExtent = d3.extent(csv, function(row) { return row.SATV; });
    var actExtent = d3.extent(csv,  function(row) { return row.ACT;  });
    var gpaExtent = d3.extent(csv,  function(row) {return row.GPA;   });    

    
    var satExtents = {
  "SATM": satmExtent,
  "SATV": satvExtent,
  "GPA": gpaExtent,
  "ACTA": actExtent
    }; 


    // Axis setup
    var xScale = d3.scaleLinear().domain(satmExtent).range([50, 470]);
    var yScale = d3.scaleLinear().domain(satvExtent).range([470, 30]);
 
    var xScale2 = d3.scaleLinear().domain(actExtent).range([50, 470]);
    var yScale2 = d3.scaleLinear().domain(gpaExtent).range([470, 30]);
     
    var xAxis = d3.axisBottom().scale(xScale);
    var yAxis = d3.axisLeft().scale(yScale);
  
    var xAxis2 = d3.axisBottom().scale(xScale2);
    var yAxis2 = d3.axisLeft().scale(yScale2);


    //Create SVGs for charts
    var chart1 = d3.select("#chart1")
                  .append("svg:svg")
                  .attr("width",width)
                  .attr("height",height);


    var chart2 = d3.select("#chart2")
                  .append("svg:svg")
                  .attr("width",width)
                  .attr("height",height);

    // Create a <g> element inside chartG as the brush container. This is to ensure that
//    The brush comes first in the HTML (before the dots) and thus is behind the dots (the <circle>s),
//    which is desirable because by being behind the dots the brush does not occlude the dots
//    or prevent certain mouse interaction with the dots to work.
    var brushContainer = chart1.append('g')
              .attr('id', 'brush-container');

    var brushContainer2 = chart2.append('g')
              .attr('id', 'brush-container2');
  

  /*ADD BRUSHING CODE HERE*/
    brush = d3.brush()
    brush2 = d3.brush()

    brush2
        .on("start", handleBrushStart2)   // when mousedown&dragging starts 
        .on("brush", handleBrushMove2)          // when dragging
        .on("end", handleBrushEnd2);      // when mouseup


    brush
        .on("start", handleBrushStart)   // when mousedown&dragging starts 
        .on("brush", handleBrushMove)          // when dragging
        .on("end", handleBrushEnd);      // when mouseup


    brushContainer.call(brush);
    brushContainer2.call(brush2);

    function handleBrushStart() {
    	brush2.move(brushContainer2, null);
		chart2.selectAll('circle').classed("dot--selected", false);
		chart1.selectAll('circle').classed("dot--selected", false);
		//  brushContainer2.call(brush2.clear());
    }

    function handleBrushMove() {
    	chart1.classed("selected2", false);
    	chart2.classed("selected2", false);
        // simultaneous update during brushing
        var sel = d3.event.selection;
        if (!sel) {
        	// sel is null when we clear the brush
        	return;
        }        

          // Get the boundaries.
  		var [[left, top], [right, bottom]] = sel;
  		console.log({left, top, right, bottom}) 

  		chart2.selectAll('circle')
    	.classed('dot--selected', function(d) {
      	var cx = xScale(d['SATM']);
      	var cy = yScale(d['SATV']);
      	return left <= cx && cx <= right && top <= cy && cy <= bottom;
    	});
	    }

    function handleBrushEnd() {
        // update after brusing is finished
        // chart2.selectAll("circle").data(sel).transition().style("fill", "yellow");
        chart1.classed("selected2", false);
    	chart2.classed("selected2", false);
    }

     function handleBrushStart2() {
        brush.move(brushContainer, null);
        chart1.selectAll('circle').classed("dot--selected", false);
        chart2.selectAll('circle').classed("dot--selected", false);
        // brushContainer.call(brush.clear());


    }

    function handleBrushMove2() {
    	chart1.classed("selected2", false);
    	chart2.classed("selected2", false);
                // simultaneous update during brushing
        var sel = d3.event.selection;
        if (!sel) {
        	// sel is null when we clear the brush
        	return;
        }        

          // Get the boundaries.
  		var [[left, top], [right, bottom]] = sel;
  		console.log({left, top, right, bottom}) 


  		chart1.selectAll('circle')
    	.classed('dot--selected', function(d) {
      	var tx = xScale2(d['ACT']);
      	var ty = yScale2(d['GPA']);
      	return left <= tx && tx <= right && top <= ty && ty <= bottom;
    	});
    }

    function handleBrushEnd2() {
        // update after brusing is finished
        chart1.classed("selected2", false);
    	chart2.classed("selected2", false);
    }



  //add scatterplot points
    var temp1= chart1.selectAll("circle")
     .data(csv)
     .enter()
     .append("circle")
     .attr("id",function(d,i) {d.id = i; return i;} )
     .attr("stroke", "black")
     .attr("cx", function(d) { return xScale(d.SATM); })
     .attr("cy", function(d) { return yScale(d.SATV); })
     .attr("r", 5)
     .on("click", function(d,i){ 
          d3.select("#chart3").select("#SATM").html("")
        d3.select("#chart3").select("#satm")
        .text(d.SATM);
          d3.select("#chart3").select("#SATV").html("")
        d3.select("#chart3").select("#satv")
        .text(d.SATV);
        d3.select("#chart3").select("#ACT").html("")
        d3.select("#chart3").select("#act")
        .text(d.ACT);
        d3.select("#chart3").select("#GPA").html("")
        d3.select("#chart3").select("#gpa")
        .text(d.GPA);

        var clickedid= d3.select(this).attr("id");

            chart1.selectAll('circle').classed("clicked",false);
      chart2.selectAll('circle').filter(function(e) {
        return e.id==d.id;
      })
      .classed("clicked",true);

      chart2.selectAll('circle').filter(function(e) {
        return e.id!=d.id;
      })
      .classed("clicked",false);
       });

    var temp2= chart2.selectAll("circle")
     .data(csv)
     .enter()
     .append("circle")
     .attr("id",function(d,i) {d.id = i; return i;} )
     .attr("stroke", "black")
     .attr("cx", function(d) { return xScale2(d.ACT); })
     .attr("cy", function(d) { return yScale2(d.GPA); })
     .attr("r", 5)
     .on("click", function(d,i){ 
          d3.select("#chart3").select("#SATM").html("")
        d3.select("#chart3").select("#satm")
        .text(d.SATM);
          d3.select("#chart3").select("#SATV").html("")
        d3.select("#chart3").select("#satv")
        .text(d.SATV);
        d3.select("#chart3").select("#ACT").html("")
        d3.select("#chart3").select("#act")
        .text(d.ACT);
        d3.select("#chart3").select("#GPA").html("")
        d3.select("#chart3").select("#gpa")
        .text(d.GPA);

        var clickedid= d3.select(this).attr("id");


          chart2.selectAll('circle').classed("clicked",false);

      chart1.selectAll('circle').filter(function(e) {
        return e.id==d.id;
      })
      .classed("clicked",true);

      chart1.selectAll('circle').filter(function(e) {
        return e.id!=d.id;
      })
      .classed("clicked",false);
       });
    

    chart1 // or something else that selects the SVG element in your visualizations
    .append("g") // create a group node
    .attr("transform", "translate(0,"+ (width -30)+ ")")
    .call(xAxis) // call the axis generator
    .append("text")
    .attr("class", "label")
    .attr("x", width - width/2)
    .attr("y", 30)
    .style("text-anchor", "end")
    .text("SATM")
    .style("fill", "black");

    chart1 // or something else that selects the SVG element in your visualizations
    .append("g") // create a group node
    .attr("transform", "translate(50, 0)")
    .call(yAxis)
    .append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("SATV")
    .style("fill", "black");

    chart2 // or something else that selects the SVG element in your visualizations
    .append("g") // create a group node
    .attr("transform", "translate(0,"+ (width -30)+ ")")
    .call(xAxis2)
    .append("text")
    .attr("class", "label")
    .attr("x", width - width/2)
    .attr("y", 30)
    .style("text-anchor", "end")
    .text("ACT")
    .style("fill", "black");

    chart2 // or something else that selects the SVG element in your visualizations
    .append("g") // create a group node
    .attr("transform", "translate(50, 0)")
    .call(yAxis2)
    .append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("GPA")
    .style("fill", "black");
  });
