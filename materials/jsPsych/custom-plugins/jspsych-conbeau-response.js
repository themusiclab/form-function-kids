/**
 * jspsych-conbeau-response
 * a jspsych plugin for bouncing ball
 *
 * Connie Bainbridge - Harvard Music Lab
 *
 * documentation: docs.jspsych.org
 *
 */


jsPsych.plugins['conbeau-response'] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'conbeau-response',
    description: '',
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The HTML string to be displayed'
      },
      transition: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Show transition slider?',
        default: false,
        description: 'If true, trial shows transition slider for comparing moods.'
      },
      sliders: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Show transition slider?',
        default: true,
        description: 'If true, show all 5 main sliders.'
      },
      emotion: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Emotion preset',
        default: 'default',
        description: 'Emotion preset to load into sliders'
      },
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default:  'Continue',
        array: false,
        description: 'Label of the button to advance.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below the slider.'
      },
      stimulus_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus duration',
        default: null,
        description: 'How long to hide the stimulus.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show the trial.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, trial will end when user makes a response.'
      },
    }
  }

plugin.trial = function(display_element, trial) {
  var _join = function( /*args*/ ) {
    var arr = Array.prototype.slice.call(arguments, _join.length);
    return arr.join(separator = '-');
  }

///// assembling the trial
  // stim

  var teaserDiv = document.createElement("div");
  teaserDiv.setAttribute("id", "teaserDiv");
  var stimDiv = document.createElement("div");
  stimDiv.setAttribute("id", "stimDiv");
  var sliderDiv = document.createElement("div");
  sliderDiv.setAttribute("id", "sliderDiv");
  var ballDiv = document.createElement("div");
  ballDiv.setAttribute("id", "ballHolder");

  // emotion options
  var emotionList = ['angry', 'happy', 'peaceful', 'sad', 'scared'];

  // emotion slider presets
  var presets = [
    {
      emotion: "angry",
      bpm: 347.0,
      jitter: 62.5,
      consonance: 3.0,
      interval: 82.5,
      direction: 81.5
    },
    {
      emotion: "happy",
      bpm: 288.5,
      jitter: 25.0,
      consonance: 36.5,
      interval: 50.5,
      direction: 38.5
    },
    {
      emotion: "peaceful",
      bpm: 64.5,
      jitter: 1.5,
      consonance: 37.0,
      interval: 17.5,
      direction: 40.0
    },
    {
      emotion: "sad",
      bpm: 46.0,
      jitter: 7.0,
      consonance: 30.0,
      interval: 12.0,
      direction: 89.5
    },
    {
      emotion: "scared",
      bpm: 331.0,
      jitter: 65.0,
      consonance: 5.0,
      interval: 61.5,
      direction: 51.5
    },
    {
      emotion: "default",
      bpm: 215.0,
      jitter: 0,
      consonance: 50.0,
      interval: 50.0,
      direction: 18.0
    }
  ];

  let emotionSetting;
  if (trial.emotion == 'default') {
    emotionSetting = presets[5];
  } else if (trial.emotion == 'angry') {
    emotionSetting = presets[0];
  } else if (trial.emotion == 'happy') {
    emotionSetting = presets[1];
  } else if (trial.emotion == 'peaceful') {
    emotionSetting = presets[2];
  } else if (trial.emotion == 'sad') {
    emotionSetting = presets[3];
  } else if (trial.emotion == 'scared') {
    emotionSetting = presets[4];
  };

  stimDiv.innerHTML = trial.stimulus;
  teaserDiv.append(stimDiv);

/////////// sliders
  // var sliderRate = document.createElement("INPUT");
  // sliderRate.setAttribute("type", "range");
  // sliderRate.setAttribute("min", "30");
  // sliderRate.setAttribute("max", "400");
  // sliderRate.setAttribute("value", "215");
  // sliderRate.setAttribute("id", "rate");
  // sliderRate.setAttribute("class", "sliderRate");
  // sliderDiv.appendChild(sliderRate);
  //
  // var sliderJitter = document.createElement("INPUT");
  // sliderJitter.setAttribute("type", "range");
  // sliderJitter.setAttribute("min", "0");
  // sliderJitter.setAttribute("max", "99");
  // sliderJitter.setAttribute("value", "19");
  // sliderJitter.setAttribute("id", "jitter");
  // sliderJitter.setAttribute("class", "sliderJitter");
  // sliderDiv.appendChild(sliderJitter);
  //
  // var sliderDir = document.createElement("INPUT");
  // sliderDir.setAttribute("type", "range");
  // sliderDir.setAttribute("min", "0");
  // sliderDir.setAttribute("max", "100");
  // sliderDir.setAttribute("value", "50");
  // sliderDir.setAttribute("id", "dir");
  // sliderDir.setAttribute("class", "sliderDir");
  // sliderDiv.appendChild(sliderDir);
  //
  // var sliderInterval = document.createElement("INPUT");
  // sliderInterval.setAttribute("type", "range");
  // sliderInterval.setAttribute("min", "0");
  // sliderInterval.setAttribute("max", "100");
  // sliderInterval.setAttribute("value", "50");
  // sliderInterval.setAttribute("id", "interval");
  // sliderInterval.setAttribute("class", "sliderInterval");
  // sliderDiv.appendChild(sliderInterval);
  //
  // var sliderSmooth = document.createElement("INPUT");
  // sliderSmooth.setAttribute("type", "range");
  // sliderSmooth.setAttribute("min", "0");
  // sliderSmooth.setAttribute("max", "37");
  // sliderSmooth.setAttribute("value", "18");
  // sliderSmooth.setAttribute("id", "smooth");
  // sliderSmooth.setAttribute("class", "sliderSmooth");
  // sliderDiv.appendChild(sliderSmooth);
  //
  // //sliders training?
  //
  // //sliders all?
  // var sliderRateALL = document.createElement("INPUT");
  // sliderRateALL.setAttribute("type", "range");
  // sliderRateALL.setAttribute("min", "30");
  // sliderRateALL.setAttribute("max", "400");
  // sliderRateALL.setAttribute("value", "215");
  // sliderRateALL.setAttribute("id", "rateALL");
  // sliderRateALL.setAttribute("class", "sliderRate");
  // sliderDiv.appendChild(sliderRateALL);
  //
  // var sliderJitterALL = document.createElement("INPUT");
  // sliderJitterALL.setAttribute("type", "range");
  // sliderJitterALL.setAttribute("min", "0");
  // sliderJitterALL.setAttribute("max", "100");
  // sliderJitterALL.setAttribute("value", "0");
  // sliderJitterALL.setAttribute("id", "jitterALL");
  // sliderJitterALL.setAttribute("class", "sliderJitter");
  // sliderDiv.appendChild(sliderJitterALL);
  //
  // var sliderDirALL = document.createElement("INPUT");
  // sliderDirALL.setAttribute("type", "range");
  // sliderDirALL.setAttribute("min", "0");
  // sliderDirALL.setAttribute("max", "100");
  // sliderDirALL.setAttribute("value", "50");
  // sliderDirALL.setAttribute("id", "dirALL");
  // sliderDirALL.setAttribute("class", "sliderDir");
  // sliderDiv.appendChild(sliderDirALL);
  //
  // var sliderIntervalALL = document.createElement("INPUT");
  // sliderIntervalALL.setAttribute("type", "range");
  // sliderIntervalALL.setAttribute("min", "0");
  // sliderIntervalALL.setAttribute("max", "100");
  // sliderIntervalALL.setAttribute("value", "50");
  // sliderIntervalALL.setAttribute("id", "intervalALL");
  // sliderIntervalALL.setAttribute("class", "sliderInterval");
  // sliderDiv.appendChild(sliderIntervalALL);
  //
  // var sliderSmoothALL = document.createElement("INPUT");
  // sliderSmoothALL.setAttribute("type", "range");
  // sliderSmoothALL.setAttribute("min", "0");
  // sliderSmoothALL.setAttribute("max", "37");
  // sliderSmoothALL.setAttribute("value", "18");
  // sliderSmoothALL.setAttribute("id", "smoothALL");
  // sliderSmoothALL.setAttribute("class", "sliderSmooth");
  // sliderDiv.appendChild(sliderSmoothALL);

  //sliders experiment?
  if (trial.sliders) {
    var sliderRateALLExp = document.createElement("INPUT");
    sliderRateALLExp.setAttribute("type", "range");
    sliderRateALLExp.setAttribute("min", "30");
    sliderRateALLExp.setAttribute("max", "400");
    sliderRateALLExp.setAttribute("value", emotionSetting.bpm);
    sliderRateALLExp.setAttribute("id", "rateALLExp");
    sliderRateALLExp.setAttribute("class", "sliderRate");
    sliderDiv.appendChild(sliderRateALLExp);
  }

  if (trial.sliders) {
    var sliderJitterALLExp = document.createElement("INPUT");
    sliderJitterALLExp.setAttribute("type", "range");
    sliderJitterALLExp.setAttribute("min", "0");
    sliderJitterALLExp.setAttribute("max", "100");
    sliderJitterALLExp.setAttribute("value", emotionSetting.jitter);
    sliderJitterALLExp.setAttribute("id", "jitterALLExp");
    sliderJitterALLExp.setAttribute("class", "sliderJitter");
    sliderDiv.appendChild(sliderJitterALLExp);
  }

  if (trial.sliders) {
    var sliderDirALLExp = document.createElement("INPUT");
    sliderDirALLExp.setAttribute("type", "range");
    sliderDirALLExp.setAttribute("min", "0");
    sliderDirALLExp.setAttribute("max", "100");
    sliderDirALLExp.setAttribute("value", emotionSetting.consonance);
    sliderDirALLExp.setAttribute("id", "dirALLExp");
    sliderDirALLExp.setAttribute("class", "sliderDir");
    sliderDiv.appendChild(sliderDirALLExp);
  }

  if (trial.sliders) {
    var sliderIntervalALLExp = document.createElement("INPUT");
    sliderIntervalALLExp.setAttribute("type", "range");
    sliderIntervalALLExp.setAttribute("min", "0");
    sliderIntervalALLExp.setAttribute("max", "100");
    sliderIntervalALLExp.setAttribute("value", emotionSetting.interval);
    sliderIntervalALLExp.setAttribute("id", "intervalALLExp");
    sliderIntervalALLExp.setAttribute("class", "sliderInterval");
    sliderDiv.appendChild(sliderIntervalALLExp);
  }

  if (trial.sliders) {
    var sliderSmoothALLExp = document.createElement("INPUT");
    sliderSmoothALLExp.setAttribute("type", "range");
    sliderSmoothALLExp.setAttribute("min", "0");
    sliderSmoothALLExp.setAttribute("max", "37");
    sliderSmoothALLExp.setAttribute("value", emotionSetting.direction);
    sliderSmoothALLExp.setAttribute("id", "smoothALLExp");
    sliderSmoothALLExp.setAttribute("class", "sliderSmooth");
    sliderDiv.appendChild(sliderSmoothALLExp);
  }

  //transition slider
  if (trial.transition) {
    var transitionSlider = document.createElement("INPUT");
    transitionSlider.setAttribute("type", "range");
    transitionSlider.setAttribute("min", "0");
    transitionSlider.setAttribute("max", "100");
    transitionSlider.setAttribute("value", "0");
    transitionSlider.setAttribute("id", "transitionSlider");
    transitionSlider.setAttribute("class", "sliderTrans");
    sliderDiv.appendChild(transitionSlider);
  }
  //end sliders

// !!! USE THIS TO FIX BUTTON STYLING!
  // var buttonDiv = document.createElement('div');
  // buttonDiv.innerHTML+='<p>';
  // display_element.appendChild(buttonDiv);
  // var button = document.createElement('button');
  // button.setAttribute('id','ball-button');
  // button.setAttribute('class', 'jspsych-btn');
  // buttonDiv.appendChild(button);
  // button.innerHTML=trial.button_label;
  // button.addEventListener('click', () => {jsPsych.end_trial({})});
  // buttonDiv.innerHTML+='</p>';

  // button
  var buttonBounceDiv = document.createElement("div");
  var bounceButton = document.createElement("BUTTON");
  bounceButton.innerHTML = 'Activate!';
  bounceButton.addEventListener("click", function () {startBounce(6)});
  buttonBounceDiv.appendChild(bounceButton);

  sliderDiv.appendChild(ballDiv);
  sliderDiv.appendChild(buttonBounceDiv);

  teaserDiv.appendChild(sliderDiv);
  display_element.appendChild(teaserDiv);

  // control for ball
  var controllerButtons = '<div class="fixedBall">'+
  '<button class="button" id="animationMode" onclick="setMode(-1)" style="background-color: darkGrey; display: inline-block; width: 80px; height: 30px; margin-left: 75px">animation</button>'+
  '<button class="button" id="soundMode" onclick="setMode(1)" style="background-color: darkGrey; display: inline-block; width: 50px; height: 30px; margin-left: 5px">sound</button>'+
  '<button class="button" id="bothMode" onclick="setMode(0)" style="background-color: dimGrey; display: inline-block; width: 50px; height: 30px; margin-left: 5px">both</button>';

///////////


/* ------------------ VISUAL ------------------ */
//GLOBALS
  var mode = 0;

  var ballMesh;
  var leftEye, rightEye;

  var ballGuy;
  var xAxis = new THREE.Vector3(1,0,0);

  var on = false;
  var tempSpikes = [];
  var workingSlider = 0;

  var note = 60;

  var noteCounter = 0;
  var continuous = false;

//Default motion settings
  bpm = 215;
  jitter = 0;
  bHeight = 100;
  upDownThresh = 0.5;
  intCurve = 0.5;
  smooth = 18;

//To run stop the animations/sounds
  currTrack = 0;
  currTrack2 = 0;
  currAnimation = 0;

//emotions
  var emotion1 = 0;
  var emotion2 = 1;

// Setting up all the necessary components
  var scene = new THREE.Scene();
  scene.background = new THREE.Color(0.8,0.8,0.8);

  var threeCamera = new THREE.PerspectiveCamera( -60, 5/6, 0.1, 1000 );
  threeCamera.position.z = -500; //front-back
  threeCamera.position.y = -150; //up-down
  threeCamera.position.x = 200; //side-side
  threeCamera.lookAt(0,-180,0);

  var light = new THREE.AmbientLight( 0xffffff, 0.5 ); // soft white light
  scene.add( light );

  var spotLight = new THREE.SpotLight( 0xffffff, 0.75 );
  spotLight.position.set( 0, -250, -150 );
  scene.add(spotLight)

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize( 350, 420 );

  ballDiv.appendChild( renderer.domElement );

//Now draw the floor and the ball
  draw_floor(150);
  c1 = new Creature(0,-35,0,50);
  c1.draw();
  renderer.render(scene, threeCamera);

  function draw_floor(rad) {
    var floor = new THREE.Geometry();

    floor.vertices.push(
      new THREE.Vector3(-rad,20,-rad),
      new THREE.Vector3(rad,20,-rad),
      new THREE.Vector3(rad,20,rad),
      new THREE.Vector3(-rad,20,rad));

    floor.faces.push(
      new THREE.Face3(0,1,2),
      new THREE.Face3(2,3,0)
    );

    var material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0.5,0.5,0.5),
      side: THREE.DoubleSide,
    });

    floor.computeFaceNormals();
    floor.computeVertexNormals();

    scene.add( new THREE.Mesh( floor, material ));
  }

  function drawEyes(){
    var eye = new THREE.BoxGeometry(4, 4, 4);
    var eyeMaterial = new THREE.MeshLambertMaterial({
      color: new THREE.Color(1,1,1),
      side: THREE.DoubleSide,
      flatShading: true,
    } );
    leftEye = new THREE.Mesh(eye, eyeMaterial );
    rightEye = new THREE.Mesh(eye, eyeMaterial );

    translate(leftEye, -12, -33, -45);
    translate(rightEye, 12, -33, -45);
  }

  function defSphere(radius, res, scaleY, spikes){
    deltaPhi = (2 * Math.PI) / res;
    deltaTheta = Math.PI / res;

    var ball = new THREE.Geometry();

    vertexCount = res * res;
    vertices = [];

// Cache the vertices of a UV Sphere
    currentVertex = 0;
    theta = 0;
    phi = 0;
    for(i = 0; i < res; i++) {
      theta += deltaTheta;
      for(j = 0; j < res; j++) {
        phi += deltaPhi;
        x = Math.sin(theta) * Math.cos(phi) + spikes[currentVertex][0];
        y = Math.cos(theta) + spikes[currentVertex][1];
        z = Math.sin(theta) * Math.sin(phi) + spikes[currentVertex][2];
        ball.vertices.push(new THREE.Vector3(x, y, z));
        currentVertex += 1;
      }
    }

    ball.vertices.push(new THREE.Vector3(0,1,0));
    ball.vertices.push(new THREE.Vector3(0, -1 * scaleY, 0));

    for(i = 0; i < res; i++) {
      i2 = i % res;
      i3 = (i + 1) % res;
      ball.faces.push(new THREE.Face3(res*res, i2, i3));
    }

    for(strip = 1; strip < res; strip++) {
      for(quad = 0; quad < res; quad++) {
        i1 = ((strip-1) * res) + quad;
        i2 = (strip * res) + quad;
        i3 = (strip * res) + ((quad + 1) % res);
        i4 = ((strip-1) * res) + ((quad + 1) % res);
        ball.faces.push(new THREE.Face3(i1, i2, i3));
        ball.faces.push(new THREE.Face3(i1, i3, i4));
      }
    }

    for(i = 0; i < res; i++) {
      i2 = (res * (res - 1)) + i % res;
      i3 = (res * (res - 1)) + (i + 1) % res;

      ball.faces.push(new THREE.Face3((res*res)+1, i2, i3));
    }

    for (i=0; i < ball.faces.length; i++) {
      ball.faces[i].color = new THREE.Color(1,0,0);
    }

    var material = new THREE.MeshPhongMaterial({
      color: new THREE.Color(1,0,0),
      side: THREE.BackSide,
      flatShading: true
    });

    ball.computeFaceNormals();
    ball.computeVertexNormals();

    ballMesh = new THREE.Mesh(ball, material);
    ballMesh.scale.set(radius, radius, radius);

    ballMesh.updateMatrix();
  }

