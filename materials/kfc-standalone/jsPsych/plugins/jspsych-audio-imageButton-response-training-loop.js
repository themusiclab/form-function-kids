/**
 * jspsych-audio-imageButton-response-training-loop
 * Kristin Diep
 *
 * plugin for playing an audio file and getting a keyboard response
 *
 * documentation: docs.jspsych.org
 *
 **/

jsPsych.plugins["audio-imageButton-response-training-loop"] = (function() {
	var plugin = {};

	jsPsych.pluginAPI.registerPreload('audio-imageButton-response-training-loop', 'stimulus', 'audio');

	plugin.info = {
		name: 'audio-imageButton-response-training-loop',
		description: '',
		parameters: {
			stimulus: {
				type: jsPsych.plugins.parameterType.AUDIO,
        pretty_name: 'Stimulus',
				default: undefined,
				description: 'The audio to be played.'
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
        default: '<button style="border:none;">%choice%</button>',
        array: true,
        description: 'Custom button. Can make your own style.'
      },
			button_width: {
				type: jsPsych.plugins.parameterType.STRING,
				pretty_name: 'Button image width',
				default: '150px',
				array: true,
				description: 'Customize button image width'
			},
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below the stimulus.'
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

  	//display buttons
    var buttons = [];
    if (Array.isArray(trial.button_html)) {
      if (trial.button_html.length == trial.choices.length) {
        buttons = trial.button_html;
      } else {
        console.error('Error in image-button-response plugin. The length of the button_html array does not equal the length of the choices array');
      }
    } else {
      for (var i = 0; i < trial.choices.length; i++) {
        buttons.push(trial.button_html);
      }
    }

    var html = '<div id="jspsych-audio-button-response-training-btngroup">';
      /*var str = '<img src='+trial.choices[i]+' width='+trial.button_width+' style="position:relative">');*/
      html += '<div class="jspsych-audio-button-response-training-button" align="center" style="cursor: pointer; display: inline-block; margin:'+trial.margin_vertical+' '+trial.margin_horizontal+'" id="jspsych-audio-button-response-training-button-' + 0 +'" data-choice="'+0+'"><img src='+trial.choices[0]+' width='+trial.button_width+'></div>'

			//show prompt if there is one
			if (trial.prompt !== null) {
				html += trial.prompt;
			}

			html += '<div class="jspsych-audio-button-response-training-button" align="center" style="cursor: pointer; display: inline-block; margin:'+trial.margin_vertical+' '+trial.margin_horizontal+'" id="jspsych-audio-button-response-training-button-' + 1 +'" data-choice="'+1+'"><img src='+trial.choices[1]+' width='+trial.button_width+'></div>';
console.log(trial.choices)
		html += '</div>';

		display_element.innerHTML = html;

		for (var i = 0; i < trial.choices.length; i++) {
      display_element.querySelector('#jspsych-audio-button-response-training-button-' + i).addEventListener('click', function(e){
		var response_label = trial.choices[e.currentTarget.getAttribute('data-choice')];
		var choice = e.currentTarget.getAttribute('data-choice'); // don't use dataset for jsdom compatibility
        after_response(choice);
      });
    }

    // store response
    var response = {
      rt: null,
      button: null,
	  	response_label: null,
    };

    // function to handle responses by the subject
    function after_response(choice, response_label) {

      // measure rt
      var end_time = Date.now();
      var rt = end_time - start_time;
      response.button = choice;
      response.rt = rt;
	  	response.response_label = response_label;

      // disable all the buttons after a response
      var btns = document.querySelectorAll('.jspsych-audio-button-response-training-button button');
      for(var i=0; i<btns.length; i++){
        //btns[i].removeEventListener('click');
        btns[i].setAttribute('disabled', 'disabled');
      }

      if (trial.response_ends_trial) {
        end_trial();
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
        "button_pressed": response.button,
				"response_label": response.response_label
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
			source.loop = true;
      source.start(startTime);
    } else {
      audio.play();
	  	audio.loop = true;
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
