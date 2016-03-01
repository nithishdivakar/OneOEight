var ANY_CLOCK=(function(){
/* ocnstants*/
	var pi = Math.PI;
	var time_zone_offset = (new Date).getTimezoneOffset()

/* private data members*/
	var svg, width, height, radius, bodyRadius, dotRadius;
	var root_elem;
	var division_per_dial;
	var bodyText;
	var fields;
	var color, offset_bla, arcBody, arcTextPath, g, body;

	var dial=[];

/*private function */
	dial.start=function(d,ind){
		return Math.floor(d/division_per_dial[ind])*division_per_dial[ind];
	}
	dial.offset=function(d,ind){
		return d+division_per_dial[ind];
	}
	dial.format=function(d,ind){
		return ""+(1+Math.floor((d-dial.start(d,ind))/division_per_dial[ind+1]));
	}
	
	
	var init = function(id,time_div){
		root = document.getElementById(id.substring(1));
		width = root.offsetWidth;
		height = root.offsetHeight;
	
		svg = d3.select(id).append("svg:svg").style("width",width).style("height",height);
		radius = Math.min(width, height) / 1.9;
		bodyRadius = radius / 23;
		dotRadius = bodyRadius - 8;
	
		color = d3.scaleRainbow().domain([0, 360]);
	
		time_div.push(1000);/* appending milliseconds*/
	
		division_per_dial =new Array(time_div.length)
		division_per_dial[time_div.length-1]=time_div[time_div.length-1];
		for( i =time_div.length-2;i>=0;i--){
			division_per_dial[i] = division_per_dial[i+1]*time_div[i];
		}
		console.log(time_div);
		console.log(division_per_dial);
		console.log(division_per_dial);
		
		fields = []
		for(i=0;i<time_div.length-1;i++){
			fields.push({index:i,radius:(i+1)*0.1*radius});
		}
		
		offset_bla = bodyRadius*60*pi/180;
		arcBody = d3.arc()
			.startAngle(function(d) { return bodyRadius / d.radius - offset_bla/d.radius; })
			.endAngle(function(d) { return -2*pi - bodyRadius / d.radius + offset_bla/d.radius; })
			.innerRadius(function(d) { return d.radius - bodyRadius; })
			.outerRadius(function(d) { return d.radius + bodyRadius; })
			;//.cornerRadius(bodyRadius);
		
		arcTextPath = d3.arc()
			.startAngle(function(d) { return -bodyRadius / d.radius ; })
			.endAngle(-pi)
			.innerRadius(function(d) { return d.radius; })
			.outerRadius(function(d) { return d.radius; });
		
		g = svg.append("g")
			.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
		
		
		g.append("g")
			.attr("class", "tracks")
			.selectAll("circle")
			.data(fields)
			.enter().append("circle")
			.attr("r", function(d) { return d.radius; });
		
		body = g.append("g")
			.attr("class", "bodies")
			.selectAll("g")
			.data(fields)
			.enter().append("g");
		
		body.append("path")
			.attr("d", function(d) {
					return arcBody(d)/*
					+ "M0," + (dotRadius - d.radius)
					+ "a" + dotRadius + "," + dotRadius + " 0 0,1 0," + -dotRadius * 2
					+ "a" + dotRadius + "," + dotRadius + " 0 0,1 0," + dotRadius * 2;
			*/});
		
		start_clock();
	}
	
	function tick() {
		var now = Date.now();//-time_zone_offset*60*1000;
	
		fields.forEach(function(d,i) {
			var start = dial.start(now,i),
			end = dial.offset(start,i);
			d.angle = Math.round((now - start) / (end - start) * 360 * 100) / 100;
		});
	
		body
		.style("fill", function(d) { return color(d.angle); })
		.attr("transform", function(d) { return "rotate(" + d.angle + ")"; });
	
		bodyText
		.attr("startOffset", function(d, i) { return d.angle <= 90 || d.angle > 270 ? "100%" : "0%"; })
		.attr("text-anchor", function(d, i) { return d.angle <= 90 || d.angle > 270 ? "end" : "start"; })
		.text(function(d,i) { return dial.format(now,i); });
	}
	
	var start_clock=function(){
		body.append("path")
		.attr("class", "text-path")
		.attr("id", function(d, i) { return "body-text-path-" + i; })
		.attr("d", arcTextPath);
		
		bodyText = body.append("text")
		.attr("dy", ".35em")
		.append("textPath")
		.style("font-size",0.05*radius)
		.attr("xlink:href", function(d, i) { return "#body-text-path-" + i; });
		
		tick();
		
		d3.timer(tick);
	}
	return {
		init:init,
	}
})();