// Creature Class contains all of the functions relevant to the actual ball
  function Creature(ix, iy, iz, ir){
    this.initX = ix;
    this.initY = iy;
    this.x = ix;
    this.y = iy;
    this.z = iz;
    this.r = ir;

    this.res = 25;

    this.prevRotation = 0;
    this.deltaRotation = 0;

    this.vertexCount = this.res * this.res;

    this.spikes = [];
    for(x = 0; x < this.vertexCount; x++) {
      this.spikes.push([]);
      for(y = 0; y < 3; y++) {
        this.spikes[x].push(0);
      }
    }

    this.deltaSpikes = [];
    for(x = 0; x < this.vertexCount; x++) {
      this.deltaSpikes.push([]);
      for(y = 0; y < 3; y++) {
        this.deltaSpikes[x].push(0);
      }
    }

    this.draw = function() {
      defSphere(this.r,this.res,1,this.spikes);
      drawEyes();

      ballGuy = new THREE.Group();
      ballGuy.add(ballMesh);
      ballGuy.add(leftEye);
      ballGuy.add(rightEye);

      scene.add(ballGuy);

      ballGuy.scale.set(1,1.3,1);
      translate(ballGuy, this.x, this.y, this.z);
    }

    this.setSpikes = function(rHuron) {
      dissonance = 0.2 * (1-((rHuron+1.428)/2.228));

      for(x = 0; x < this.spikes.length; x++) {
        for(y = 0; y < 3; y++) {
          newSpike = ((2 * dissonance * Math.random()) - dissonance);
          this.deltaSpikes[x][y] = newSpike - this.spikes[x][y];
          /*+ this.spikes[x][y]);*/
        }
      }
    }

    this.setRotation = function(noteNum) {
      this.deltaRotation = (60 - noteNum) - this.prevRotation;
    }

    this.resetRotation = function() {
      this.prevRotation = 0;
      this.deltaRotation = 0;
    }

    this.resetSpikes = function(){
      for(x = 0; x < this.spikes.length; x++) {
        for(y = 0; y < 3; y++) {
          this.spikes[x][y] = 0;
          this.deltaSpikes[x][y] = 0;
        }
      }

      deltaPhi = (2 * Math.PI) / c1.res;
      deltaTheta = Math.PI / c1.res;

      currentVertex = 0;
      theta = 0;
      phi = 0;
      for(i = 0; i < this.res; i++) {
        theta += deltaTheta;
        for(j = 0; j < this.res; j++) {
          phi += deltaPhi;
          newX = Math.sin(theta) * Math.cos(phi) + this.spikes[currentVertex][0];
          newY = Math.cos(theta) + this.spikes[currentVertex][1];
          newZ = Math.sin(theta) * Math.sin(phi) + this.spikes[currentVertex][2];

          ballMesh.geometry.vertices[currentVertex].x = newX;
          ballMesh.geometry.vertices[currentVertex].y = newY;
          ballMesh.geometry.vertices[currentVertex].z = newZ;

          currentVertex += 1;
        }
      }
      ballMesh.geometry.verticesNeedUpdate = true;
    }
  }


  /* ------------------ SLIDER ELEMENTS ------------------ */

  // var sliderRate = document.getElementById("rate");
  // sliderRate.oninput = function() {
  //   bpm = this.value;
  // }
  // var sliderJitter = document.getElementById("jitter");
  // sliderJitter.oninput = function() {
  //   jitter = this.value;
  // }
  // var sliderDir = document.getElementById("dir");
  // sliderDir.oninput = function() {
  //   upDownThresh = this.value * 0.01;
  // }
  // var sliderInterval = document.getElementById("interval");
  // sliderInterval.oninput = function() {
  //   intCurve = this.value * 0.01;
  // }
  // var sliderSmooth = document.getElementById("smooth");
  // sliderSmooth.oninput = function() {
  //   smooth = this.value;
  //   pcSet = pcSetArray[smooth][0];
  //   setHuron = pcSetArray[smooth][1];
  //   pcHuron = getHuron(pcSet);
  // }
  //
  // //ALL
  // var sliderRateALL = document.getElementById("rateALL");
  // sliderRateALL.oninput = function() {
  //   bpm = this.value;
  // }
  // var sliderJitterALL = document.getElementById("jitterALL");
  // sliderJitterALL.oninput = function() {
  //   jitter = this.value;
  // }
  // var sliderDirALL = document.getElementById("dirALL");
  // sliderDirALL.oninput = function() {
  //   upDownThresh = this.value * 0.01;
  // }
  // var sliderIntervalALL = document.getElementById("intervalALL");
  // sliderIntervalALL.oninput = function() {
  //   intCurve = this.value * 0.01;
  // }
  // var sliderSmoothALL = document.getElementById("smoothALL");
  // sliderSmoothALL.oninput = function() {
  //   smooth = this.value;
  //   pcSet = pcSetArray[smooth][0];
  //   setHuron = pcSetArray[smooth][1];
  //   pcHuron = getHuron(pcSet);
  // }

  // Experiment sliders

  if (trial.sliders) {
    var sliderRateALLExp = document.getElementById("rateALLExp");
    sliderRateALLExp.oninput = function() {
      bpm = this.value;
    }
  }

  if (trial.sliders) {
    var sliderJitterALLExp = document.getElementById("jitterALLExp");
    sliderJitterALLExp.oninput = function() {
      jitter = this.value;
    }
  }

  if (trial.sliders) {
    var sliderDirALLExp = document.getElementById("dirALLExp");
    sliderDirALLExp.oninput = function() {
      upDownThresh = this.value * 0.01;
    }
  }

  if (trial.sliders) {
    var sliderIntervalALLExp = document.getElementById("intervalALLExp");
    sliderIntervalALLExp.oninput = function() {
      intCurve = this.value * 0.01;
    }
  }

  if (trial.sliders) {
    var sliderSmoothALLExp = document.getElementById("smoothALLExp");
    sliderSmoothALLExp.oninput = function() {
      smooth = this.value;
      pcSet = pcSetArray[smooth][0];
      setHuron = pcSetArray[smooth][1];
      pcHuron = getHuron(pcSet);
    }
  }

