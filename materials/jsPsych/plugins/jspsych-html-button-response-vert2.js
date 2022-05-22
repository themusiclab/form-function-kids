/**
 * jspsych-html-button-response-vert2
 * Josh de Leeuw
 *
 * plugin for displaying a stimulus and getting a keyboard response
 *
 * documentation: docs.jspsych.org
 *
 **/

jsPsych.plugins["html-button-response-vert2"] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'html-button-response-vert2',
    description: '',
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The HTML string to be displayed'
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
        default: '<button class="jspsych-btn" style="margin:0px 0px 0px 0px !important">%choice%</button>',
        array: true,
        description: 'The html of the button. Can create own style.'
      },
      prompt_top: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'prompt_top',
        default: null,
        description: 'Any content here will be displayed above the buttons.'
      },
      prompt_bottom: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'prompt_bottom',
        default: null,
        description: 'Any content here will be displayed under the buttons.'
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

    // display stimulus
    var html = '<div id="jspsych-html-button-response-vert-stimulus">'+trial.stimulus+'</div>';

    //prompt
    if (trial.prompt_top !== null) {
      html += trial.prompt_top;
    }

    //display buttons
    var buttons = [];
    if (Array.isArray(trial.button_html)) {
      if (trial.button_html.length == trial.choices.length) {
        buttons = trial.button_html;
      } else {
        console.error('Error in html-button-response-vert plugin. The length of the button_html array does not equal the length of the choices array');
      }
    } else {
      for (var i = 0; i < trial.choices.length; i++) {
        buttons.push(trial.button_html);
      }
    }
   // html += '<div id="jspsych-html-button-response-vert-btngroup">';
   for (var i = 0; i < trial.choices.length; i++) {
     var str = buttons[i].replace(/%choice%/g, trial.choices[i]);
     html += '<br><td><div class="jspsych-html-button-response-vert-button" align="center" style="display: inline-block; margin:'+trial.margin_vertical+' '+trial.margin_horizontal+'" id="jspsych-html-button-response-vert-button-' + i +'" data-choice="'+i+'">'+str+'</td></div>';
   }
    //html += '</div>';

  	//prompt
    if (trial.prompt_bottom !== null) {
      html += trial.prompt_bottom;
    }
    display_element.innerHTML = html;

    // start time
    var start_time = Date.now();

    // add event listeners to buttons
    for (var i = 0; i < trial.choices.length; i++) {
      display_element.querySelector('#jspsych-html-button-response-vert-button-' + i).addEventListener('click', function(e){
        // either have another variable that saves the button label for the button pressed, or update choice to save the button label instead of the event

		  var response_label = trial.choices[e.currentTarget.getAttribute('data-choice')];
        var choice = e.currentTarget.getAttribute('data-choice'); // don't use dataset for jsdom compatibility
        after_response(choice, response_label);
      });
    }

    // store response
    var response = {
      rt: null,
      button: null,
      response_label: null
    };

    // function to handle responses by the subject
    function after_response(choice, response_label) {

      // measure rt
      var end_time = Date.now();
      var rt = end_time - start_time;
      response.response_label= response_label;
      response.button = choice;
      response.rt = rt;

      // after a valid response, the stimulus will have the CSS class 'responded'
      // which can be used to provide visual feedback that a response was recorded
      display_element.querySelector('#jspsych-html-button-response-vert-stimulus').className += ' responded';

      // disable all the buttons after a response
      var btns = document.querySelectorAll('.jspsych-html-button-response-vert-button button');
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
        "button_pressed": response.button,
        "response": response.response_label
        //"response": 'placeholder'
      };

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };

    // hide image if timing is set
    if (trial.stimulus_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        display_element.querySelector('#jspsych-html-button-response-vert-stimulus').style.visibility = 'hidden';
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
