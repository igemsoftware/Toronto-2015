title: Meta Flux - a Web based tool for interactive flux balance analsis
author: iGEM UofT


%%%%%
%% Add some inline style rules...

%css

a {
  color: inherit;
  text-decoration: none;
}

body {
  background-image: url('./img/bg.jpg');
  background-position: center center;
  background-size: 100% auto;
}

.step {
  width: 800px;
  height: 600px;
  padding: 20px;

  font-size: 3em;
  text-align: center;

  opacity: 0.3;
}

.step.active {
  opacity: 1;
}

ul {
    text-align: left;
    font-size: 0.5em;
}

.slide {
  background: rgba(250,250,250,0.9);
  overflow-y: hidden;
}

code {
  background-color: yellow;
  font-size: 14px;
}

.fullWidth {
    width: 100%;
    height: auto;
}

.absHeading {
    position: absolute;
    top: 0%;
    left: 50%;
    transform: translateX(-50%);
}

.vCenter {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%)
}

%end

<!-- bower:js -->
<!-- endbower -->

<script>
var stats = {
    begin: function() {
        return;
    },
    end: function() {
        return;
    }
}
</script>

<script src="https://code.jquery.com/jquery-1.11.3.min.js"></script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.6/d3.js"></script>
<script src="http://45.55.193.224/fba-webapp-fresh/src/iJO1366.js"></script>
 <script src="http://45.55.193.224/fba-webapp-fresh/src/lib/bundle-coffee.js"></script>




%%%%%%%%%%%%%%%%%%%
%% Here we go...


% 1
!SLIDE slide x=0 y=0
<canvas id="canvas"></canvas>

% 2
!SLIDE slide x=1000 y=0

<span style="position: absolute; top: 0%; left: 15%;">Tailings Ponds Bioremediation</span>

<img src="./img/tailings-pond.jpg" class="fullWidth"/>

% 3
!SLIDE slide x=500 y=1000 scale=2

<span class="absHeading">microbial consortia</span>
<img src="./img/consortia.jpg" style="width: auto; height: 550px;" />

% 4
%css
#step-5 {
    background: rgba(0,0,0,0)
}
%end
!SLIDE slide x=500 y=2500 scale=3

<span class="vCenter" style="background-color: rgba(255,255,255,0.8); border-radius: 5px; border: 2px solid black;">
How do I optimize the biomass of toluene degrading bacteria?
</span>

% 5
!SLIDE slide x=2800 y=1500 z=1000 rotate=-90 scale=4

FBA:= Flux Balance Analysis
<img src="./img/fba.gif" style="height: 500px; width: auto;" />

!SLIDE slide x=3000 y=1500 rotate=-90

wheee
<canvas id="canvas2"></canvas>
<script>
system = new FBA.System({
        width: 200,
        height: 200,
        backgroundColour: 'white',
        metaboliteRadius: 10,
        useStatic: false,
        everything: true,
        hideObjective: true
})
</script>

%% The End
%%%%%%%%%%%%%%%





<script type="text/javascript">
// rAF polyfill in external js file