///    comment out below..?
if (trial.transition) {
  var sliderTrans = document.getElementById("transitionSlider");
  sliderTrans.oninput = function() {
    bpm = parseFloat(presets.emotions[emotion1].bpm) + sliderTrans.value * 0.01 *
    (parseFloat(presets.emotions[emotion2].bpm) - parseFloat(presets.emotions[emotion1].bpm))

    jitter = parseFloat(presets.emotions[emotion1].jitter) + sliderTrans.value * 0.01 *
        (parseFloat(presets.emotions[emotion2].jitter) - parseFloat(presets.emotions[emotion1].jitter))

    upDownThresh = 0.01 * parseFloat(presets.emotions[emotion1].direction) + sliderTrans.value * 0.01 * 0.01 *
        (parseFloat(presets.emotions[emotion2].direction) - parseFloat(presets.emotions[emotion1].direction))

    intCurve = 0.01 * parseFloat(presets.emotions[emotion1].interval) + sliderTrans.value * 0.01 * 0.01 *
        (parseFloat(presets.emotions[emotion2].interval) - parseFloat(presets.emotions[emotion1].interval))

    smooth = parseInt(parseFloat(presets.emotions[emotion1].consonance) + sliderTrans.value * 0.01 *
        (parseFloat(presets.emotions[emotion2].consonance) - parseFloat(presets.emotions[emotion1].consonance)))

    pcSet = pcSetArray[smooth][0];
    setHuron = pcSetArray[smooth][1];
    pcHuron = getHuron(pcSet);
  }
};
//?? comment out above?

