/**
 * jspsych-image-button-response
 * Josh de Leeuw
 *
 * plugin for displaying a stimulus and getting a keyboard response
 *
 * documentation: docs.jspsych.org
 *
 **/

jsPsych.plugins["image-button-response"] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('image-button-response', 'stimulus', 'image');

  plugin.info = {
    name: 'image-button-response',
    description: '',
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The image to be displayed'
      },
      choices: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Choices',
        default: undefined,
        array: true,
        description: 'The labels for the buttons.'
      },
      button_html: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button HTML',
        default: '<br><br><button class="jspsych-btn">%choice%</button>',
        array: true,
        description: 'The html of the button. Can create own style.'
      },
      blurb: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Blurb',
        default: null,
        description: 'Any content here will be displayed below the stimulus.'
      },
      citation: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Citation',
        default: null,
        description: 'Any content here will be displayed below the stimulus.'
      },
      prompt1: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt1',
        default: null,
        description: 'Any content here will be displayed below the stimulus.'
      },
      audio: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Audio',
        default: null,
        description: 'Any content here will be displayed under the button.'
      },
      prompt2: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt2',
        default: null,
        description: 'Any content here will be displayed below the stimulus.'
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
      margin_vertical: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Margin vertical',
        default: '0px',
        description: 'The vertical margin of the button.'
      },
      margin_horizontal: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Margin horizontal',
        default: '8px',
        description: 'The horizontal margin of the button.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, then trial will end when user responds.'
      },
    }
  }

  plugin.trial = function(display_element, trial) {

    if(typeof trial.choices === 'undefined'){
      console.error('Required parameter "choices" missing in image-button-response');
    }
    if(typeof trial.stimulus === 'undefined'){
      console.error('Required parameter "stimulus" missing in image-button-response');
    }

    // display stimulus
    var html = '<br><br><img src="'+trial.stimulus+'" id="jspsych-image-button-response-stimulus" width=90%" style="max-width: 700px"></img>';

    //show blurb
    if (trial.blurb !== null) {
      html += '<p style="font-size:4em; line-height:70px; float:right; margin-left: 10px">'+trial.blurb+'</p>';
    }

    //show citation
    if (trial.citation !== null) {
      html += '<p style="font-size:3em; line-height:60px; float:right; margin-left: 10px"><b>Citation:</b> '+trial.citation+'</p>';
    }

    // add prompt1
    if (trial.prompt1 !== null){
    html += '<p style="font-size:4em; line-height:70px; float:right; margin-left: 10px">'+trial.prompt1+'</p>';
    }

	//show audio if there is one
    if (trial.audio !== null) {
      html += '<p><audio controls><source src='+trial.audio+'></audio></p>';
    }

    // add prompt2
    if (trial.prompt2 !== null){
    html += '<p style="font-size:4em; line-height:70px; float:right; margin-left: 10px">'+trial.prompt2+'</p>';
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
    html += '<div id="jspsych-image-button-response-btngroup">';

    for (var i = 0; i < trial.choices.length; i++) {
      var str = buttons[i].replace(/%choice%/g, trial.choices[i]);
      html += '<div class="jspsych-image-button-response-button" style="display: inline-block; margin:'+trial.margin_vertical+' '+trial.margin_horizontal+'" id="jspsych-image-button-response-button-' + i +'" data-choice="'+i+'">'+str+'</div>';
    }
    html += '</div><br><br><br>';

	display_element.innerHTML = html;

    // start timing
    var start_time = Date.now();

    for (var i = 0; i < trial.choices.length; i++) {
      display_element.querySelector('#jspsych-image-button-response-button-' + i).addEventListener('click', function(e){
        var choice = e.currentTarget.getAttribute('data-choice'); // don't use dataset for jsdom compatibility
        after_response(choice);
      });
    }

    // store response
    var response = {
      rt: null,
      button: null
    };

    // function to handle responses by the subject
    function after_response(choice) {

      // measure rt
      var end_time = Date.now();
      var rt = end_time - start_time;
      response.button = choice;
      response.rt = rt;

      // after a valid response, the stimulus will have the CSS class 'responded'
      // which can be used to provide visual feedback that a response was recorded
      display_element.querySelector('#jspsych-image-button-response-stimulus').className += ' responded';

      // disable all the buttons after a response
      var btns = document.querySelectorAll('.jspsych-image-button-response-button button');
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

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // gather the data to store for the trial
      var trial_data = {
        "rt": response.rt,
        "stimulus": trial.stimulus,
        "button_pressed": response.button
      };

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };



    // hide image if timing is set
    if (trial.stimulus_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        display_element.querySelector('#jspsych-image-button-response-stimulus').style.visibility = 'hidden';
      }, trial.stimulus_duration);
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
