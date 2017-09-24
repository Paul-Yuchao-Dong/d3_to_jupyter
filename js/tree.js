// https://bl.ocks.org/mbostock/4063550

require.config({
    paths: {
        d3: "https://d3js.org/d3.v4.min"
    }
});

require(["d3"], function(d3) {

    d3.select("#maindiv${divnum}").selectAll("svg").remove();

    var svg = d3.select("#maindiv${divnum}").append("svg")
                                            .attr("width", 960)
                                            .attr("height", 1060);
    

    var width = 960,
        height = 1060,
        g = svg.append("g").attr("transform", "translate(" + (width / 2 + 40) + "," + (height / 2 + 90) + ")");

    // console.log(g);
    var stratify = d3.stratify()
        .parentId(function(d) { return d.id.substring(0, d.id.lastIndexOf(".")); });

    var tree = d3.tree()
        .size([2 * Math.PI, 500])
        .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

    // d3.csv("flare.csv", function(error, data) {

    //   if (error) throw error;

    var data=$data;
    var root = tree(stratify(data));

    var link = g.selectAll(".link")
    .data(root.links())
    .enter().append("path")
        .attr("class", "link")
        .attr("d", d3.linkRadial()
            .angle(function(d) { return d.x; })
            .radius(function(d) { return d.y; }));

    var node = g.selectAll(".node")
    .data(root.descendants())
    .enter().append("g")
        .attr("class", function(d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
        .attr("transform", function(d) { return "translate(" + radialPoint(d.x, d.y) + ")"; });

    node.append("circle")
        .attr("r", 2.5);

    node.append("text")
        .attr("dy", "0.31em")
        .attr("x", function(d) { return d.x < Math.PI === !d.children ? 6 : -6; })
        .attr("text-anchor", function(d) { return d.x < Math.PI === !d.children ? "start" : "end"; })
        .attr("transform", function(d) { return "rotate(" + (d.x < Math.PI ? d.x - Math.PI / 2 : d.x + Math.PI / 2) * 180 / Math.PI + ")"; })
        .text(function(d) { return d.id.substring(d.id.lastIndexOf(".") + 1); });
    // });

function radialPoint(x, y) {
    return [(y = +y) * Math.cos(x -= Math.PI / 2), y * Math.sin(x)];
}

});