//
  for(x = 0; x < vertexCount; x++) {
    tempSpikes.push([]);
    for(y = 0; y < 3; y++) {
      tempSpikes[x].push(0);
    }
  }

  function setDefaults(){
    c1.resetSpikes();
    c1.resetRotation();
    // if (workingSlider == 1){
    //   note = 60;
    //   bpm = sliderRate.value;
    //   jitter = 0;
    //   bHeight = 100;
    // }
    // if (workingSlider == 2){
    //   note = 60;
    //   bpm = 215;
    //   jitter = sliderJitter.value;
    //   bHeight = 100;
    // }
    // if (workingSlider == 3){
    //   note = 60;
    //   upDownThresh = sliderDir.value * 0.01;
    //   intCurve = 0.5;
    //
    //   bpm = 215;
    //   jitter = 0;
    //   bHeight = 100;
    // }
    // if (workingSlider == 4){
    //   note = 60;
    //   intCurve = sliderInterval.value *0.01;
    //   upDownThresh = 0.5;
    //
    //   bpm = 215;
    //   jitter = 0;
    // }
    // if (workingSlider == 5){
    //   note = 60;
    //   upDownThresh = 0.5;
    //   intCurve = 0.5;
    //   bpm = 215;
    //   jitter = 0;
    //   bHeight = 100;
    //
    //   smooth = sliderSmooth.value;
    //   pcSet = pcSetArray[smooth][0];
    //   setHuron = pcSetArray[smooth][1];
    //   pcHuron = getHuron(pcSet);
    // }
    // if (workingSlider == 6){
    //   bpm = sliderRateALL.value;
    //   jitter = sliderJitterALL.value;
    //   upDownThresh = sliderDirALL.value * 0.01;
    //   intCurve = sliderIntervalALL.value * 0.01;
    //   smooth = sliderSmoothALL.value;
    //   pcSet = pcSetArray[smooth][0];
    //   setHuron = pcSetArray[smooth][1];
    //   pcHuron = getHuron(pcSet);
    // }

    if (workingSlider == 7){
      bpm = parseFloat(presets.emotions[emotion1].bpm) + sliderTrans.value * 0.01 *
      (parseFloat(presets.emotions[emotion2].bpm) - parseFloat(presets.emotions[emotion1].bpm))

      jitter = parseFloat(presets.emotions[emotion1].jitter) + sliderTrans.value * 0.01 *
      (parseFloat(presets.emotions[emotion2].jitter) - parseFloat(presets.emotions[emotion1].jitter))

      upDownThresh = 0.01 * parseFloat(presets.emotions[emotion1].direction) + sliderTrans.value * 0.01 * 0.01 *
      (parseFloat(presets.emotions[emotion2].direction) - parseFloat(presets.emotions[emotion1].direction))

      intCurve = 0.01 * parseFloat(presets.emotions[emotion1].interval) + sliderTrans.value * 0.01 * 0.01 *
      (parseFloat(presets.emotions[emotion2].interval) - parseFloat(presets.emotions[emotion1].interval))

      smooth = parseInt(parseFloat(presets.emotions[emotion1].consonance) + sliderTrans.value * 0.01 *
      (parseFloat(presets.emotions[emotion2].consonance) - parseFloat(presets.emotions[emotion1].consonance)))

      pcSet = pcSetArray[smooth][0];
      setHuron = pcSetArray[smooth][1];
      pcHuron = getHuron(pcSet);
    }

/// Experiment sliders only?
  if (workingSlider == 8){
    bpm = sliderRateALLExp.value;
    jitter = sliderJitterALLExp.value;
    upDownThresh = sliderDirALLExp.value * 0.01;
    intCurve = sliderIntervalALLExp.value * 0.01;
    smooth = sliderSmoothALLExp.value;
    pcSet = pcSetArray[smooth][0];
    setHuron = pcSetArray[smooth][1];
    pcHuron = getHuron(pcSet);
  }
}

