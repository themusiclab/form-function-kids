/**
 * jspsych-midi-countdown-keyboard-response
 * Josh de Leeuw
 *
 * plugin for playing an midi file and getting a keyboard response
 *
 * documentation: docs.jspsych.org
 *
 **/

jsPsych.plugins["midi-countdown-keyboard-response"] = (function() {

  var plugin = {};

  // TODO: Fix preload?
  // jsPsych.pluginAPI.registerPreload('midi-countdown-keyboard-response', 'stimulus', 'midi');

  plugin.info = {
    name: 'midi-countdown-keyboard-response',
    description: '',
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The midi file to be played.'
      },
      create_synth: {
        type: jsPsych.plugins.parameterType.FUNCTION,
        pretty_name: 'Create Synthsizer',
        default: false,
        description: 'If you pass a function it will be used to create the synthesizer for each track. This function has to return a ToneJS synthesizer and gets passed synthesizer_settings and the current track.'
      },
      synthesizer_settings: {
        type: jsPsych.plugins.parameterType.OBJECT,
        pretty_name: 'Synthesizer Settings',
        default: {
          envelope: {
            attack: 0.02,
            decay: 0.1,
            sustain: 0.3,
            release: 1,
          },
          oscillator: {
            type: 'square'
          }
        },
        description: 'This object allows you to configure the by passing the object provided on to new Tone.PolySynth(). See https://tonejs.github.io/docs/PolySynth for further information.'
      },
      on_midi_loaded: {
        type: jsPsych.plugins.parameterType.FUNCTION,
        pretty_name: 'On Midi Loaded',
        default: false,
        description: 'This function will be called when the midi file has finished loaded. It receives the midi object as a paremter. See https://github.com/Tonejs/Midi for further information to its structure.'
      },
      on_handle_track: {
        type: jsPsych.plugins.parameterType.FUNCTION,
        pretty_name: 'On Handle Track',
        default: false,
        description: 'This function will be called for each track just before their playback starts. Tracks can be modified by reference. See https://github.com/Tonejs/Midi for further information.'
      },
      choices: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        pretty_name: 'Choices',
        array: true,
        default: jsPsych.ALL_KEYS,
        description: 'The keys the subject is allowed to press to respond to the stimulus.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below the stimulus.'
      },
      timer: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Timer',
        default: null,
        description: 'Counter until end of trial.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'The maximum duration to wait for a response.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, the trial will end when user makes a response.'
      },
      trial_ends_after_audio: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Trial ends after midi',
        default: false,
        description: 'If true, then the trial will end as soon as the midi file finishes playing.'
      },
      song_type:{
      type: jsPsych.plugins.parameterType.STRING,
      pretty_name: 'song type',
      default:false,
      description: 'keeping track of what kind of midi file this is'

      }
    }
  }

  plugin.trial = function(display_element, trial) {

    // setup stimulus
    var synths = [];
    var now;
    Midi.fromUrl(trial.stimulus).then(function (midi) {
      if (trial.on_midi_loaded) {
        trial.on_midi_loaded(midi);
      }

      // synth playback
      var tempDurationSeconds = 0;
      midi.tracks.forEach(function (track) {
        if (trial.on_handle_track) {
          trial.on_handle_track(track);
        }

        now = Tone.now() + 0.5;


        // create a synth for each track
        var synth
        if (trial.create_synth) {
          synth = trial.create_synth(trial.synthesizer_settings, track);
          console.log(trial.synthesizer_settings)
        } else {
          synth = new Tone.PolySynth(10, Tone.Synth, trial.synthesizer_settings).toMaster();
          console.log(trial.synthesizer_settings)

        }
        synths.push(synth);

        // schedule all of the MIDI events
        track.notes.forEach(note => {
          synth.triggerAttackRelease(note.name, note.duration, note.time + now, note.velocity)

          var timeAfterNote = note.time + note.duration;
          if (timeAfterNote > tempDurationSeconds) { tempDurationSeconds = timeAfterNote; }
        })
      })

      // Compute actual duration
      var duration = tempDurationSeconds * 1000;
      secondsCountdown = tempDurationSeconds;

      // set up end event if trial needs it
      if(trial.trial_ends_after_audio){
        window.setTimeout(function () {
          end_trial();
        }, duration);
      }
    })

    // --- Countdown ---
    var textElement = document.createElement('DIV');
    var secondsCountdown = 0;
    function myTimer () {
      textElement.innerHTML = secondsCountdown > 0 ? '<font size=24 color=#F34235><b>' + secondsCountdown + '</b></font>' : '';
      if (--secondsCountdown < 0) {
          secondsCountdown = 0;
       }
    }

    var timerInterval
    // Start Countdown
    // (enabled by default)
    if (trial.countdown || trial.countdown === undefined) {
      timerInterval = setInterval(myTimer, 1000);
    }

    // Append element for countdown text
    display_element.appendChild(textElement);

    // show prompt if there is one
    if (trial.prompt !== null) {
      textElement.innerHTML = trial.prompt;
    }

    // Show wave animation
    if (trial.wave) {
      var waveElement = document.createElement('DIV');
      display_element.appendChild(waveElement);

      var siriWave = new SiriWave({
        container: waveElement,
        style: "ios",
        color: "#F34235",
        width: 640,
        height: 200,
        autostart: true
      });
      // Make wave responsive
      siriWave.canvas.style.maxWidth = '100%'
    }

    // store response
    var response = {
      rt: null,
      key: null
    };

    // function to end trial when it is time
    function end_trial() {
      // Remove countdown timerInterval
      clearInterval(timerInterval)

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // stop the midi file if it is playing
      while (synths.length) {
        var synth = synths.shift()
        synth.dispose()
      }

      // remove end event listeners if they exist

      // kill keyboard listeners
      jsPsych.pluginAPI.cancelAllKeyboardResponses();

      // gather the data to store for the trial
      response.rt = Math.round(response.rt * 1000);
      var trial_data = {
        "rt": response.rt,
        "stimulus": trial.stimulus,
        "key_press": response.key,
        "midi_type": trial.song_type
      };

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };

    // function to handle responses by the subject
    var after_response = function(info) {

      // only record the first response
      if (response.key == null) {
        response = info;
      }

      if (trial.response_ends_trial) {
        end_trial();
      }
    };

    // start the response listener
    var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
      callback_function: after_response,
      valid_responses: trial.choices,
      rt_method: 'date',
      persist: false,
      allow_held_key: false
    });

    // end trial if time limit is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.trial_duration);
    }

  };

  return plugin;
})();
