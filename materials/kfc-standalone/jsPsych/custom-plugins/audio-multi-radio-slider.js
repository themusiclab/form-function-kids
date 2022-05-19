/**
 * jspsych-audio-multi-radio-slider
 * Constance Bainbridge
 *
 * plugin for radio buttons and sliders with audio woohoo!
 *
 * documentation: docs.jspsych.org
 *
 **/

jsPsych.plugins["audio-multi-radio-slider"] = (function() {
	var plugin = {};

	jsPsych.pluginAPI.registerPreload('audio-multi-radio-slider', 'stimulus', 'audio');

	plugin.info = {
		name: 'audio-multi-radio-slider',
		description: '',
		parameters: {
			stimulus: {
				type: jsPsych.plugins.parameterType.AUDIO,
        pretty_name: 'Stimulus',
				default: undefined,
				description: 'The audio to be played.'
			},
      prompt_radio: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt Radio',
        default: null,
        description: 'Any content here will be displayed above radio buttons.'
      },
      radio_required: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Required radio response',
        default: true,
        description: 'Set if the radio response is required to continue.'
      },
      options: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Options',
        array: true,
        default: undefined,
        description: 'Displays options for an individual question.'
      },
      prompt_slider: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt Slider',
        default: null,
        description: 'Any content here will be displayed above slider.'
      },
      labels: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Labels for slider',
        default: null,
        description: 'These labels will appear left and right, respectively.'
      },
      start_value: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Start value',
        default: null,
        description: 'The starting slider value.'
      },
      min_value: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Min value',
        default: null,
        description: 'The minimum slider value.'
      },
      max_value: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Max value',
        default: null,
        description: 'The maximum slider value.'
      },
      step: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Step',
        default: null,
        description: 'How big the increments on the slider are.'
      },
			choices: {
				type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Choices',
				default: undefined,
				array: true,
				description: 'The button labels.'
			},
      button_html: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Button HTML',
        default: '<button class="jspsych-btn">%choice%</button>',
        array: true,
        description: 'Custom button. Can make your own style.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'The maximum duration to wait for a response.'
      },
      margin_vertical: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Margin vertical',
        default: '0px',
        description: 'Vertical margin of button.'
      },
      margin_horizontal: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Margin horizontal',
        default: '8px',
        description: 'Horizontal margin of button.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, the trial will end when user makes a response.'
      },
      trial_ends_after_audio: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Trial ends after audio',
        default: false,
        description: 'If true, then the trial will end as soon as the audio file finishes playing.'
      },
    }
  }

  plugin.trial = function(display_element, trial) {

    // setup stimulus
    var context = jsPsych.pluginAPI.audioContext();
    if(context !== null){
      var source = context.createBufferSource();
      source.buffer = jsPsych.pluginAPI.getAudioBuffer(trial.stimulus);
      source.connect(context.destination);
    } else {
      var audio = jsPsych.pluginAPI.getAudioBuffer(trial.stimulus);
      audio.currentTime = 0;
    }

    // set up end event if trial needs it
    if(trial.trial_ends_after_audio){
      if(context !== null){
        source.onended = function() {
          end_trial();
        }
      } else {
        audio.addEventListener('ended', end_trial);
      }
    }

    var html = '<div id="jspsych-audio-multi-radio-slider-btngroup">';

    //show radio prompt if there is one
    if (trial.prompt_radio !== null) {
      html += trial.prompt_radio;
    }

    // build radio buttons
    for (var i = 0; i < trial.options.length; i++) {
      html += '<input type="radio" class="" name="radio_plugin_group" value='+trial.options[i]+'>'+trial.options[i]+"&emsp;"
    }

    if (trial.radio_required == true) {
      html += '<div id="required-radio-div" style="color:red; opacity: 0;">required</div>'
    }
    html += '<p><br><br></p>'

    //show slider prompt if there is one
    if (trial.prompt_slider !== null) {
      html += trial.prompt_slider;
    }

    // build slider
    html += '<div id="jspsych-audio-slider-response-wrapper" style="margin: 10px 00px;">';
		  html += '<div class="jspsych-audio-slider-response-container" style="position:relative;display:block">';
		     html += '<input type="range" value="'+trial.start_value+'" min="'+trial.min_value+'" max="'+trial.max_value+'" step="'+trial.step+'" style="width: 60vw;" id="jspsych-audio-slider-response-response"></input>';
         html += '</div>';
         html += '<div style="width: 70vw; margin: auto">';
            html += '<span style="float: left; font-size: 12px;">'+trial.labels[0]+'</span>'
            html += '<span style="float: right; font-size: 12px;">'+trial.labels[1]+'</span>'
        html += '</div>'
    html += '</div>';

    html += '<p><br><br></p>'


    // display submit button
    html += '<button class="jspsych-btn" id="continue-button">'+trial.choices+'</button>'

    html += '</div>'


		display_element.innerHTML = html;

    display_element.querySelector('#continue-button').addEventListener('click', function(e){
      var choice = e.currentTarget.getAttribute('data-choice'); // don't use dataset for jsdom compatibility
      after_response(choice);
    });

    // store response
    var response = {
      rt: null,
      slider: null,
      button: null
    };

    // function to handle responses by the subject
    function after_response(choice) {

      if (!document.querySelector("input[type=radio]:checked")) {
        var requiredDiv = document.getElementById("required-radio-div");
        requiredDiv.style.opacity = "1"
        requiredDiv.style.transition = "0.3s"
      } else {
        // measure rt
        var end_time = Date.now();
        var rt = end_time - start_time;
        var val = document.querySelector("input[type=radio]:checked").value;
        var slider_val = document.querySelector("input[type=range]").value;

        response.button = val;
        response.slider = slider_val;
        response.rt = rt;

        // disable all the buttons after a response
        var btns = document.querySelectorAll('.jspsych-audio-multi-radio-slider-button');
        for(var i=0; i<btns.length; i++){
          //btns[i].removeEventListener('click');
          btns[i].setAttribute('disabled', 'disabled');
        }

        if (trial.response_ends_trial) {
          end_trial();
        }
      }
    };

    // function to end trial when it is time
    function end_trial() {

			// stop the audio file if it is playing
			// remove end event listeners if they exist
			if(context !== null){
				source.stop();
				source.onended = function() { }
			} else {
				audio.pause();
				audio.removeEventListener('ended', end_trial);
			}

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // gather the data to store for the trial
      var trial_data = {
        "rt": response.rt,
        "stimulus": trial.stimulus,
        "radio-selected": response.button,
        "slider-value": response.slider
      };

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };

		// start time
    var start_time = Date.now();

		// start audio
    if(context !== null){
      startTime = context.currentTime;
      source.start(startTime);
    } else {
      audio.play();
    }

    // end trial if time limit is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.trial_duration);
    }

  };

  return plugin;
})();
