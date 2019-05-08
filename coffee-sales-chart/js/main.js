// **** Your JavaScript code goes here ****
//NOTE: this is the D3 v4 loading syntax. For more details, see https://piazza.com/class/jnzgy0ktwi34lk?cid=75.

var coffee_data = d3.csv("./data/coffee_data.csv", function(data){

	//console.log(data);

	var barHeight = 500;

	data.forEach(function (d) {
		d.sales =+ d.sales;
	});

	var regions = d3.nest()
		.key(function (d) {return d.region})
		.rollup(function(v) {return d3.sum(v, function(d) {return d.sales;}); })
		.entries(data);
	console.log(regions);

	var categories = d3.nest()
		.key(function (d) {return d.category})
		.rollup(function(v) {return d3.sum(v, function(d) {return d.sales;}); })
		.entries(data);
	console.log(categories);

	//grab svg from index.html
	var svgRegions = d3.select("svg")
	var svgCategories = d3.select("svg")

	var x = d3.scaleOrdinal()
		.domain(["Central", "East", "South", "West"])
		.range([100, 150, 200, 250]);

	var x2 = d3.scaleOrdinal()
		.domain(["Coffee", "Tea", "Espresso", "Herbal Tea"])
		.range([450, 500, 550, 600]);

	var color = d3.scaleOrdinal()
		.domain(["Central", "East", "South", "West"])
		.range(["#3498DB", "#E74C3C", "#27AE60", "#E67E22"]);

	var color2 = d3.scaleOrdinal()
		.domain(["Coffee", "Tea", "Espresso", "Herbal Tea"])
		.range(["#6E2C00", "#F1C40F", "#C70039", "#1ABC9C "]);

	var y = d3.scaleLinear()
		.domain([0, d3.max(regions, function(d){
			return +d.value;})])
		.range([500,100]);

	var y2 = d3.scaleLinear()
		.domain([0, d3.max(categories, function(d){
			return +d.value;})])
		.range([500,100]);

	var xAxis = d3.axisBottom()
		.scale(x);

	var xAxis2 = d3.axisBottom()
		.scale(x2);

	var yAxis = d3.axisLeft()
		.scale(y);

	var yAxis2 = d3.axisLeft()
		.scale(y2);

	svgRegions.append('g')
		.attr("class", "x axis")
		.call(xAxis)
		.attr("transform", "translate (56 510)")
		.call(g=> g.select(".domain").remove());

	svgRegions.append('g')
		.attr("class", "y axis")
		.call(yAxis)
		.attr("transform", "translate(120)")

	svgRegions.append("text")
		.attr("transform", "translate(200, 70)")
		.attr("font-family", "Lucida Console")
		.attr("font-size", "18px")
		.style("text-anchor", "middle")
		.text("Coffee Sales by Region (USD)");

	svgRegions.append("text")
		.attr("transform", "translate(220, 560)")
		.style("text-anchor", "middle")
		.attr("font-family", "Lucida Console")
		.text("Region");

	svgRegions.append("text")
		.attr("transform", "rotate(-90)")
		.attr("x", -300)
		.attr("y", 50)
		.style("text-anchor", "middle")
		.attr("font-family", "Lucida Console")
		.text("Coffee Sales (USD)");

	svgCategories.append('g')
		.attr("class", "x axis")
		.call(xAxis2)
		.attr("transform", "translate (56 510)")
		.call(g=> g.select(".domain").remove());

	svgCategories.append('g')
		.attr("class", "y axis")
		.call(yAxis2)
		.attr("transform", "translate(470)")

	svgCategories.append("text")
		.attr("transform", "translate(550, 70)")
		.attr("font-family", "Lucida Console")
		.attr("font-size", "18px")
		.style("text-anchor", "middle")
		.text("Coffee Sales by Product (USD)");

	svgCategories.append("text")
		.attr("transform", "translate(550, 560)")
		.style("text-anchor", "middle")
		.attr("font-family", "Lucida Console")
		.text("Product");

	svgCategories.append("text")
		.attr("transform", "rotate(-90)", "translate(500, 0)")
		.attr("x", -300)
		.attr("y", 400)
		.style("text-anchor", "middle")
		.attr("font-family", "Lucida Console")
		.text("Coffee Sales (USD)");

	//draw the chart
	chartRegions = svgRegions.append('g').attr("class", "x axis")
		.selectAll("bar")
		.data(regions)
		.enter()
		.append('rect')
		.attr('x', function (d) {return x(d.key);})
		.attr('y', function(d) {return y(d.value);})
		.attr("transform", "translate(35)")
		.attr("width", 41)
		.attr("height", function (d) {return 500 - y(d.value);})
		.style("fill", function (d) {return color(d.value);})

	//draw the chart
	chartCategories = svgCategories.append('g').attr("class", "x axis")
		.selectAll("bar")
		.data(categories)
		.enter()
		.append('rect')
		.attr('x', function (d) {return x2(d.key);})
		.attr('y', function(d) {return y2(d.value);})
		.attr("transform", "translate(35)")
		.attr("width", 41)
		.attr("height", function (d) {return 500 - y2(d.value);})
		.style("fill", function (d) {return color2(d.value);})
})