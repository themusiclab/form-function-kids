/**
 * jspsych-audioplayers-keyboard-response
 * Josh de Leeuw
 *
 * plugin for displaying a stimulus and getting a keyboard response
 *
 * documentation: docs.jspsych.org
 *
 **/


jsPsych.plugins["audioplayers-keyboard-response"] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'audioplayers-keyboard-response',
    description: '',
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The HTML string to be displayed'
      },
      choices: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        array: true,
        pretty_name: 'Choices',
        default: jsPsych.ALL_KEYS,
        description: 'The keys the subject is allowed to press to respond to the stimulus.'
      },
      prompt1: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt1',
        default: null,
        description: 'Text before instrument name.'
      },
      instrument: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Instrument',
        default: null,
        description: 'Instrument name.'
      },
      prompt2: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt2',
        default: null,
        description: 'Text after instrument name.'
      },
      options: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Options',
        default: null,
        description: 'Display possible answers on the screen.'
      },
      label1: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Label1',
        default: null,
        description: 'Label for audio player 1.'
      },
      audio1: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Audio1',
        default: null,
        description: 'First audio player.'
      },
      label2: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Label2',
        default: null,
        description: 'Label for audio player 2.'
      },
      audio2: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Audio2',
        default: null,
        description: 'Second audio player.'
      },
      prompt3: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt3',
        default: null,
        description: 'Text before response options.'
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
        description: 'How long to show trial before it ends.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, trial will end when subject makes a response.'
      },

    }
  }

  plugin.trial = function(display_element, trial) {

    var new_html = '<div id="jspsych-audioplayers-keyboard-response-stimulus">'+trial.stimulus+'</div>';
    // add prompt1
    if(trial.prompt1 !== null){
      new_html += trial.prompt1;
    }
    // add instrument
    if(trial.instrument !== null){
      new_html += trial.instrument;
    }
    // add prompt2
    if(trial.prompt2 !== null){
      new_html += trial.prompt2;
    }
    // add label1
      if(trial.label1 !== null){
        new_html += trial.label1+'<br>';
      }
    // add audio1
      if (trial.audio1 !== null) {
        new_html += '<audio controls controlsList="nodownload"><source src='+trial.audio1+'></audio>';
      }
    // add label2
      if(trial.label2 !== null){
        new_html += ''+trial.label2+'<br>';
      }
    // add audio2
      if (trial.audio2 !== null) {
        new_html += '<audio controls controlsList="nodownload"><source src='+trial.audio2+'></audio>';
      }
    // add prompt3
    if(trial.prompt3 !== null){
      new_html += trial.prompt3;
    }
    // add options
    if(trial.options !== null){
      new_html += trial.options;
    }
    // draw
    display_element.innerHTML = new_html;

    // store response
    var response = {
      rt: null,
      key: null
    };

    // function to end trial when it is time
    var end_trial = function() {

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // kill keyboard listeners
      if (typeof keyboardListener !== 'undefined') {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
      }

      // gather the data to store for the trial
      var trial_data = {
        "rt": response.rt,
        "stimulus": trial.stimulus,
        "key_press": response.key
      };

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };

    // function to handle responses by the subject
    var after_response = function(info) {

      // after a valid response, the stimulus will have the CSS class 'responded'
      // which can be used to provide visual feedback that a response was recorded
      display_element.querySelector('#jspsych-audioplayers-keyboard-response-stimulus').className += ' responded';

      // only record the first response
      if (response.key == null) {
        response = info;
      }

      if (trial.response_ends_trial) {
        end_trial();
      }
    };

    // start the response listener
    if (trial.choices != jsPsych.NO_KEYS) {
      var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: trial.choices,
        rt_method: 'date',
        persist: false,
        allow_held_key: false
      });
    }

    // hide stimulus if stimulus_duration is set
    if (trial.stimulus_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        display_element.querySelector('#jspsych-audioplayers-keyboard-response-stimulus').style.visibility = 'hidden';
      }, trial.stimulus_duration);
    }

    // end trial if trial_duration is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.trial_duration);
    }

  };

  return plugin;
})();
