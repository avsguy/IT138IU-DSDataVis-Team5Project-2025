var main = d3.select("main");
var scrolly = main.select("#scrolly");
var figure = scrolly.select("figure");
var article = scrolly.select("article");
var step = article.selectAll(".step");
var scroller = scrollama();

function handleResize() {
    var stepH = Math.floor(window.innerHeight * 0.75);
    step.style("height", stepH + "px");
    step.style("width", "250px")

    var figureHeight = window.innerHeight / 2;
    var figureMarginTop = (window.innerHeight - figureHeight) / 2;
    
    figure
        .style("height", figureHeight + "px")
        .style("top", figureMarginTop + "px");

    scroller.resize();
}

// event handler
let chartState = {
    baseChartDrawn: false,
    greenLinesDrawn: false,
};

function handleStepEnter(response) {
    console.log(response); // response = { element, direction, index }

    let currentIndex = response.index;
    let currentDirection = response.direction;

    if (currentIndex !== 3 && currentIndex !== 4) {
        TooltipManager.destroy();
    }

    // add color to current step only
    step.classed("is-active", function(d, i) {
        return i === currentIndex;
    });

    // update graphic based on step
    switch(currentIndex){
        case 0:
            if (!chartState.baseChartDrawn) {
                drawLines();
                chartState.baseChartDrawn = true;
            }            
            if (currentDirection === "up") {
                toggleElementOpacity(greenRect, 500, 0);
            }
            break;

        case 1: //step 2
            chartState.greenLinesDrawn = false;
            if (currentDirection === "down") {
                    showRect();
                    toggleElementOpacity(greenRect, 500, 0.5);
            } 
            if(currentDirection === "up") {
                svgCountry.selectAll(".green-line").remove();
                svgCountry.selectAll(".newYaxis").remove();
                if (!chartState.baseChartDrawn) {
                    drawLines();
                    showRect();
                    chartState.baseChartDrawn = true;
                } 
            }
            break;

        case 2:
            chartState.baseChartDrawn = false;
            if (!chartState.greenLinesDrawn){
                greenLines();
                chartState.greenLinesDrawn = true;
            }
            if(currentDirection === "up") {
                toggleElementOpacity(greenRect, 500, 0.5);
                toggleElementOpacity(svgCountry.select(".axis"), 500, 1);
                toggleElementOpacity(svgCountry.select(".newYaxis"), 500, 1);
                toggleElementOpacity(svgMap, 500, 0);
                toggleElementOpacity(labelHover, 500, 0);
            }
            break;

        case 3:
            TooltipManager.destroy();
            toggleElementOpacity(svgCountry.select(".axis"), 1000, 0);
            toggleElementOpacity(svgCountry.select(".newYaxis"), 1000, 0);
            toggleElementOpacity(greenRect, 1000, 0);
            chartState.greenLinesDrawn = false;
            
            showMap();
            toggleElementOpacity(labelHover, 500, 1);

            if (currentDirection === "down") {
                toggleElementOpacity(svgMap, 500, 1);
            }

            if(currentDirection === "up") {
                toggleElementOpacity(svgMap, 500, 1);
                toggleElementOpacity(incomeBar, 1000, 0);
                toggleElementOpacity(regionBar, 1000, 0);
            }
            break;

        case 4:
            toggleElementOpacity(svgCountry.select(".axis"), 500, 0);
            toggleElementOpacity(svgCountry.select(".newYaxis"), 500, 0);
            toggleElementOpacity(svgCountry.select(".line"), 500, 0);
            toggleElementOpacity(greenRect, 500, 0);
            toggleElementOpacity(svgMap, 500, 0);
            createBars();
            toggleElementOpacity(incomeBar, 500, 1);
            toggleElementOpacity(regionBar, 500, 1);
            toggleElementOpacity(labelHover, 500, 1);
            front(incomeBar);
            front(regionBar);
            front(TooltipManager.currentBarTooltip);
            break;

        default:
            TooltipManager.destroy();
            break;
    }

}

function setupStickyfill() {
    d3.selectAll(".sticky").each(function() {
        Stickyfill.add(this);
    });
}

function init() {
    setupStickyfill();
    handleResize();
    scroller
        .setup({
            step: "#scrolly article .step",
            offset: 0.5,
            debug: false
        })
        .onStepEnter(handleStepEnter);

    window.addEventListener("resize", handleResize);
}

init();