function startBounce(currSlider)
{
  if (on){
    clearInterval(currTrack2);
    clearInterval(currTrack);
    on = false;
    if (workingSlider == currSlider){
    	return;
    }
  }

	on = true;
	workingSlider = currSlider;

  setDefaults();
  play();

}

function play()
{
  if (noteCounter < 17)
  {
    if (mode <= 0){
      c1.prevRotation += c1.deltaRotation;

      for(x = 0; x < c1.vertexCount; x++) {
        for(y = 0; y < 3; y++) {
            c1.spikes[x][y] += c1.deltaSpikes[x][y];
         }
       }
    }

    if (workingSlider >= 3){
      bang();
    }

    period = 60000/bpm;
  	factor = jitter * 0.01 * period;
  	delay = (factor) * Math.random();
    bounceDur = Math.floor(period - delay);


    currTrack = window.setTimeout(play, period);
    currTrack2 = window.setTimeout(playModality, delay, bounceDur);

    noteCounter += 1;
  }

  if (noteCounter == 17){
    noteCounter = 0;

    clearInterval(currTrack2);
    clearInterval(currTrack);
    on = false;

    window.setTimeout(fullReset, 450)

    if (continuous){
      window.setTimeout(play, 500);
      on = true;
    }
  }
}

  function fullReset(){
    resetVars();
    c1.resetSpikes();
    c1.resetRotation();
  }

