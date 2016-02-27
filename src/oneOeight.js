var svg = d3.select("svg"),
	width = +svg.attr("width"),
	height = +svg.attr("height"),
	radius = Math.min(width, height) / 1.9,
	bodyRadius = radius / 23,
	dotRadius = bodyRadius - 8;

var pi = Math.PI;

var clock5_mill_sec=800*1000;
var clock4_mill_sec=3*clock5_mill_sec;
var clock3_mill_sec=3*clock4_mill_sec;
var clock2_mill_sec=3*clock3_mill_sec;
var clock1_mill_sec=4*clock2_mill_sec;

clock1=function(d){
	return Math.floor(d/clock1_mill_sec)*clock1_mill_sec;
}
clock1.offset=function(d,c){
	return d+clock1_mill_sec;
}
clock1.format=function(d){
	return ""+(1+Math.floor((d-clock1(d))/clock2_mill_sec));
}

clock2=function(d){
	return Math.floor(d/clock2_mill_sec)*clock2_mill_sec;
}
clock2.offset=function(d,c){
	return d+clock2_mill_sec;
}
clock2.format=function(d){
	return ""+(1+Math.floor((d-clock2(d))/clock3_mill_sec));
}

clock3=function(d){
	return Math.floor(d/clock3_mill_sec)*clock3_mill_sec;
}
clock3.offset=function(d,c){
	return d+clock3_mill_sec;
}
clock3.format=function(d){
	return ""+(1+Math.floor((d-clock3(d))/clock4_mill_sec));
}


clock4=function(d){
	return Math.floor(d/clock4_mill_sec)*clock4_mill_sec;
}
clock4.offset=function(d,c){
	return d+clock4_mill_sec;
}
clock4.format=function(d){
	return ""+(1+Math.floor((d-clock4(d))/clock5_mill_sec));
}


clock5=function(d){
	return Math.floor(d/clock5_mill_sec)*clock5_mill_sec;
}
clock5.offset=function(d,c){
	return d+clock5_mill_sec;
}
clock5.format=function(d){
	return ""+(1+Math.floor((d-clock5(d))/1000));
}




var fields = [
{index:1, radius: 0.1 * radius, format: clock1.format, interval: clock1},
{index:2 ,radius: 0.2 * radius, format: clock2.format, interval: clock2},
{index:3 ,radius: 0.3 * radius, format: clock3.format, interval: clock3},
{index:4 ,radius: 0.4 * radius, format: clock4.format, interval: clock4},
{index:5 ,radius: 0.5 * radius, format: clock5.format, interval: clock5},
];

var color = d3.scaleRainbow()
	.domain([0, 360]);

var arcBody = d3.arc()
	.startAngle(function(d) { return bodyRadius / d.radius; })
	.endAngle(function(d) { return -2*pi - bodyRadius / d.radius + 0*pi/16; })
	.innerRadius(function(d) { return d.radius - bodyRadius; })
	.outerRadius(function(d) { return d.radius + bodyRadius; })
	.cornerRadius(bodyRadius);

var arcTextPath = d3.arc()
	.startAngle(function(d) { return -bodyRadius / d.radius; })
	.endAngle(-pi)
	.innerRadius(function(d) { return d.radius; })
	.outerRadius(function(d) { return d.radius; });

	var g = svg.append("g")
	.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

	g.append("g")
	.attr("class", "tracks")
	.selectAll("circle")
	.data(fields)
	.enter().append("circle")
	.attr("r", function(d) { return d.radius; });

	var body = g.append("g")
	.attr("class", "bodies")
	.selectAll("g")
	.data(fields)
	.enter().append("g");

	body.append("path")
	.attr("d", function(d) {
			return arcBody(d)
			+ "M0," + (dotRadius - d.radius)
			+ "a" + dotRadius + "," + dotRadius + " 0 0,1 0," + -dotRadius * 2
			+ "a" + dotRadius + "," + dotRadius + " 0 0,1 0," + dotRadius * 2;
	});


var bodyText;
var time_zone_offset = (new Date).getTimezoneOffset()

function tick() {
	var now = Date.now()-time_zone_offset*60*1000+ 1*3600*1000;
	console.log(now%(24*3600*1000));

	fields.forEach(function(d) {
			var start = d.interval(now),
			end = d.interval.offset(start,1);
			d.angle = Math.round((now - start) / (end - start) * 360 * 100) / 100;
	});

	body
		.style("fill", function(d) { return color(d.angle); })
		.attr("transform", function(d) { return "rotate(" + d.angle + ")"; });

	bodyText
		.attr("startOffset", function(d, i) { return d.angle <= 90 || d.angle > 270 ? "100%" : "0%"; })
		.attr("text-anchor", function(d, i) { return d.angle <= 90 || d.angle > 270 ? "end" : "start"; })
		.text(function(d) { return d.format(now); });
}

function start_clock(){
body.append("path")
.attr("class", "text-path")
.attr("id", function(d, i) { return "body-text-path-" + i; })
.attr("d", arcTextPath);

bodyText = body.append("text")
.attr("dy", ".35em")
.append("textPath")
.attr("xlink:href", function(d, i) { return "#body-text-path-" + i; });

tick();

d3.timer(tick);
}
