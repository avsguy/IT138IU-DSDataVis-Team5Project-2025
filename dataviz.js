// dimensions for data viz
const margin = {top: 50, right: 25, bottom: 45, left: 50},
    width = 700 - margin.left - margin.right,
    height = 420 - margin.top - margin.bottom;

// LOADING DATA
const countryPath = "data/country.csv";
//const metricPath = "data/metric.csv";

const countryRow = function(d) {
    return {
        // CountryName,CountryCode,Region,IncomeGroup,
        // SpecialNotes,Date,UnempRate,avgRateperCountry
        name: d["CountryName"],
        code: d["CountryCode"],
        region: d["Region"],
        income: d["IncomeGroup"],
        x: d3.timeParse("%Y")(d["Date"]),
        y: +d["UnempRate"],       
        avg: +d["avgRateperCountry"]
        };
    };

// svgs
// tooltip Manager
var TooltipManager = {
    currentMapTooltip: null,
    currentBarTooltip: null,
    
    create: function(type) {
        this.destroy(); 
        if (type === 'map') {
            this.currentMapTooltip = d3.select("body")
            .append("div")
            .attr("class", "map-tooltip")
            .style("position", "absolute")
            .style("padding", "10px")
            .style("width", "150px")
            .style("height", "auto")
            .style("right", "20px")
            .style("z-index", "10000")
            .style("background", "rgb(57, 60, 63)")
            .style("border", "5px")
            .style("border-radius", "8px")
            .style("box-shadow", "0 2px 4px rgba(0,0,0,0.2)")
            .style("pointer-events", "none")
            .style("opacity", 0)
            .style("font-size", ".8em")
            .style("color", "white")
            .style("text-align", "center")
            .style("color", "white")
            .style("font-weight", "700");
        }
        if (type === 'bar') {
        this.currentBarTooltip = d3.select("body")
            .append("div")
            .attr("class", "bar-tooltip")
            .style("position", "absolute")
            .style("padding", "10px")
            .style("width", "150px")
            .style("height", "auto")
            .style("right", "20px")
            .style("z-index", "10000")
            .style("background", "rgb(57, 60, 63)")
            .style("border", "5px")
            .style("border-radius", "8px")
            .style("box-shadow", "0 2px 4px rgba(0,0,0,0.2)")
            .style("pointer-events", "none")
            .style("opacity", 0)
            .style("font-size", ".8em")
            .style("color", "white")
            .style("text-align", "center")
            .style("color", "white")
            .style("font-weight", "700");
        }
    },

    destroy: function() {
        d3.selectAll(".map-tooltip, .bar-tooltip").remove();
        this.currentMapTooltip = null;
        this.currentBarTooltip = null;
    },
    
    show: function(content, type) {
        if (type === 'bar') {
            this.currentBarTooltip
                .style("opacity", 1)
                .html(content);
        } else {
            this.currentMapTooltip
                .style("opacity", 0.9)
			    .style("stroke", "black")
                .html(content);
        }
    },
    
    hide: function() {
            this.currentBarTooltip
                .transition()
                .duration(1000)
                .style("opacity", 0);
            this.currentMapTooltip
                .transition()
                .duration(1000)
                .style("opacity", 0);
    },
    
    move: function(x, y, type) {
        if (type === 'bar') {
            this.currentBarTooltip
                .style("left", (x + 15) + "px")
                .style("top", (y - 15) + "px");
        } else {
            this.currentMapTooltip
                .style("left", (x+10) + "px")
                .style("top", (y) + "px");
        }
    }
};
            /*
const svgMetric = d3.select("#metrics")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
            */
const svgCountry = d3.select("#countries")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
const greenRect = svgCountry.append("rect")
    .attr("x", 0) 
    .attr("y", height-margin.bottom) 
    .attr("width", width) 
    .attr("height", (height/7))
    .attr("fill", "green")
    .attr("opacity", 0);
var svgMap = null;
const regionBar = svgCountry.append("g")
    .attr("class", "region-bar-chart")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .attr("opacity", 0);
const incomeBar = svgCountry.append("g")
    .attr("class", "income-bar-chart")
    .attr("opacity", 0);
var labelHover = svgCountry.append("text")
    .attr("class", "hover note")
    .attr("x", width / 2)
    .attr("y",  0)
    .attr("text-anchor", "middle")
    .style("font-size", "20px").attr("fill", "grey")
    .text("Hover over")
    .attr("opacity", 0);