function playModality(bounceDur){
  toneDur = (bounceDur-10) * 0.001;

  if (mode <= 0){
    cancelAnimationFrame(currAnimation);
    currAnimation = requestAnimationFrame(function(timestamp){
      starttime = timestamp || new Date().getTime();
      animateBall(timestamp, true, true, true, bounceDur);
    });
  }

  if (mode >= 0){
    soundLoop(toneDur);
  }
}

function animateBall(timestamp, bounce, rotate, spikes, bounceDur)
{
	var timestamp = timestamp || new Date().getTime();
	var runtime = timestamp - starttime;

	var progress = runtime/bounceDur;
	progress = Math.min(progress, 1);

	if (bounce){
		sineHeight = Math.sin(Math.PI*progress);
		newY = c1.y - (sineHeight * bHeight);
		ballGuy.position.set(c1.x, newY, c1.z);
	}

	if (rotate){
		rotation = c1.prevRotation + (c1.deltaRotation * progress);

		ballGuy.setRotationFromAxisAngle(xAxis, THREE.Math.degToRad(rotation));
	}

	if (spikes){
		for(x = 0; x < c1.vertexCount; x++) {
    		for(y = 0; y < 3; y++) {
      			tempSpikes[x][y] = c1.spikes[x][y] + (progress * c1.deltaSpikes[x][y]);
    		}
		}

		deltaPhi = (2 * Math.PI) / c1.res;
		deltaTheta = Math.PI / c1.res;

		currentVertex = 0;
		theta = 0;
		phi = 0;
		for(i = 0; i < c1.res; i++) {
		  theta += deltaTheta;
		  for(j = 0; j < c1.res; j++) {
    		phi += deltaPhi;
    		newX = Math.sin(theta) * Math.cos(phi) + tempSpikes[currentVertex][0];
    		newY = Math.cos(theta) + tempSpikes[currentVertex][1];
    		newZ = Math.sin(theta) * Math.sin(phi) + tempSpikes[currentVertex][2];

    		ballMesh.geometry.vertices[currentVertex].x = newX;
    		ballMesh.geometry.vertices[currentVertex].y = newY;
    		ballMesh.geometry.vertices[currentVertex].z = newZ;

    		currentVertex += 1;
  	  }
		}

		ballMesh.geometry.verticesNeedUpdate = true;
	}

  currAnimation = requestAnimationFrame(function(timestamp){
   animateBall(timestamp, bounce, rotate, spikes, bounceDur)
  });

  renderer.render(scene, threeCamera);
}


/* ------------------ SOUND ------------------ */
//setting soundfont to piano
MIDI.USE_XHR = false;

MIDI.loadPlugin({
  soundfontUrl: "conbeau-ball/scripts/soundfont/",
  instrument: "acoustic_grand_piano",
  onprogress: function(state, progress) {
  	//console.log(state, progress);
  },
  onsuccess: function() {
  	//console.log("finished loading")
  }
});

function soundLoop(toneDur){
	MIDI.noteOn(0, note, 110, 0);
	MIDI.noteOff(0,note, toneDur);
}