main = function() {
	// Declare some globals
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
	var W = $('#step-1').width();
	var H = $('#step-1').height();
	var cx = parseInt(W/2);
	var cy = parseInt(H/2);
  var startTime = (new Date()).getTime();

	// Set the canvas dimensions
	canvas.width = W;
	canvas.height = H;

	// Parameters
	var bgColour = '#212121';

  // Animation object
	window.ANIM = window.ANIM || {};

	ANIM.pause = function() {
		window.cancelAnimationFrame(ANIM.core.animationFrame);
	};

	ANIM.play = function() {
		ANIM.core.then = Date.now();
		ANIM.core.frame();
	};

	ANIM.core = {
		frame: function() {
			ANIM.core.setDelta();
			ANIM.core.update();
			ANIM.core.render();
			ANIM.core.animationFrame = window.requestAnimationFrame(ANIM.core.frame);
		},
		setDelta: function() {
			ANIM.core.now = Date.now();
			ANIM.core.delta = (ANIM.core.now - ANIM.core.then) / 1000;
			// seconds since last frame
			ANIM.core.then = ANIM.core.now;
		},
		update: function() {
			// Update values here
      var timeDelta = (new Date()).getTime();
      circles.forEach(function(circle){
        circle.y += Math.sin((timeDelta * 2*Math.PI) / circle.xPeriod ) * circle.xMultiplier;
      	circle.x += Math.cos((timeDelta * 2*Math.PI) / circle.yPeriod ) * circle.yMultiplier;
      });
      lines = genLines();
		},
		render: function() {
      // clear and render new frame
			clearCanvas();
      circles.forEach(function(circle){
        drawCircle(circle);
      });
      lines.forEach(function(line) {
        drawLine(line);
      });
      ctx.font="20px Ubuntu";
      ctx.fillText("iGEM UofT",cx-220,cy+20);
      ctx.font="40px Ubuntu";
			ctx.fillText("computational",cx-220,cy+60);
      ctx.fillText("biology",cx-160,cy+100);
		}
	};

	// Fill canvas with bgColour
	clearCanvas();

  // Initialize objects here
  var circles = [{
    x: cx-75,
    y: cy-30,
    r: 20,
    xPeriod: 1000,
    yPeriod: 250,
    xMultiplier: 1,
    yMultiplier: 1,
    arcWidth: 10,
    colour: 'grey',
    fill: true
  }, {
    x: cx+75,
    y: cy+20,
    r: 20,
    xPeriod: 250,
    yPeriod: 250,
    xMultiplier: 1,
    yMultiplier: 1,
    arcWidth: 10,
    colour: 'grey',
    fill: true
  }, {
    x: cx-40,
    y: cy-80,
    r: 10,
    xPeriod: 1000,
    yPeriod: 2000,
    xMultiplier: 1,
    yMultiplier: 1,
    arcWidth: 2,
    colour: 'grey',
    fill: false
  }, {
    x: cx+120,
    y: cy-40,
    r: 10,
    xPeriod: 3000,
    yPeriod: 4000,
    xMultiplier: 1,
    yMultiplier: 1,
    arcWidth: 2,
    colour: 'grey',
    fill: false
  }, {
    x: cx+50,
    y: cy+100,
    r: 10,
    xPeriod: 1000,
    yPeriod: 1000,
    xMultiplier: 1,
    yMultiplier: 1,
    arcWidth: 2,
    colour: 'grey',
    fill: false
  }]

  var lines = genLines();

	// Start the animation
	ANIM.play();

	// Functions
	function clearCanvas() {
		ctx.fillStyle = bgColour;
		ctx.fillRect(0, 0, W, H);
	}

  function drawCircle(circle) {
		ctx.beginPath();
		ctx.arc(circle.x,circle.y,circle.r,0,2*Math.PI);
		ctx.lineWidth = circle.arcWidth;
		ctx.strokeStyle = circle.colour;
    ctx.fillStyle = circle.colour;
		ctx.stroke();
    if (circle.fill) {
      ctx.fill();
    }
	}

  function drawLine(line) {
   	ctx.beginPath();
    ctx.moveTo(line.x1, line.y1);
    ctx.lineTo(line.x2, line.y2);
    ctx.lineWidth = line.width;
    ctx.strokeStyle = line.colour;
    ctx.stroke();
  }

  function genLines() {
    var lines = new Array();

    lines.push({
      x1: circles[0].x,
      y1: circles[0].y,
      x2: circles[1].x,
      y2: circles[1].y,
      width: 5,
      color: 'grey'
    }, {
      x1: circles[0].x,
      y1: circles[0].y,
      x2: circles[2].x,
      y2: circles[2].y,
      width: 2,
      color: 'grey'
    }, {
      x1: circles[1].x,
      y1: circles[1].y,
      x2: circles[3].x,
      y2: circles[3].y,
      width: 2,
      color: 'grey'
    }, {
      x1: circles[1].x,
      y1: circles[1].y,
      x2: circles[4].x,
      y2: circles[4].y,
      width: 2,
      color: 'grey'
    });

    return lines;
  }
}

window.onload = function() {
	main();
}

</script>