// base line chart for countries
function drawLines(){
    d3.csv(countryPath, countryRow).then(data => {
        const allCountries = d3.group(data, d => d.name);
        
        const xScale = d3.scaleTime()
            .range([0, width])
            .domain(d3.extent(data, d => d.x));

        const yScale = d3.scaleLinear()
            .range([height, 0])
            .domain([0, d3.max(data, d => d.y)]);
        
        const line = d3.line()
            .x(d => xScale(d.x))
            .y(d => yScale(d.y))
            .curve(d3.curveMonotoneX);
        
        // Remove existing lines before drawing new ones
        svgCountry.selectAll(".line-group").remove();
        
        const lineGrp = svgCountry.selectAll(".line-group")
            .data(allCountries).enter().append("g")
            .attr("class", d => {
                let className = `line-group ${d[0].replace(/\s+/g, '-')}`;
                if (d[1][0].avg <= 5) {
                    className += ' low-unemployment';
                }
                return className;
            });
        
        lineGrp.append("path")
            .attr("class", function(d) {
                let className = "line";
                if (d[1][0].avg <= 5) {
                    className += "-low-unemployment";
                }
                return className;
            })
            .attr("d", function(d) { return line(d[1]); })
            .attr("fill", 'none');

        // Remove existing axes before creating new ones
        svgCountry.selectAll(".Xaxis, .Yaxis").remove();
        
        svgCountry.append("g")
            .attr("transform", `translate(0, ${height})`)
            .attr("class", "axis Xaxis")
            .call(d3.axisBottom(xScale));
        svgCountry.append("g")
            .attr("class", "axis Yaxis")
            .call(d3.axisLeft(yScale));
        
        // Animation for lines
        svgCountry.selectAll(".line, .line-low-unemployment")
            .each(function() {
                const totalLength = this.getTotalLength();
                d3.select(this).attr("stroke", "black")
                    .attr("stroke-dasharray", totalLength)
                    .attr("stroke-dashoffset", totalLength)
                    .transition()
                    .duration(2000)
                    .ease(d3.easeLinear)
                    .attr("stroke-dashoffset", 0);
            });
    });
}
// helper function to bring elements to the front
function front(element) {
    if (element.raise) {
        element.raise();
    } else {
        element.remove();
        svgCountry.node().appendChild(element.node());
    }
}
// function for increasing greenRect
function bigRect() {
    greenRect    
        .transition()
        .duration(1000)
        .attr("opacity", 1)
        .attr("y", 0)
        .attr("height", height);
}
// make green lines only chart
function greenLines() {
    bigRect();
    
    d3.csv(countryPath, countryRow).then(rdata => {
        const filteredData = rdata.filter(d => d.avg <= 5);

        const newXScale = d3.scaleTime()
            .range([0, width])
            .domain(d3.extent(filteredData, d => d.x));
        const newYScale = d3.scaleLinear()
            .range([height, 0])
            .domain([0, d3.max(filteredData, d => d.y)]);
        
        const line = d3.line()
            .x(d => newXScale(d.x))
            .y(d => newYScale(d.y))
            .curve(d3.curveMonotoneX);
        
        // group data by country
        const nested = d3.group(filteredData, d => d.name);
        
        svgCountry.selectAll(".line, .line-low-unemployment")
            .attr("opacity", 0);
        
        const lineGrp2 = svgCountry.selectAll("line-group green-line")
            .data(nested)
            .enter()
            .append("g")
            .attr("class", "line-group green-line");
        const path = lineGrp2.append("path")
            .attr("class", "line green-line")
            .attr("d", d => line(d[1]))
            .attr("fill", "none")
            .attr("stroke", d => {
                return d[1][0].avg <= 5 ? "green" : "#ccc";
            })
            .attr("opacity", 0)
            .transition()
            .duration(1000)
            .attr("opacity", 1);
        
        path
        .transition()
            .duration(500)
        .attr("stroke", "black");

        svgCountry.select(".Yaxis")
            .transition()
            .duration(1000)
            .call(d3.axisLeft(newYScale))
            .attr("class", "axis newYaxis");

        front(svgCountry.select(".Yaxis"));
    });

}
// make map
function showMap() {
TooltipManager.create('map');

 svgMap = svgCountry.append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("opacity", 0);

    svgCountry.selectAll(".line, .green-line, .line-group")
            .attr("opacity", 0);
    front(greenRect);

    svgMap    
    .transition()
        .delay(1000) 
        .duration(1000).attr("opacity", 1);
    front(svgMap);

		var g = svgMap.append("g");
		var projection = d3.geoNaturalEarth1()
            .scale([100])
            .translate([width / 2, height / 2]);
		var path = d3.geoPath()
			.projection(projection);
		var color = d3.scaleSequential(t => d3.interpolateGreens(1-t));
		var colorScale = d3.scaleQuantize()
			.range(d3.quantize(color, 5));

		console.log("Starting data load...");

		Promise.all([
			d3.csv("data/country.csv"), 
			d3.json("data/countries.geojson")
		])
		.then(([data, json]) => {
			data.forEach(d => {
				d.code = d["CountryCode"];
				d.avg = +(d["avgRateperCountry"]);
			});
            const filteredData = data.filter(d => d.avg <= 5);
            if (filteredData.length > 0) {
                colorScale.domain([
                    d3.min(filteredData, d => d.avg), 
                    d3.max(filteredData, d => d.avg)
                ]);
            } else {
                // If no data <= 5, set a default domain
                colorScale.domain([0, 1]);
            }

			console.log("Color domain:", colorScale.domain());

			data.forEach(d => {
				const code = d.code; // check if data code is same with json code
				const val = d.avg; // put in json features
				const country = d["CountryName"];
                const feat = json.features.find(f => (
                    f.id||f.properties["ISO3166-1-Alpha-3"]) === code);
                if (feat) {
                    feat.properties.value = val; // add in json
					feat.properties.name = country; // replace with data names
				}
			});

			g.selectAll("path")
			.data(json.features)
			.enter()
			.append("path")
			.attr("d", path)
			.style("fill", d => {
                const value = d.properties.value;
                if (value !== undefined && value <= 5) {
                    return colorScale(value);
                } else {
                    return "#ccc"; // Gray for countries with avg > 5 or no data
                }
            })
			.on("mouseover", (event, d) => {
				d3.select(event.currentTarget)
				    .transition()
				    .duration(200)
				    .style("stroke", "blue")
				    .attr("stroke-width", 0.4);
                TooltipManager.show(
                    `${d.properties.name || 'Unknown'}: 
                    <b>${d.properties.value || 'Not Available'}</b>`,
                        'map'
                );
			})
			.on("mousemove", (event) => {
                TooltipManager.move(event.pageX, event.pageY, 'map');
        	})
        	.on("mouseout", (event) => {
                d3.select(event.currentTarget)
                    .transition()
                    .duration(200)
                    .style("stroke","transparent");

        	});

		}).catch(err => console.error(err));

}
// utility function for opacity
function toggleElementOpacity(element, duration, opacity){
    element
        .transition()
        .duration(duration)
            .style("opacity", opacity)
}
// green rect
function showRect() {
    front(greenRect);
    greenRect
        .transition()
        .duration(1000)
        .attr("opacity", 0.5)
        .attr("y", height-margin.bottom)
        .attr("height", height/7);
    front(greenRect);
}
// make bar chart
function createBars() {

    TooltipManager.create('bar');

    d3.csv(countryPath, countryRow).then(rdata => {
        const filteredData = rdata.filter(d => d.avg <= 5);
        // get unique countries in filteredData
        const uniqueCountries = new Map();
        filteredData.forEach(d => {
            if (!uniqueCountries.has(d.name)) {
                uniqueCountries.set(d.name, {
                    region: d.region,
                    income: d.income
                });
            }
        });
        const countriesArray = Array.from(uniqueCountries.values());
        // count regions
        const regionCounts = d3.rollup(
            countriesArray,
            v => v.length,  // Count the entries
            d => d.region   // Group by region
        );
        // count income groups
        const incomeCounts = d3.rollup(
            countriesArray,
            v => v.length,  // Count the entries
            d => d.income   // Group by income
        );
        // confirm new data
        console.log("Region counts (Map):", regionCounts);
        console.log("Income counts (Map):", incomeCounts);
        // arrays
        var regionData1 = Array.from(regionCounts, ([region, count]) => ({
            region: region,
            count: count
        }));
        var incomeData1 = Array.from(incomeCounts, ([income, count]) => ({
            income: income,
            count: count
        }));
        //remove empty string region and income group
        const regionData = regionData1.filter(item => item.region !== "");
        const incomeData = incomeData1.filter(item => item.income !== "");
        // sort ascending
        regionData.sort((a, b) => b.count - a.count);
        incomeData.sort((a, b) => b.count - a.count);
        const maxRegion = d3.max(regionData, d => d.count);
        const maxIncome = d3.max(incomeData, d => d.count);
        // making the bar charts
        const barChartWidth = width / 2 - margin.left - margin.right;
        const barChartHeight = height - margin.top - margin.bottom;
        const barPadding = 0.3; 
        // svg
        incomeBar.attr("transform", 
            `translate(${barChartWidth + margin.left * 2}, ${margin.top})`);
        // region scale
        const regionYScale = d3.scaleBand()
            .domain(regionData.map(d => d.region))
            .range([0, barChartHeight])
            .padding(barPadding);
        const regionXScale = d3.scaleLinear()
            .domain([0, d3.max(regionData, d => d.count)])
            .range([0, barChartWidth])
            .nice();
        // income grp scale
        const incomeYScale = d3.scaleBand()
            .domain(incomeData.map(d => d.income))
            .range([0, barChartHeight])
            .padding(barPadding);
        const incomeXScale = d3.scaleLinear()
            .domain([0, d3.max(incomeData, d => d.count)])
            .range([0, barChartWidth])
            .nice();

        // draw region bar
        regionBar.selectAll(".region-bar")
            .data(regionData)
            .enter()
            .append("rect")
            .attr("class", "region-bar")
            .attr("y", d => regionYScale(d.region))
            .attr("x", 0)
            .attr("width", d => regionXScale(d.count))
            .attr("height", regionYScale.bandwidth())
            .attr("fill", d => d.count === maxRegion ? "steelblue" : "#1a5276")
            .attr("opacity", 0.8)
            .attr("rx", 3) 
            .attr("ry", 3);
        
        // region label
        regionBar.selectAll(".region-label")
            .data(regionData)
            .enter()
            .append("text")
            .attr("class", "region-label")
            .attr("x", d => 5)
            .attr("y", d => regionYScale(d.region) + regionYScale.bandwidth() / 2)
            .attr("dy", "0.35em")
            .style("font-size", "15px")
            .style("fill", "white")
            .style("font-weight", "bold")
            .text(d => `${d.count}`);
        
        // draw income bar
        incomeBar.selectAll(".income-bar")
            .data(incomeData)
            .enter()
            .append("rect")
            .attr("class", "income-bar")
            .attr("y", d => incomeYScale(d.income))
            .attr("x", 0)
            .attr("width", d => incomeXScale(d.count))
            .attr("height", incomeYScale.bandwidth())
            .attr("fill", d => d.count === maxIncome ? "yellow" : "orange")
            .attr("opacity", 0.8)
            .attr("rx", 3) 
            .attr("ry", 3);
        
        // income grp label
        incomeBar.selectAll(".income-label")
            .data(incomeData)
            .enter()
            .append("text")
            .attr("class", "income-label")
            .attr("x", d => 5)
            .attr("y", d => incomeYScale(d.income) + incomeYScale.bandwidth() / 2)
            .attr("dy", "0.35em")
            .style("font-size", "15px")
            .style("fill", "#333")
            .style("font-weight", "bold")
            .text(d => `${d.count}`);
        
        // chart titles
        regionBar.append("text")
            .attr("class", "chart-title")
            .attr("x", 0)
            .attr("y",  0)
            .attr("text-anchor", "left")
            .style("font-size", "14px")
            .style("font-weight", "bold")
            .text("Regions");   
        incomeBar.append("text")
            .attr("class", "chart-title")
            .attr("x", 0)
            .attr("y", 0)
            .attr("text-anchor", "left")
            .style("font-size", "14px")
            .style("font-weight", "bold")
            .text("Income Groups");
        
        // hover
        regionBar.selectAll(".region-bar")
            .on("mouseover", function(event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("fill", "darkblue")
                    .attr("opacity", 1);
                TooltipManager.show(
                    `<strong>${d.region}</strong><br>
                        <span style="color: steelblue;">${d.count} countries</span><br>
                        <small>with low unemployment (≤5%)</small>`,
                        'bar'
                );
            })
            .on("mousemove", function(event) {
                TooltipManager.move(event.pageX, event.pageY, 'bar');
            })
            .on("mouseout", function(event) {
                d3.select(event.currentTarget)
                    .transition()
                    .duration(200)
                    .attr("fill", d => d.count === maxRegion ? "steelblue" : "#1a5276")
                    .attr("opacity", 1);
            });
        // hover
        incomeBar.selectAll(".income-bar")
            .on("mouseover", function(event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("fill", "#cc5500")
                    .attr("opacity", 1);
                TooltipManager.show(
                    `<strong>${d.income}</strong><br>
                        <span style="color: orange;">${d.count} countries</span><br>
                        <small>with low unemployment (≤5%)</small>`,
                        'bar'
                );    
            })
            .on("mousemove", function(event) {
                TooltipManager.move(event.pageX, event.pageY, 'bar');
            })
            .on("mouseout", function(event) {
                d3.select(event.currentTarget)
                    .transition()
                    .duration(200)
                    .attr("fill", d => d.count === maxIncome ? "yellow" : "orange")
                    .attr("opacity", 1);

            });
        // animation
        regionBar.selectAll(".region-bar")
            .attr("width", 0)
            .transition()
            .duration(800)
            .delay((d, i) => i * 100)
            .attr("width", d => regionXScale(d.count));
        incomeBar.selectAll(".income-bar")
            .attr("width", 0)
            .transition()
            .duration(800)
            .delay((d, i) => i * 100)
            .attr("width", d => incomeXScale(d.count));
    });
    
    
}