/*
 *
 * noodler -
 *
 */

//3 outlets
outlets = [];
for (i = 0; i<3; i++){
  outlets.push[0];
}

pcSetArray = [
	[[0, 1, 2, 3, 4], -5.884],
	[[0, 1, 2, 3, 5], -3.216],
	[[0, 2, 3, 4, 6], -3.095],
	[[0, 1, 2, 3, 6], -3.087],
	[[0, 1, 2, 4, 6], -2.449],
	[[0, 1, 2, 3, 7], -2.441],
	[[0, 1, 2, 4, 5], -2.248],
	[[0, 2, 4, 6, 8], -1.69],
	[[0, 1, 2, 6, 8], -1.674],
	[[0, 1, 2, 6, 7], -1.666],
	[[0, 1, 2, 4, 8], -1.481],
	[[0, 1, 2, 5, 6], -1.473],
	[[0, 1, 3, 4, 6], -1.065],
	[[0, 1, 2, 4, 7], -0.419],
	[[0, 1, 3, 5, 6], -0.419],
	[[0, 2, 3, 6, 8], -0.298],
	[[0, 1, 3, 6, 7], -0.29],
	[[0, 1, 3, 4, 7], -0.0969999999999997],
	[[0, 1, 3, 5, 7], 0.219],
	[[0, 1, 2, 5, 7], 0.227],
	[[0, 2, 3, 4, 7], 0.42],
	[[0, 2, 4, 5, 8], 0.541],
	[[0, 1, 4, 5, 7], 0.549],
	[[0, 1, 2, 5, 8], 0.549],
	[[0, 1, 3, 6, 9], 1.086],
	[[0, 1, 4, 6, 8], 1.187],
	[[0, 1, 5, 6, 8], 1.195],
	[[0, 3, 4, 5, 8], 1.388],
	[[0, 1, 3, 4, 8], 1.388],
	[[0, 1, 4, 7, 8], 1.517],
	[[0, 2, 3, 5, 8], 1.603],
	[[0, 2, 3, 5, 7], 2.12],
	[[0, 2, 4, 6, 9], 2.241],
	[[0, 1, 3, 6, 8], 2.249],
	[[0, 1, 4, 5, 8], 2.356],
	[[0, 1, 4, 6, 9], 2.571],
	[[0, 1, 3, 5, 8], 3.088],
	[[0, 2, 4, 7, 9], 4.788]
]

var huronTable = [1.428, -1.428, -0.582, 0.594, 0.386, 1.240, -0.453, 1.240, 0.386, 0.594, -0.582, -1.428];
var pcSet = [0, 2, 4, 7, 9];
var setHuron = 4.788;
var pcHuron = [2.0, 0.594, 1.240, 1.240, -0.582];
pcHuron = getHuron(pcSet);

var curPos = 0;
var curOct = 5;
var previousNote = 60;
var noteOffset = 0;
var delta = 0;

var needsReset = 1;

function reset()
{
	needsReset = 1;
}

function resetVars()
{
	curPos = 0;
	curOct = 5;
	noteOffset = 0;

	// Select a random note offset:
	noteOffset = Math.floor(12*Math.random());

	octBias = 12 * curOct;						  // Always: 12 * 5 = 60
	note = octBias + pcSet[curPos] + noteOffset;  // Always: 60 + 0 + noteOffset
	previousNote = note;  						  // The initial previous note is the 0 of the pcSet.

}

function playNote()
{
	delta = Math.abs(note - previousNote)

	//this is probably not the right way to do this:
	// can't hear above 110 or below 20?
  //Use this to check if the upper bounds are being met...
	if (note >= 110){
    console.log("highOct: " + curOct)
		note = 107;
	}
	if  (note < 22){
    console.log("lowOct" + curOct)
		note = 22;
	}
  	outlets[0] = note;
  	outlets[1] = pcHuron[curPos];
  	outlets[2] = huronTable[delta];

	getStepSize();

	previousNote = note;
}

function getStepSize(){
	if (delta == 0){
		toScale = 1;
	}
	else {
		toScale = delta;
	}
	bHeight = 20 + (80 * ((toScale - 1)/6));
}

function selectNextNote()
{
	interval = 0;
	intChoice = intervalCurve(Math.random());

	// Choose an interval:
	if(intChoice <= 0.25) {
		interval = 1;
	} else if(intChoice > 0.25 && intChoice <= 0.50) {
		interval = 2;
	} else if(intChoice > 0.50 && intChoice <= 0.75) {
		interval = 3;
	} else if(intChoice > 0.75 && intChoice <= 1.0) {
		interval = 4;
	}

	// Choose a direction:
	upDown = Math.random();
	if(upDown <= upDownThresh) {
		interval = interval * -1;
	}

	if((interval + curPos) > 4) {
		curOct += 1;
	} else if ((interval + curPos) < 0) {
		curOct -= 1;
	}

	// Loop at the extreme high and low edges:
	if(curOct == 1) {
		curOct = 2;
	} else if (curOct == 8) {
		curOct = 7;
	}

	if((curPos + interval) < 0) {
		curPos = 5 + (curPos + interval);
	} else {
		curPos = (curPos + interval) % 5;
	}

	octBias = 12 * curOct;
	note = octBias + pcSet[curPos] + noteOffset;

}

function bang()
{
	if(needsReset == 1) {
		needsReset = 0;
		resetVars();
	}

	selectNextNote();
	playNote();

  if (mode <= 0){
  	//movement
  	c1.setRotation(outlets[0]);
  	c1.setSpikes(outlets[2]);
  }
	//music
	note = outlets[0];
}

function getHuron(pcs)
{
	newHuron = [0.0, 0.0, 0.0, 0.0, 0.0];
	for (var i=0; i<5; i++) {
		newHuron[i] = huronTable[pcs[i]];
	}
	return(newHuron);
}


