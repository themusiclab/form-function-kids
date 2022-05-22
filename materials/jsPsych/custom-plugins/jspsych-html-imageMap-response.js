/**
 * jspsych-html-imageMap-response
 * Jan Simson
 *
 * plugin for displaying a clickable imageMap
 *
 * documentation: docs.jspsych.org
 *
 **/

jsPsych.plugins["html-imageMap-response"] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'html-imageMap-response',
    description: '',
    parameters: {
      prompt: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Prompt',
        default: '',
        description: 'A HTML string to prompt the participant with instructions or questions.'
      },
      stimulus: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The path to the image which will be displayed'
      },
      showLabelOnHover: {
        type: jsPsych.plugins.parameterType.BOOLEAN,
        pretty_name: 'Show Label on Hover',
        default: false,
        description: 'Display the associated label when hovering over an area (via title attribute).'
      },
      areas: {
        type: jsPsych.plugins.parameterType.COMPLEX,
        array: true,
        pretty_name: 'Areas',
        nested: {
          coords: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'Coords (Coordinates)',
            default: undefined,
            description: 'A list of coordinates to defining, where the area will be'
          },
          shape: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'Shape',
            default: 'poly',
            description: 'The type of shape of this area, can be "poly", "rect" or "circle"'
          },
          label: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'Label',
            default: undefined,
            description: 'The label, which will be associated with this area. This is will be the response you will get back later.'
          }
        }
      }
    }
  }

  plugin.trial = function(display_element, trial) {
    var IMAGE_MAP_ID = 'jspsych-html-imageMap-response-image-map'

    // display stimulus
    var html = '<div>' + trial.prompt + '</div>';

    html += '<img id="jspsych-html-imageMap-response-stimulus" src="' + trial.stimulus + '" usemap="#jspsych-html-imageMap-response-image-map">';

    html += '<map id="' + IMAGE_MAP_ID + '" name="jspsych-html-imageMap-response-image-map">';
    for (var i = 0; i < trial.areas.length; i++) {
      var area = trial.areas[i];
      var coords = area.coords.join(',');
      html += '<area data-choice="' + area.label + '" alt="' + area.label + '" href="#" coords="' + coords + '" shape="' + area.shape + '"';
      if (trial.showLabelOnHover) {
        html += ' title="' + area.label + '"';
      }
      html += '>';
    }
    html += '</map>';

    html += '<style>#jspsych-html-imageMap-response-stimulus { max-width: 100vw; max-height: 100vh; }</style>'

    display_element.innerHTML = html;

    if (window.imageMapResize) {
      window.imageMapResize(display_element.querySelector('#' + IMAGE_MAP_ID));
    } else {
      console.warn("image-map-resizer is not laoded! This will lead to problems, when the imageMap is resized. Please download image-map-resizer from https://github.com/davidjbradshaw/image-map-resizer and add it to the page.")
    }

    // start time
    var start_time = performance.now();

    // add event listeners for areas
    let clickTargets = display_element.querySelectorAll('#' + IMAGE_MAP_ID + ' area')
    for (var i = 0; i < clickTargets.length; i++) {
      clickTargets[i].addEventListener('click', function(e){
        e.preventDefault();

        var choice = e.currentTarget.getAttribute('data-choice'); // don't use dataset for jsdom compatibility
        after_response(choice);
      });
    }

    // store response
    var response = {
      rt: null,
      choice: null
    };

    // function to handle responses by the subject
    function after_response(choice) {

      // measure rt
      var end_time = performance.now();
      var rt = end_time - start_time;
      response.choice = choice;
      response.rt = rt;

      // after a valid response, the stimulus will have the CSS class 'responded'
      // which can be used to provide visual feedback that a response was recorded
      display_element.querySelector('#jspsych-html-imageMap-response-stimulus').className += ' responded';

      end_trial();
    };

    // function to end trial when it is time
    function end_trial() {

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // gather the data to store for the trial
      var trial_data = {
        'rt': response.rt,
        'stimulus': trial.stimulus,
        'choice': response.choice
      };

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };

  };

  return plugin;
})();