function intervalCurve(x)
{
	a = intCurve;
	if(x<=a) {
		return((1.0 - a)/(0.0 - a))*x + 1;
	} else {
		return((0.0 - a)/(1.0 - a))*(x-1.0);
	}
}

// Helper functions for scaling and translating
      function translate(obj, x, y, z){
        obj.translateX(x);
        obj.translateY(y);
        obj.translateZ(z);
      }

      function scale(obj, x, y, z){
        scaleX = obj.scale.x * x;
        scaleY = obj.scale.y * y;
        scaleZ = obj.scale.z * z;

        obj.scale.set(scaleX, scaleY, scaleZ);
      }

      function setMode(newMode){
        changeButtonColors(newMode);
      	if (on){
          clearInterval(currTrack);
          clearInterval(currTrack2);

      		on = false;
          mode = newMode;

          startBounce(workingSlider);
        }
      	else{
      		mode = newMode;
      	}
      }


  // comment out below?
  function changeButtonColors(newMode){
    document.getElementById('animationMode').style.backgroundColor = 'darkGrey';
    document.getElementById('soundMode').style.backgroundColor = 'darkGrey';
    document.getElementById('bothMode').style.backgroundColor = 'darkGrey';

    if (newMode == -1){
      document.getElementById('animationMode').style.backgroundColor = "dimGrey";
    }
    if (newMode == 0){
      document.getElementById('bothMode').style.backgroundColor = "dimGrey";
    }
    if (newMode == 1){
      document.getElementById('soundMode').style.backgroundColor = "dimGrey";
    }
  }

  if (trial.transition) {
    function setSliders(preset){
      document.getElementById('rateALL').value = parseInt(presets.emotions[preset].bpm);
      document.getElementById('jitterALL').value = parseInt(presets.emotions[preset].jitter);
      document.getElementById('dirALL').value = parseInt(presets.emotions[preset].direction);
      document.getElementById('intervalALL').value = parseInt(presets.emotions[preset].interval);
      document.getElementById('smoothALL').value = parseInt(presets.emotions[preset].consonance);

      if (on){
        clearInterval(currTrack2);
        clearInterval(currTrack);

  		    on = false;
          startBounce(workingSlider);
        }
      }

  function changeTransitionLabels(labelNum, label){
    var emotionList = ['angry', 'happy', 'peaceful', 'sad', 'scared'];

    if (labelNum == 1){
      document.getElementById('emotion1').innerHTML = label;
    }
    if (labelNum == 2){
      document.getElementById('emotion2').innerHTML = label;
    }

    for (var i=0; i<emotionList.length; i++){
      if (label === emotionList[i]){
        document.getElementById(label.concat(labelNum)).style.backgroundColor = '#9b72a3'

        if (labelNum == 1){
          emotion1 = i;
        }
        if (labelNum == 2){
          emotion2 = i;
        }
      }
      else{
          document.getElementById(emotionList[i].concat(labelNum)).style.backgroundColor = 'darkGrey'
      }
    }

    document.getElementById('transitionSlider').value = 0;

    if (on){
      clearInterval(currTrack2);
      clearInterval(currTrack);

      on = false;
      startBounce(7);
    }
  }
};
  // comment out above?

// Placeholder for buttons to do just sound or just visual (line 920+ in ball.js) - do we even want this in this version?

for(x = 0; x < vertexCount; x++) {
	tempSpikes.push([]);
    for(y = 0; y < 3; y++) {
      	tempSpikes[x].push(0);
    }
}

/* ------------------ ON FINISH ------------------ */
    // add submit button
    var buttonDiv = document.createElement('div');
    buttonDiv.innerHTML+='<p>';
    display_element.appendChild(buttonDiv);
    var button = document.createElement('button');
    button.setAttribute('id','ball-button');
    button.setAttribute('class', 'jspsych-btn');
    buttonDiv.appendChild(button);
    button.innerHTML=trial.button_label;
    button.addEventListener('click', () => {jsPsych.end_trial({})});
    buttonDiv.innerHTML+='</p>';

    //responses
    var response = {
      rt: null,
      response: null
    };

    display_element.querySelector('#ball-button').addEventListener('click', function() {
      // measure response time
      var endTime = (new Date()).getTime();
      response.rt = endTime - startTime;

      if (trial.sliders) {
        response.response = [
          'rate_slider: '+display_element.querySelector('#rateALLExp').value,
          'jitter_slider: '+display_element.querySelector('#jitterALLExp').value,
          'dir_slider: '+display_element.querySelector('#dirALLExp').value,
          'interval_slider: '+display_element.querySelector('#intervalALLExp').value,
          'smooth_slider: '+display_element.querySelector('#smoothALLExp').value,
        ];
        if (trial.transition) {
          response.response[5] ='transition_slider: '+display_element.querySelector('#transitionSlider').value
        };
      }

      if(trial.response_ends_trial){
        end_trial();
      } else {
        display_element.querySelector('#jspsych-conbeau-response-next').disabled = true;
      }

    });



    function end_trial(){

      jsPsych.pluginAPI.clearAllTimeouts();

      // save data
      var trialdata = {
        "rt": response.rt,
        "response": response.response,
        "stimulus": trial.stimulus,
        "emotion_preset": emotionSetting
      };

      display_element.innerHTML = '';

      // next trial
      jsPsych.finishTrial(trialdata);
    }

    if (trial.stimulus_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        display_element.querySelector('#jspsych-conbeau-response-stimulus').style.visibility = 'hidden';
      }, trial.stimulus_duration);
    }

    // end trial if trial_duration is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.trial_duration);
    }

    var startTime = (new Date()).getTime();
  };

  return plugin;
})();
