// This code generates the experiment run in Hilton & Crowley-de Thierry et al. (2022).
// You can try the experiment at https://themusiclab.org/quizzes/kfc.
//
// WARNING: 
// This code is not executable outside of a Pushkin instance. It is posted here for transparency only.
// A working standalone jsPsych version of this experiment is available at https://github.com/themusiclab/form-function-kids.

/* eslint-disable max-len */
require('script-loader!jspsych/jspsych.js');
require('script-loader!siriwave/dist/siriwave.min.js');

require("script-loader!jspsych/plugins/jspsych-html-button-response.js");
require('script-loader!jspsych/plugins/jspsych-audio-keyboard-response.js');
require('script-loader!jspsych/plugins/jspsych-audio-button-response.js');
require('script-loader!jspsych/plugins/jspsych-survey-text.js');

require('script-loader!../common/custom-plugins/jspsych-audio-countdown-keyboard-response.js');
require("script-loader!../common/custom-plugins/jspsych-html-button-response-vert.js");
require("script-loader!../common/custom-plugins/jspsych-survey-text-number.js")
require("script-loader!../common/custom-plugins/jspsych-survey-text-dropdown.js")

import '../common/custom-plugins/jspsych-react.js';

import React from 'react';
import ExperimentEndPage from '../../components/ExperimentEndPage';
import ReactMap from '../../components/charts/Map';

import isMobile from '../common/isMobile';
import experimentInfo from './info';
import api from '../common/api';
import baseUrl from '../../core/baseUrl';

import {info} from "../common/nhsInfo.js";

import {
  calibrationAudioPreload,

  noise,
  noiseMobile,
  headphoneBlock,
  headphoneBlockMobile
} from "../common/calibration.js"
import {
  countryList,
  langList,
  takenBefore,
  userAge,
  musicEnjoy,
  musicEnjoyMobile,
  musicxp,
  demog,
  emailFollowup,
} from "../common/covariates.js"

import {template as socialTemplate} from "../common/social.js";

var mobile = isMobile();

export default function startExperiment(options) {
  api.init(experimentInfo, options);

  if (options.overwriteBaseUrl) {
    // Overwrite baseUrl
    baseUrl = options.overwriteBaseUrl
  }

  // ==== Experiment ====
  /* set global objects */
	var timeline = [];
  let count;
  let reactionMean;
  let correctResp;
  let correctRespM;
  let percentile;
  let lat;
  let lng;
  let numbersHeard = [];
  let songsHeard = [];


  let imgBasePath = `${baseUrl}/quizzes/kfc/img`
  let imgBasePath_NHS = `${baseUrl}/quizzes/fc/img`
  let audioBasePath = `${baseUrl}/quizzes/kfc/audio`
  let audioBasePath_NHS = `${baseUrl}/quizzes/fc/audio`

  // Declare for later use
  var songPlay, userResp, userRespM, songTestNo, buttonPressed, currentScore;
  var score = 0;
  var songTestNo = 0;

	/* button data */
  var birthdayButtons = [`<img src=${imgBasePath}/cakeT.png hspace="16" class="button-scale"></img>`, `<img src=${imgBasePath}/bathtimeT.png hspace="16" class="button-scale"></img>`,`<img src=${imgBasePath}/schoolT.png hspace="16" class="button-scale"></img>`];
  var trainingButtonLabels = [`<img src=${imgBasePath}/healingT.png hspace="16" class="button-scale"></img>`, `<img src=${imgBasePath}/lullabyT.png hspace="16" class="button-scale"></img>`, `<img src=${imgBasePath}/dancingT.png hspace="16" class="button-scale"></img>`];
  var trainingButtons = [];

  var likeButtonImg = [`<img src=${imgBasePath}/face1T.png hspace="16" class="button-scale-tbl"></img>`, `<img src=${imgBasePath}/face2T.png hspace="16" class="button-scale-tbl"></img>`, `<img src=${imgBasePath}/face3T.png hspace="16" class="button-scale-tbl"></img>`];
  var likeButtons = [`<table align="center" class="portrait-tbl"><tr><td><img src=${imgBasePath}/face1.png class="button-scale-tbl"></img></td></tr><tr><td><p class="font-scale">Dislike</p></td></tr></table>`, `<table align="center" class="potrait-tbl"><tr><td><img src=${imgBasePath}/face2.png class="button-scale-tbl"></img></td></tr><tr><td><p class="font-scale">Okay</p></td></tr></table>`, `<table align="center" class="potrait-tbl"><tr><td><img src=${imgBasePath}/face3.png class="button-scale-tbl"></img></td></tr><tr><td><p class="font-scale">Like</p></td></tr></table>`];

  var buttonLabels = [ `<table align="center" class="potrait-tbl"><tr><td><img src=${imgBasePath}/healing.png class="button-scale-tbl"></img></td></tr><tr><td><p class="font-scale">Singing for Healing</p></td></tr></table>`,`<table align="center" class="potrait-tbl"><tr><td><img src=${imgBasePath}/lullaby.png class="button-scale-tbl"></img></td></tr><tr><td><p class="font-scale">To Put a Baby to Sleep</p></td></tr></table>`,`<table align="center" class="potrait-tbl"><tr><td><img src=${imgBasePath}/dancing.png class="button-scale-tbl"></img></td></tr><tr><td><p class="font-scale">Singing for Dancing</p></td></tr></table>`];
	var buttons = jsPsych.randomization.sampleWithoutReplacement(buttonLabels);



	/* link correct response to key */
	if(buttons[0] == buttonLabels[0]) {
      var healing = 0 //lullaby is correct
      trainingButtons[0] = trainingButtonLabels[0]
    }
  if(buttons[1] == buttonLabels[0]) {
      var healing = 1 //lullaby is correct
      trainingButtons[1] = trainingButtonLabels[0]
    }
  if(buttons[2] == buttonLabels[0]) {
      var healing = 2 //lullaby is correct
      trainingButtons[2] = trainingButtonLabels[0]
    }
	if(buttons[0] == buttonLabels[1]) {
      var lullaby = 0 //dancing is correct
      trainingButtons[0] = trainingButtonLabels[1]
    }
  if(buttons[1] == buttonLabels[1]) {
      var lullaby = 1 //dancing is correct
      trainingButtons[1] = trainingButtonLabels[1]
    }
  if(buttons[2] == buttonLabels[1]) {
      var lullaby = 2 //dancing is correct
      trainingButtons[2] = trainingButtonLabels[1]
    }
	if(buttons[0] == buttonLabels[2])	{
      var dancing = 0 //healing is correct
      trainingButtons[0] = trainingButtonLabels[2]
    }
  if(buttons[1] == buttonLabels[2]) {
      var dancing = 1 //healing is correct
      trainingButtons[1] = trainingButtonLabels[2]
    }
  if(buttons[2] == buttonLabels[2]) {
      var dancing = 2 //healing is correct
      trainingButtons[2] = trainingButtonLabels[2]
    }
  	//console.log(healing);
  	//console.log(lullaby);
  	//console.log(dancing);

  // Build audio paths
  var tracks = [];
  var new_track;
  for (var i = 0; i < 118; i++) {
    new_track = `${audioBasePath_NHS}/TML-RAW-`+info[i].track+`.mp3`;
    tracks.push(new_track);
  }

  // Build image paths
  var img = [];
  var new_img;
  for (var i = 0; i < 118; i++) {
    new_img = `${imgBasePath_NHS}/NHSDiscography-`+info[i].track+`-pic.jpg`;
    img.push(new_img);
  }

  /* Songs and function */
  var song_data = [
    {
      stimulus: tracks[0],
      image: img[0],
      citation: info[0].citation,
      blurb: info[0].blurb,
      lat: info[0].latitude,
      lng: info[0].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[0],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
    {
      stimulus: tracks[1],
      image: img[1],
      citation: info[1].citation,
      blurb: info[1].blurb,
      lat: info[1].latitude,
      lng: info[1].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[1],
        key: healing,
        correct_response: `to heal the sick`,
        correct_responseM: healing
      },
      correct: `Healing the sick`
    },
    {
      stimulus: tracks[2],
      image: img[2],
      citation: info[2].citation,
      blurb: info[2].blurb,
      lat: info[2].latitude,
      lng: info[2].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[2],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
    {
      stimulus: tracks[3],
      image: img[3],
      citation: info[3].citation,
      blurb: info[3].blurb,
      lat: info[3].latitude,
      lng: info[3].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[3],
        key: healing,
        correct_response: `to heal the sick`,
        correct_responseM: healing
      },
      correct: `Healing the sick`
    },
    {
      stimulus: tracks[4],
      image: img[4],
      citation: info[4].citation,
      blurb: info[4].blurb,
      lat: info[4].latitude,
      lng: info[4].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[4],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },
    {
      stimulus: tracks[5],
      image: img[5],
      citation: info[5].citation,
      blurb: info[5].blurb,
      lat: info[5].latitude,
      lng: info[5].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[5],
        key: healing,
        correct_response: `to heal the sick`,
        correct_responseM: healing
      },
      correct: `Healing the sick`
    },
    {
      stimulus: tracks[8],
      image: img[8],
      citation: info[8].citation,
      blurb: info[8].blurb,
      lat: info[8].latitude,
      lng: info[8].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[8],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
    {
      stimulus: tracks[10],
      image: img[10],
      citation: info[10].citation,
      blurb: info[10].blurb,
      lat: info[10].latitude,
      lng: info[10].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[10],
        key: healing,
        correct_response: `to heal the sick`,
        correct_responseM: healing
      },
      correct: `Healing the sick`
    },
    {
      stimulus: tracks[12],
      image: img[12],
      citation: info[12].citation,
      blurb: info[12].blurb,
      lat: info[12].latitude,
      lng: info[12].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[12],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },
    {
      stimulus: tracks[13],
      image: img[13],
      citation: info[13].citation,
      blurb: info[13].blurb,
      lat: info[13].latitude,
      lng: info[13].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[13],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },
    {
      stimulus: tracks[19],
      image: img[19],
      citation: info[19].citation,
      blurb: info[19].blurb,
      lat: info[19].latitude,
      lng: info[19].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[19],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },
    {
      stimulus: tracks[20],
      image: img[20],
      citation: info[20].citation,
      blurb: info[20].blurb,
      lat: info[20].latitude,
      lng: info[20].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[20],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
    {
      stimulus: tracks[21],
      image: img[21],
      citation: info[21].citation,
      blurb: info[21].blurb,
      lat: info[21].latitude,
      lng: info[21].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[21],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },
    {
      stimulus: tracks[22],
      image: img[22],
      citation: info[22].citation,
      blurb: info[22].blurb,
      lat: info[22].latitude,
      lng: info[22].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[22],
        key: healing,
        correct_response: `to heal the sick`,
        correct_responseM: healing
      },
      correct: `Healing the sick`
    },
    {
      stimulus: tracks[23],
      image: img[23],
      citation: info[23].citation,
      blurb: info[23].blurb,
      lat: info[23].latitude,
      lng: info[23].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[23],
        key: healing,
        correct_response: `to heal the sick`,
        correct_responseM: healing
      },
      correct: `Healing the sick`
    },
    {
      stimulus: tracks[24],
      image: img[24],
      citation: info[24].citation,
      blurb: info[24].blurb,
      lat: info[24].latitude,
      lng: info[24].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[24],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },
    {
      stimulus: tracks[26],
      image: img[26],
      citation: info[26].citation,
      blurb: info[26].blurb,
      lat: info[26].latitude,
      lng: info[26].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[26],
        key: healing,
        correct_response: `to heal the sick`,
        correct_responseM: healing
      },
      correct: `Healing the sick`
    },
    {
      stimulus: tracks[28],
      image: img[28],
      citation: info[28].citation,
      blurb: info[28].blurb,
      lat: info[28].latitude,
      lng: info[28].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[28],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },
    {
      stimulus: tracks[29],
      image: img[29],
      citation: info[29].citation,
      blurb: info[29].blurb,
      lat: info[29].latitude,
      lng: info[29].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[29],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },
    {
      stimulus: tracks[30],
      image: img[30],
      citation: info[30].citation,
      blurb: info[30].blurb,
      lat: info[30].latitude,
      lng: info[30].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[30],
        key: healing,
        correct_response: `to heal the sick`,
        correct_responseM: healing
      },
      correct: `Healing the sick`
    },
    {
      stimulus: tracks[31],
      image: img[31],
      citation: info[31].citation,
      blurb: info[31].blurb,
      lat: info[31].latitude,
      lng: info[31].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[31],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },
    {
      stimulus: tracks[32],
      image: img[32],
      citation: info[32].citation,
      blurb: info[32].blurb,
      lat: info[32].latitude,
      lng: info[32].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[32],
        key: healing,
        correct_response: `to heal the sick`,
        correct_responseM: healing
      },
      correct: `Healing the sick`
    },
    {
      stimulus: tracks[33],
      image: img[33],
      citation: info[33].citation,
      blurb: info[33].blurb,
      lat: info[33].latitude,
      lng: info[33].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[33],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
    {
      stimulus: tracks[34],
      image: img[34],
      citation: info[34].citation,
      blurb: info[34].blurb,
      lat: info[34].latitude,
      lng: info[34].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[34],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },
    {
      stimulus: tracks[35],
      image: img[35],
      citation: info[35].citation,
      blurb: info[35].blurb,
      lat: info[35].latitude,
      lng: info[35].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[35],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },
    {
      stimulus: tracks[36],
      image: img[36],
      citation: info[36].citation,
      blurb: info[36].blurb,
      lat: info[36].latitude,
      lng: info[36].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[36],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
    {
      stimulus: tracks[37],
      image: img[37],
      citation: info[37].citation,
      blurb: info[37].blurb,
      lat: info[37].latitude,
      lng: info[37].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[37],
        key: healing,
        correct_response: `to heal the sick`,
        correct_responseM: healing
      },
      correct: `Healing the sick`
    },
    {
      stimulus: tracks[38],
      image: img[38],
      citation: info[38].citation,
      blurb: info[38].blurb,
      lat: info[38].latitude,
      lng: info[38].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[38],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
    {
      stimulus: tracks[39],
      image: img[39],
      citation: info[39].citation,
      blurb: info[39].blurb,
      lat: info[39].latitude,
      lng: info[39].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[39],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
    {
      stimulus: tracks[40],
      image: img[40],
      citation: info[40].citation,
      blurb: info[40].blurb,
      lat: info[40].latitude,
      lng: info[40].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[40],
        key: healing,
        correct_response: `to heal the sick`,
        correct_responseM: healing
      },
      correct: `Healing the sick`
    },
    {
      stimulus: tracks[41],
      image: img[41],
      citation: info[41].citation,
      blurb: info[41].blurb,
      lat: info[41].latitude,
      lng: info[41].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[41],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },
    {
      stimulus: tracks[42],
      image: img[42],
      citation: info[42].citation,
      blurb: info[42].blurb,
      lat: info[42].latitude,
      lng: info[42].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[42],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
    {
      stimulus: tracks[43],
      image: img[43],
      citation: info[43].citation,
      blurb: info[43].blurb,
      lat: info[43].latitude,
      lng: info[43].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[43],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
    {
      stimulus: tracks[45],
      image: img[45],
      citation: info[45].citation,
      blurb: info[45].blurb,
      lat: info[45].latitude,
      lng: info[45].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[45],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },
    {
      stimulus: tracks[47],
      image: img[47],
      citation: info[47].citation,
      blurb: info[47].blurb,
      lat: info[47].latitude,
      lng: info[47].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[47],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
    {
      stimulus: tracks[48],
      image: img[48],
      citation: info[48].citation,
      blurb: info[48].blurb,
      lat: info[48].latitude,
      lng: info[48].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[48],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
    {
      stimulus: tracks[49],
      image: img[49],
      citation: info[49].citation,
      blurb: info[49].blurb,
      lat: info[49].latitude,
      lng: info[49].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[49],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },
    {
      stimulus: tracks[50],
      image: img[50],
      citation: info[50].citation,
      blurb: info[50].blurb,
      lat: info[50].latitude,
      lng: info[50].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[50],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
    {
      stimulus: tracks[53],
      image: img[53],
      citation: info[53].citation,
      blurb: info[53].blurb,
      lat: info[53].latitude,
      lng: info[53].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[53],
        key: healing,
        correct_response: `to heal the sick`,
        correct_responseM: healing
      },
      correct: `Healing the sick`
    },
    {
      stimulus: tracks[54],
      image: img[54],
      citation: info[54].citation,
      blurb: info[54].blurb,
      lat: info[54].latitude,
      lng: info[54].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[54],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
    {
      stimulus: tracks[55],
      image: img[55],
      citation: info[55].citation,
      blurb: info[55].blurb,
      lat: info[55].latitude,
      lng: info[55].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[55],
        key: healing,
        correct_response: `to heal the sick`,
        correct_responseM: healing
      },
      correct: `Healing the sick`
    },
    {
      stimulus: tracks[58],
      image: img[58],
      citation: info[58].citation,
      blurb: info[58].blurb,
      lat: info[58].latitude,
      lng: info[58].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[58],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
    {
      stimulus: tracks[59],
      image: img[59],
      citation: info[59].citation,
      blurb: info[59].blurb,
      lat: info[59].latitude,
      lng: info[59].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[59],
        key: healing,
        correct_response: `to heal the sick`,
        correct_responseM: healing
      },
      correct: `Healing the sick`
    },
    {
      stimulus: tracks[61],
      image: img[61],
      citation: info[61].citation,
      blurb: info[61].blurb,
      lat: info[61].latitude,
      lng: info[61].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[61],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
    {
      stimulus: tracks[62],
      image: img[62],
      citation: info[62].citation,
      blurb: info[62].blurb,
      lat: info[62].latitude,
      lng: info[62].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[62],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },
    {
      stimulus: tracks[63],
      image: img[63],
      citation: info[63].citation,
      blurb: info[63].blurb,
      lat: info[63].latitude,
      lng: info[63].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[63],
        key: healing,
        correct_response: `to heal the sick`,
        correct_responseM: healing
      },
      correct: `Healing the sick`
    },
    {
      stimulus: tracks[65],
      image: img[65],
      citation: info[65].citation,
      blurb: info[65].blurb,
      lat: info[65].latitude,
      lng: info[65].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[65],
        key: healing,
        correct_response: `to heal the sick`,
        correct_responseM: healing
      },
      correct: `Healing the sick`
    },
    {
      stimulus: tracks[66],
      image: img[66],
      citation: info[66].citation,
      blurb: info[66].blurb,
      lat: info[66].latitude,
      lng: info[66].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[66],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
    {
      stimulus: tracks[67],
      image: img[67],
      citation: info[67].citation,
      blurb: info[67].blurb,
      lat: info[67].latitude,
      lng: info[67].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[67],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },
    {
      stimulus: tracks[69],
      image: img[69],
      citation: info[69].citation,
      blurb: info[69].blurb,
      lat: info[69].latitude,
      lng: info[69].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[69],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
    {
      stimulus: tracks[70],
      image: img[70],
      citation: info[70].citation,
      blurb: info[70].blurb,
      lat: info[70].latitude,
      lng: info[70].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[70],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
    {
      stimulus: tracks[71],
      image: img[71],
      citation: info[71].citation,
      blurb: info[71].blurb,
      lat: info[71].latitude,
      lng: info[71].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[71],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },
    {
      stimulus: tracks[72],
      image: img[72],
      citation: info[72].citation,
      blurb: info[72].blurb,
      lat: info[72].latitude,
      lng: info[72].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[72],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
    {
      stimulus: tracks[74],
      image: img[74],
      citation: info[74].citation,
      blurb: info[74].blurb,
      lat: info[74].latitude,
      lng: info[74].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[74],
        key: healing,
        correct_response: `to heal the sick`,
        correct_responseM: healing
      },
      correct: `Healing the sick`
    },
    {
      stimulus: tracks[75],
      image: img[75],
      citation: info[75].citation,
      blurb: info[75].blurb,
      lat: info[75].latitude,
      lng: info[75].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[75],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
    {
      stimulus: tracks[77],
      image: img[77],
      citation: info[77].citation,
      blurb: info[77].blurb,
      lat: info[77].latitude,
      lng: info[77].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[77],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },
    {
      stimulus: tracks[78],
      image: img[78],
      citation: info[78].citation,
      blurb: info[78].blurb,
      lat: info[78].latitude,
      lng: info[78].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[78],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },
    {
      stimulus: tracks[79],
      image: img[79],
      citation: info[79].citation,
      blurb: info[79].blurb,
      lat: info[79].latitude,
      lng: info[79].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[79],
        key: healing,
        correct_response: `to heal the sick`,
        correct_responseM: healing
      },
      correct: `Healing the sick`
    },
    {
      stimulus: tracks[80],
      image: img[80],
      citation: info[80].citation,
      blurb: info[80].blurb,
      lat: info[80].latitude,
      lng: info[80].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[80],
        key: healing,
        correct_response: `to heal the sick`,
        correct_responseM: healing
      },
      correct: `Healing the sick`
    },
    {
      stimulus: tracks[81],
      image: img[81],
      citation: info[81].citation,
      blurb: info[81].blurb,
      lat: info[81].latitude,
      lng: info[81].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[81],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },
    {
      stimulus: tracks[82],
      image: img[82],
      citation: info[82].citation,
      blurb: info[82].blurb,
      lat: info[82].latitude,
      lng: info[82].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[82],
        key: healing,
        correct_response: `to heal the sick`,
        correct_responseM: healing
      },
      correct: `Healing the sick`
    },
    {
      stimulus: tracks[83],
      image: img[83],
      citation: info[83].citation,
      blurb: info[83].blurb,
      lat: info[83].latitude,
      lng: info[83].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[83],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },
    {
      stimulus: tracks[86],
      image: img[86],
      citation: info[86].citation,
      blurb: info[86].blurb,
      lat: info[86].latitude,
      lng: info[86].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[86],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
    {
      stimulus: tracks[87],
      image: img[87],
      citation: info[87].citation,
      blurb: info[87].blurb,
      lat: info[87].latitude,
      lng: info[87].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[87],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },
    {
      stimulus: tracks[88],
      image: img[88],
      citation: info[88].citation,
      blurb: info[88].blurb,
      lat: info[88].latitude,
      lng: info[88].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[88],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },
    {
      stimulus: tracks[89],
      image: img[89],
      citation: info[89].citation,
      blurb: info[89].blurb,
      lat: info[89].latitude,
      lng: info[89].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[89],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },
    {
      stimulus: tracks[90],
      image: img[90],
      citation: info[90].citation,
      blurb: info[90].blurb,
      lat: info[90].latitude,
      lng: info[90].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[90],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },
    {
      stimulus: tracks[92],
      image: img[92],
      citation: info[92].citation,
      blurb: info[92].blurb,
      lat: info[92].latitude,
      lng: info[92].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[92],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
    {
      stimulus: tracks[94],
      image: img[94],
      citation: info[94].citation,
      blurb: info[94].blurb,
      lat: info[94].latitude,
      lng: info[94].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[94],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
    {
      stimulus: tracks[95],
      image: img[95],
      citation: info[95].citation,
      blurb: info[95].blurb,
      lat: info[95].latitude,
      lng: info[95].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[95],
        key: healing,
        correct_response: `to heal the sick`,
        correct_responseM: healing
      },
      correct: `Healing the sick`
    },
    {
      stimulus: tracks[97],
      image: img[97],
      citation: info[97].citation,
      blurb: info[97].blurb,
      lat: info[97].latitude,
      lng: info[97].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[97],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },
    {
      stimulus: tracks[98],
      image: img[98],
      citation: info[98].citation,
      blurb: info[98].blurb,
      lat: info[98].latitude,
      lng: info[98].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[98],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
    {
      stimulus: tracks[99],
      image: img[99],
      citation: info[99].citation,
      blurb: info[99].blurb,
      lat: info[99].latitude,
      lng: info[99].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[99],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
    {
      stimulus: tracks[100],
      image: img[100],
      citation: info[100].citation,
      blurb: info[100].blurb,
      lat: info[100].latitude,
      lng: info[100].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[100],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
    {
      stimulus: tracks[101],
      image: img[101],
      citation: info[101].citation,
      blurb: info[101].blurb,
      lat: info[101].latitude,
      lng: info[101].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[101],
        key: healing,
        correct_response: `to heal the sick`,
        correct_responseM: healing
      },
      correct: `Healing the sick`
    },
    {
      stimulus: tracks[102],
      image: img[102],
      citation: info[102].citation,
      blurb: info[102].blurb,
      lat: info[102].latitude,
      lng: info[102].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[102],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },
    {
      stimulus: tracks[105],
      image: img[105],
      citation: info[105].citation,
      blurb: info[105].blurb,
      lat: info[105].latitude,
      lng: info[105].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[105],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },
    {
      stimulus: tracks[106],
      image: img[106],
      citation: info[106].citation,
      blurb: info[106].blurb,
      lat: info[106].latitude,
      lng: info[106].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[106],
        key: healing,
        correct_response: `to heal the sick`,
        correct_responseM: healing
      },
      correct: `Healing the sick`
    },
    {
      stimulus: tracks[107],
      image: img[107],
      citation: info[107].citation,
      blurb: info[107].blurb,
      lat: info[107].latitude,
      lng: info[107].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[107],
        key: healing,
        correct_response: `to heal the sick`,
        correct_responseM: healing
      },
      correct: `Healing the sick`
    },
    {
      stimulus: tracks[108],
      image: img[108],
      citation: info[108].citation,
      blurb: info[108].blurb,
      lat: info[108].latitude,
      lng: info[108].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[108],
        key: healing,
        correct_response: `to heal the sick`,
        correct_responseM: healing
      },
      correct: `Healing the sick`
    },
    {
      stimulus: tracks[109],
      image: img[109],
      citation: info[109].citation,
      blurb: info[109].blurb,
      lat: info[109].latitude,
      lng: info[109].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[109],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },
    {
      stimulus: tracks[110],
      image: img[110],
      citation: info[110].citation,
      blurb: info[110].blurb,
      lat: info[110].latitude,
      lng: info[110].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[110],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
    {
      stimulus: tracks[111],
      image: img[111],
      citation: info[111].citation,
      blurb: info[111].blurb,
      lat: info[111].latitude,
      lng: info[111].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[111],
        key: healing,
        correct_response: `to heal the sick`,
        correct_responseM: healing
      },
      correct: `Healing the sick`
    },
    {
      stimulus: tracks[112],
      image: img[112],
      citation: info[112].citation,
      blurb: info[112].blurb,
      lat: info[112].latitude,
      lng: info[112].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[112],
        key: healing,
        correct_response: `to heal the sick`,
        correct_responseM: healing
      },
      correct: `Healing the sick`
    },
    {
      stimulus: tracks[113],
      image: img[113],
      citation: info[113].citation,
      blurb: info[113].blurb,
      lat: info[113].latitude,
      lng: info[113].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[113],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
    {
      stimulus: tracks[114],
      image: img[114],
      citation: info[114].citation,
      blurb: info[114].blurb,
      lat: info[114].latitude,
      lng: info[114].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[114],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },
    {
      stimulus: tracks[115],
      image: img[115],
      citation: info[115].citation,
      blurb: info[115].blurb,
      lat: info[115].latitude,
      lng: info[115].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[115],
        key: healing,
        correct_response: `to heal the sick`,
        correct_responseM: healing
      },
      correct: `Healing the sick`
    },
    {
      stimulus: tracks[116],
      image: img[116],
      citation: info[116].citation,
      blurb: info[116].blurb,
      lat: info[116].latitude,
      lng: info[116].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[116],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
  ];
  var song_listIO = [];
  var song_dataLullaby = [
    {
      stimulus: tracks[0],
      image: img[0],
      citation: info[0].citation,
      blurb: info[0].blurb,
      lat: info[0].latitude,
      lng: info[0].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[0],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
    {
      stimulus: tracks[2],
      image: img[2],
      citation: info[2].citation,
      blurb: info[2].blurb,
      lat: info[2].latitude,
      lng: info[2].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[2],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
    {
      stimulus: tracks[8],
      image: img[8],
      citation: info[8].citation,
      blurb: info[8].blurb,
      lat: info[8].latitude,
      lng: info[8].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[8],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
    {
      stimulus: tracks[20],
      image: img[20],
      citation: info[20].citation,
      blurb: info[20].blurb,
      lat: info[20].latitude,
      lng: info[20].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[20],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
    {
      stimulus: tracks[33],
      image: img[33],
      citation: info[33].citation,
      blurb: info[33].blurb,
      lat: info[33].latitude,
      lng: info[33].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[33],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
    {
      stimulus: tracks[36],
      image: img[36],
      citation: info[36].citation,
      blurb: info[36].blurb,
      lat: info[36].latitude,
      lng: info[36].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[36],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
    {
      stimulus: tracks[38],
      image: img[38],
      citation: info[38].citation,
      blurb: info[38].blurb,
      lat: info[38].latitude,
      lng: info[38].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[38],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
    {
      stimulus: tracks[39],
      image: img[39],
      citation: info[39].citation,
      blurb: info[39].blurb,
      lat: info[39].latitude,
      lng: info[39].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[39],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
    {
      stimulus: tracks[42],
      image: img[42],
      citation: info[42].citation,
      blurb: info[42].blurb,
      lat: info[42].latitude,
      lng: info[42].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[42],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
    {
      stimulus: tracks[43],
      image: img[43],
      citation: info[43].citation,
      blurb: info[43].blurb,
      lat: info[43].latitude,
      lng: info[43].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[43],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
    {
      stimulus: tracks[47],
      image: img[47],
      citation: info[47].citation,
      blurb: info[47].blurb,
      lat: info[47].latitude,
      lng: info[47].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[47],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
    {
      stimulus: tracks[48],
      image: img[48],
      citation: info[48].citation,
      blurb: info[48].blurb,
      lat: info[48].latitude,
      lng: info[48].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[48],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
    {
      stimulus: tracks[50],
      image: img[50],
      citation: info[50].citation,
      blurb: info[50].blurb,
      lat: info[50].latitude,
      lng: info[50].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[50],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
    {
      stimulus: tracks[54],
      image: img[54],
      citation: info[54].citation,
      blurb: info[54].blurb,
      lat: info[54].latitude,
      lng: info[54].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[54],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
    {
      stimulus: tracks[58],
      image: img[58],
      citation: info[58].citation,
      blurb: info[58].blurb,
      lat: info[58].latitude,
      lng: info[58].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[58],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
    {
      stimulus: tracks[61],
      image: img[61],
      citation: info[61].citation,
      blurb: info[61].blurb,
      lat: info[61].latitude,
      lng: info[61].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[61],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
    {
      stimulus: tracks[66],
      image: img[66],
      citation: info[66].citation,
      blurb: info[66].blurb,
      lat: info[66].latitude,
      lng: info[66].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[66],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
    {
      stimulus: tracks[69],
      image: img[69],
      citation: info[69].citation,
      blurb: info[69].blurb,
      lat: info[69].latitude,
      lng: info[69].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[69],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
    {
      stimulus: tracks[70],
      image: img[70],
      citation: info[70].citation,
      blurb: info[70].blurb,
      lat: info[70].latitude,
      lng: info[70].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[70],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
    {
      stimulus: tracks[72],
      image: img[72],
      citation: info[72].citation,
      blurb: info[72].blurb,
      lat: info[72].latitude,
      lng: info[72].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[72],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
    {
      stimulus: tracks[75],
      image: img[75],
      citation: info[75].citation,
      blurb: info[75].blurb,
      lat: info[75].latitude,
      lng: info[75].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[75],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
    {
      stimulus: tracks[86],
      image: img[86],
      citation: info[86].citation,
      blurb: info[86].blurb,
      lat: info[86].latitude,
      lng: info[86].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[86],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
    {
      stimulus: tracks[92],
      image: img[92],
      citation: info[92].citation,
      blurb: info[92].blurb,
      lat: info[92].latitude,
      lng: info[92].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[92],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
    {
      stimulus: tracks[94],
      image: img[94],
      citation: info[94].citation,
      blurb: info[94].blurb,
      lat: info[94].latitude,
      lng: info[94].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[94],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
    {
      stimulus: tracks[98],
      image: img[98],
      citation: info[98].citation,
      blurb: info[98].blurb,
      lat: info[98].latitude,
      lng: info[98].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[98],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
    {
      stimulus: tracks[99],
      image: img[99],
      citation: info[99].citation,
      blurb: info[99].blurb,
      lat: info[99].latitude,
      lng: info[99].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[99],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
    {
      stimulus: tracks[100],
      image: img[100],
      citation: info[100].citation,
      blurb: info[100].blurb,
      lat: info[100].latitude,
      lng: info[100].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[100],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
    {
      stimulus: tracks[110],
      image: img[110],
      citation: info[110].citation,
      blurb: info[110].blurb,
      lat: info[110].latitude,
      lng: info[110].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[110],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
    {
      stimulus: tracks[113],
      image: img[113],
      citation: info[113].citation,
      blurb: info[113].blurb,
      lat: info[113].latitude,
      lng: info[113].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[113],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
    {
      stimulus: tracks[116],
      image: img[116],
      citation: info[116].citation,
      blurb: info[116].blurb,
      lat: info[116].latitude,
      lng: info[116].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[116],
        key: lullaby,
        correct_response: `to soothe a baby`,
        correct_responseM: lullaby
      },
      correct: `Soothing a baby`
    },
  ];
  var song_dataHealing = [
    {
      stimulus: tracks[1],
      image: img[1],
      citation: info[1].citation,
      blurb: info[1].blurb,
      lat: info[1].latitude,
      lng: info[1].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[1],
        key: healing,
        correct_response: `to heal the sick`,
        correct_responseM: healing
      },
      correct: `Healing the sick`
    },
    {
      stimulus: tracks[3],
      image: img[3],
      citation: info[3].citation,
      blurb: info[3].blurb,
      lat: info[3].latitude,
      lng: info[3].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[3],
        key: healing,
        correct_response: `to heal the sick`,
        correct_responseM: healing
      },
      correct: `Healing the sick`
    },
    {
      stimulus: tracks[5],
      image: img[5],
      citation: info[5].citation,
      blurb: info[5].blurb,
      lat: info[5].latitude,
      lng: info[5].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[5],
        key: healing,
        correct_response: `to heal the sick`,
        correct_responseM: healing
      },
      correct: `Healing the sick`
    },
    {
      stimulus: tracks[10],
      image: img[10],
      citation: info[10].citation,
      blurb: info[10].blurb,
      lat: info[10].latitude,
      lng: info[10].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[10],
        key: healing,
        correct_response: `to heal the sick`,
        correct_responseM: healing
      },
      correct: `Healing the sick`
    },
    {
      stimulus: tracks[22],
      image: img[22],
      citation: info[22].citation,
      blurb: info[22].blurb,
      lat: info[22].latitude,
      lng: info[22].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[22],
        key: healing,
        correct_response: `to heal the sick`,
        correct_responseM: healing
      },
      correct: `Healing the sick`
    },
    {
      stimulus: tracks[23],
      image: img[23],
      citation: info[23].citation,
      blurb: info[23].blurb,
      lat: info[23].latitude,
      lng: info[23].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[23],
        key: healing,
        correct_response: `to heal the sick`,
        correct_responseM: healing
      },
      correct: `Healing the sick`
    },
    {
      stimulus: tracks[26],
      image: img[26],
      citation: info[26].citation,
      blurb: info[26].blurb,
      lat: info[26].latitude,
      lng: info[26].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[26],
        key: healing,
        correct_response: `to heal the sick`,
        correct_responseM: healing
      },
      correct: `Healing the sick`
    },
    {
      stimulus: tracks[30],
      image: img[30],
      citation: info[30].citation,
      blurb: info[30].blurb,
      lat: info[30].latitude,
      lng: info[30].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[30],
        key: healing,
        correct_response: `to heal the sick`,
        correct_responseM: healing
      },
      correct: `Healing the sick`
    },
    {
      stimulus: tracks[32],
      image: img[32],
      citation: info[32].citation,
      blurb: info[32].blurb,
      lat: info[32].latitude,
      lng: info[32].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[32],
        key: healing,
        correct_response: `to heal the sick`,
        correct_responseM: healing
      },
      correct: `Healing the sick`
    },
    {
      stimulus: tracks[37],
      image: img[37],
      citation: info[37].citation,
      blurb: info[37].blurb,
      lat: info[37].latitude,
      lng: info[37].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[37],
        key: healing,
        correct_response: `to heal the sick`,
        correct_responseM: healing
      },
      correct: `Healing the sick`
    },
    {
      stimulus: tracks[40],
      image: img[40],
      citation: info[40].citation,
      blurb: info[40].blurb,
      lat: info[40].latitude,
      lng: info[40].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[40],
        key: healing,
        correct_response: `to heal the sick`,
        correct_responseM: healing
      },
      correct: `Healing the sick`
    },
      {
        stimulus: tracks[53],
        image: img[53],
        citation: info[53].citation,
        blurb: info[53].blurb,
        lat: info[53].latitude,
        lng: info[53].longitude,
        data: {
          trialName: `songType`,
          stim_played: tracks[53],
          key: healing,
          correct_response: `to heal the sick`,
          correct_responseM: healing
        },
        correct: `Healing the sick`
      },
      {
        stimulus: tracks[55],
        image: img[55],
        citation: info[55].citation,
        blurb: info[55].blurb,
        lat: info[55].latitude,
        lng: info[55].longitude,
        data: {
          trialName: `songType`,
          stim_played: tracks[55],
          key: healing,
          correct_response: `to heal the sick`,
          correct_responseM: healing
        },
        correct: `Healing the sick`
      },
        {
          stimulus: tracks[59],
          image: img[59],
          citation: info[59].citation,
          blurb: info[59].blurb,
          lat: info[59].latitude,
          lng: info[59].longitude,
          data: {
            trialName: `songType`,
            stim_played: tracks[59],
            key: healing,
            correct_response: `to heal the sick`,
            correct_responseM: healing
          },
          correct: `Healing the sick`
        },
        {
          stimulus: tracks[63],
          image: img[63],
          citation: info[63].citation,
          blurb: info[63].blurb,
          lat: info[63].latitude,
          lng: info[63].longitude,
          data: {
            trialName: `songType`,
            stim_played: tracks[63],
            key: healing,
            correct_response: `to heal the sick`,
            correct_responseM: healing
          },
          correct: `Healing the sick`
        },
        {
          stimulus: tracks[65],
          image: img[65],
          citation: info[65].citation,
          blurb: info[65].blurb,
          lat: info[65].latitude,
          lng: info[65].longitude,
          data: {
            trialName: `songType`,
            stim_played: tracks[65],
            key: healing,
            correct_response: `to heal the sick`,
            correct_responseM: healing
          },
          correct: `Healing the sick`
        },
        {
          stimulus: tracks[74],
          image: img[74],
          citation: info[74].citation,
          blurb: info[74].blurb,
          lat: info[74].latitude,
          lng: info[74].longitude,
          data: {
            trialName: `songType`,
            stim_played: tracks[74],
            key: healing,
            correct_response: `to heal the sick`,
            correct_responseM: healing
          },
          correct: `Healing the sick`
        },
        {
          stimulus: tracks[79],
          image: img[79],
          citation: info[79].citation,
          blurb: info[79].blurb,
          lat: info[79].latitude,
          lng: info[79].longitude,
          data: {
            trialName: `songType`,
            stim_played: tracks[79],
            key: healing,
            correct_response: `to heal the sick`,
            correct_responseM: healing
          },
          correct: `Healing the sick`
        },
        {
          stimulus: tracks[80],
          image: img[80],
          citation: info[80].citation,
          blurb: info[80].blurb,
          lat: info[80].latitude,
          lng: info[80].longitude,
          data: {
            trialName: `songType`,
            stim_played: tracks[80],
            key: healing,
            correct_response: `to heal the sick`,
            correct_responseM: healing
          },
          correct: `Healing the sick`
        },
        {
          stimulus: tracks[82],
          image: img[82],
          citation: info[82].citation,
          blurb: info[82].blurb,
          lat: info[82].latitude,
          lng: info[82].longitude,
          data: {
            trialName: `songType`,
            stim_played: tracks[82],
            key: healing,
            correct_response: `to heal the sick`,
            correct_responseM: healing
          },
          correct: `Healing the sick`
        },
        {
          stimulus: tracks[95],
          image: img[95],
          citation: info[95].citation,
          blurb: info[95].blurb,
          lat: info[95].latitude,
          lng: info[95].longitude,
          data: {
            trialName: `songType`,
            stim_played: tracks[95],
            key: healing,
            correct_response: `to heal the sick`,
            correct_responseM: healing
          },
          correct: `Healing the sick`
        },
        {
          stimulus: tracks[101],
          image: img[101],
          citation: info[101].citation,
          blurb: info[101].blurb,
          lat: info[101].latitude,
          lng: info[101].longitude,
          data: {
            trialName: `songType`,
            stim_played: tracks[101],
            key: healing,
            correct_response: `to heal the sick`,
            correct_responseM: healing
          },
          correct: `Healing the sick`
        },
        {
          stimulus: tracks[106],
          image: img[106],
          citation: info[106].citation,
          blurb: info[106].blurb,
          lat: info[106].latitude,
          lng: info[106].longitude,
          data: {
            trialName: `songType`,
            stim_played: tracks[106],
            key: healing,
            correct_response: `to heal the sick`,
            correct_responseM: healing
          },
          correct: `Healing the sick`
        },
        {
          stimulus: tracks[107],
          image: img[107],
          citation: info[107].citation,
          blurb: info[107].blurb,
          lat: info[107].latitude,
          lng: info[107].longitude,
          data: {
            trialName: `songType`,
            stim_played: tracks[107],
            key: healing,
            correct_response: `to heal the sick`,
            correct_responseM: healing
          },
          correct: `Healing the sick`
        },
        {
          stimulus: tracks[108],
          image: img[108],
          citation: info[108].citation,
          blurb: info[108].blurb,
          lat: info[108].latitude,
          lng: info[108].longitude,
          data: {
            trialName: `songType`,
            stim_played: tracks[108],
            key: healing,
            correct_response: `to heal the sick`,
            correct_responseM: healing
          },
          correct: `Healing the sick`
        },
        {
          stimulus: tracks[111],
          image: img[111],
          citation: info[111].citation,
          blurb: info[111].blurb,
          lat: info[111].latitude,
          lng: info[111].longitude,
          data: {
            trialName: `songType`,
            stim_played: tracks[111],
            key: healing,
            correct_response: `to heal the sick`,
            correct_responseM: healing
          },
          correct: `Healing the sick`
        },
        {
          stimulus: tracks[112],
          image: img[112],
          citation: info[112].citation,
          blurb: info[112].blurb,
          lat: info[112].latitude,
          lng: info[112].longitude,
          data: {
            trialName: `songType`,
            stim_played: tracks[112],
            key: healing,
            correct_response: `to heal the sick`,
            correct_responseM: healing
          },
          correct: `Healing the sick`
        },
        {
          stimulus: tracks[115],
          image: img[115],
          citation: info[115].citation,
          blurb: info[115].blurb,
          lat: info[115].latitude,
          lng: info[115].longitude,
          data: {
            trialName: `songType`,
            stim_played: tracks[115],
            key: healing,
            correct_response: `to heal the sick`,
            correct_responseM: healing
          },
          correct: `Healing the sick`
        },
  ];
  var song_dataDance = [
    {
      stimulus: tracks[4],
      image: img[4],
      citation: info[4].citation,
      blurb: info[4].blurb,
      lat: info[4].latitude,
      lng: info[4].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[4],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },
    {
      stimulus: tracks[12],
      image: img[12],
      citation: info[12].citation,
      blurb: info[12].blurb,
      lat: info[12].latitude,
      lng: info[12].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[12],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },
    {
      stimulus: tracks[13],
      image: img[13],
      citation: info[13].citation,
      blurb: info[13].blurb,
      lat: info[13].latitude,
      lng: info[13].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[13],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },
    {
      stimulus: tracks[19],
      image: img[19],
      citation: info[19].citation,
      blurb: info[19].blurb,
      lat: info[19].latitude,
      lng: info[19].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[19],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },
    {
      stimulus: tracks[21],
      image: img[21],
      citation: info[21].citation,
      blurb: info[21].blurb,
      lat: info[21].latitude,
      lng: info[21].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[21],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },
    {
      stimulus: tracks[24],
      image: img[24],
      citation: info[24].citation,
      blurb: info[24].blurb,
      lat: info[24].latitude,
      lng: info[24].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[24],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },
    {
      stimulus: tracks[28],
      image: img[28],
      citation: info[28].citation,
      blurb: info[28].blurb,
      lat: info[28].latitude,
      lng: info[28].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[28],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },
    {
      stimulus: tracks[29],
      image: img[29],
      citation: info[29].citation,
      blurb: info[29].blurb,
      lat: info[29].latitude,
      lng: info[29].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[29],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },
    {
      stimulus: tracks[31],
      image: img[31],
      citation: info[31].citation,
      blurb: info[31].blurb,
      lat: info[31].latitude,
      lng: info[31].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[31],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },
    {
      stimulus: tracks[34],
      image: img[34],
      citation: info[34].citation,
      blurb: info[34].blurb,
      lat: info[34].latitude,
      lng: info[34].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[34],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },
    {
      stimulus: tracks[35],
      image: img[35],
      citation: info[35].citation,
      blurb: info[35].blurb,
      lat: info[35].latitude,
      lng: info[35].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[35],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },
    {
      stimulus: tracks[41],
      image: img[41],
      citation: info[41].citation,
      blurb: info[41].blurb,
      lat: info[41].latitude,
      lng: info[41].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[41],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },
    {
      stimulus: tracks[45],
      image: img[45],
      citation: info[45].citation,
      blurb: info[45].blurb,
      lat: info[45].latitude,
      lng: info[45].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[45],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },
    {
      stimulus: tracks[49],
      image: img[49],
      citation: info[49].citation,
      blurb: info[49].blurb,
      lat: info[49].latitude,
      lng: info[49].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[49],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },
    {
      stimulus: tracks[62],
      image: img[62],
      citation: info[62].citation,
      blurb: info[62].blurb,
      lat: info[62].latitude,
      lng: info[62].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[62],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },
    {
      stimulus: tracks[67],
      image: img[67],
      citation: info[67].citation,
      blurb: info[67].blurb,
      lat: info[67].latitude,
      lng: info[67].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[67],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },
    {
      stimulus: tracks[71],
      image: img[71],
      citation: info[71].citation,
      blurb: info[71].blurb,
      lat: info[71].latitude,
      lng: info[71].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[71],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },
    {
      stimulus: tracks[77],
      image: img[77],
      citation: info[77].citation,
      blurb: info[77].blurb,
      lat: info[77].latitude,
      lng: info[77].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[77],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },
    {
      stimulus: tracks[78],
      image: img[78],
      citation: info[78].citation,
      blurb: info[78].blurb,
      lat: info[78].latitude,
      lng: info[78].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[78],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },
    {
      stimulus: tracks[81],
      image: img[81],
      citation: info[81].citation,
      blurb: info[81].blurb,
      lat: info[81].latitude,
      lng: info[81].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[81],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },
    {
      stimulus: tracks[83],
      image: img[83],
      citation: info[83].citation,
      blurb: info[83].blurb,
      lat: info[83].latitude,
      lng: info[83].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[83],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },
    {
      stimulus: tracks[87],
      image: img[87],
      citation: info[87].citation,
      blurb: info[87].blurb,
      lat: info[87].latitude,
      lng: info[87].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[87],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },
    {
      stimulus: tracks[88],
      image: img[88],
      citation: info[88].citation,
      blurb: info[88].blurb,
      lat: info[88].latitude,
      lng: info[88].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[88],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },
    {
      stimulus: tracks[89],
      image: img[89],
      citation: info[89].citation,
      blurb: info[89].blurb,
      lat: info[89].latitude,
      lng: info[89].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[89],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },
    {
      stimulus: tracks[90],
      image: img[90],
      citation: info[90].citation,
      blurb: info[90].blurb,
      lat: info[90].latitude,
      lng: info[90].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[90],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },
    {
      stimulus: tracks[97],
      image: img[97],
      citation: info[97].citation,
      blurb: info[97].blurb,
      lat: info[97].latitude,
      lng: info[97].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[97],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },
    {
      stimulus: tracks[102],
      image: img[102],
      citation: info[102].citation,
      blurb: info[102].blurb,
      lat: info[102].latitude,
      lng: info[102].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[102],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },
    {
      stimulus: tracks[105],
      image: img[105],
      citation: info[105].citation,
      blurb: info[105].blurb,
      lat: info[105].latitude,
      lng: info[105].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[105],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },
    {
      stimulus: tracks[109],
      image: img[109],
      citation: info[109].citation,
      blurb: info[109].blurb,
      lat: info[109].latitude,
      lng: info[109].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[109],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },
    {
      stimulus: tracks[114],
      image: img[114],
      citation: info[114].citation,
      blurb: info[114].blurb,
      lat: info[114].latitude,
      lng: info[114].longitude,
      data: {
        trialName: `songType`,
        stim_played: tracks[114],
        key: dancing,
        correct_response: `for dancing`,
        correct_responseM: dancing
      },
      correct: `Dancing`
    },

  ];
  var song_listLullaby = jsPsych.randomization.sampleWithoutReplacement(song_dataLullaby, 2);
  Array.prototype.push.apply(song_listIO, song_listLullaby);
  var song_listHealing = jsPsych.randomization.sampleWithoutReplacement(song_dataHealing, 2);
  Array.prototype.push.apply(song_listIO, song_listHealing);
  var song_listDance = jsPsych.randomization.sampleWithoutReplacement(song_dataDance, 2);
  Array.prototype.push.apply(song_listIO, song_listDance);
  var song_list = jsPsych.randomization.shuffle(song_listIO);
  //console.log(song_list)

  // Preload files

  var audioPreload = [
    song_list[0].stimulus,
    song_list[1].stimulus,
    song_list[2].stimulus,
    song_list[3].stimulus,
    song_list[4].stimulus,
    song_list[5].stimulus,
    `${audioBasePath}/twinkle.mp3`,
    `${audioBasePath}/allDone.mp3`,
    `${audioBasePath}/almostDone.mp3`,
    `${audioBasePath}/birthdayVoice.mp3`,
    `${audioBasePath}/danceButton.mp3`,
    `${audioBasePath}/firstSong.mp3`,
    `${audioBasePath}/greatJob.mp3`,
    `${audioBasePath}/happyBirthday.mp3`,
    `${audioBasePath}/hateBroccoli.mp3`,
    `${audioBasePath}/hateCake.mp3`,
    `${audioBasePath}/healButton.mp3`,
    `${audioBasePath}/howMuchLikeSong.mp3`,
    `${audioBasePath}/letsLearn.mp3`,
    `${audioBasePath}/likeHappy.mp3`,
    `${audioBasePath}/likeOkay.mp3`,
    `${audioBasePath}/likePracticeCake.mp3`,
    `${audioBasePath}/likePracticeBroccoli.mp3`,
    `${audioBasePath}/likeSad.mp3`,
    `${audioBasePath}/introLike.mp3`,
    `${audioBasePath}/introButtons.mp3`,
    `${audioBasePath}/loveBroccoli.mp3`,
    `${audioBasePath}/loveCake.mp3`,
    `${audioBasePath}/lullabyButton.mp3`,
    `${audioBasePath}/mario.mp3`,
    `${audioBasePath}/okayBroccoli.mp3`,
    `${audioBasePath}/okayCake.mp3`,
    `${audioBasePath}/readyForNext.mp3`,
    `${audioBasePath}/startListening.mp3`,
    `${audioBasePath}/takeAGuess.mp3`,
    `${audioBasePath}/tryAgain.mp3`,
    `${audioBasePath}/tryDance.mp3`,
    `${audioBasePath}/trySick.mp3`,
    `${audioBasePath}/trySleep.mp3`,
    `${audioBasePath}/wantToPlay.mp3`,
    `${audioBasePath}/whatSongUsedFor.mp3`,
    `${audioBasePath}/whatSongUsedForTest.mp3`,
    `${audioBasePath}/readyParent.mp3`,
    `${audioBasePath}/readyParentHeadphones.mp3`,
    // add these back when pushkinifying
    //`./${audioBasePath}/antiphase_HC_I.mp3`,
    //`./${audioBasePath}/antiphase_HC_O.mp3`,
    //`./${audioBasePath}/antiphase_HC_S.mp3`,
  ];

  var twinkle = new Audio(`${audioBasePath}/twinkle.mp3`);
  twinkle.id = "twinkle";
  var allDone = new Audio(`${audioBasePath}/allDone.mp3`);
  allDone.id = "allDone";
  var almostDone = new Audio(`${audioBasePath}/almostDone.mp3`);
  almostDone.id = "almostDone.mp3";
  var birthdayVoice = new Audio(`${audioBasePath}/birthdayVoice.mp3`);
  birthdayVoice.id = "birthdayVoice";
  var danceButton = new Audio(`${audioBasePath}/danceButton.mp3`);
  danceButton.id ="danceButton";
  var firstSong = new Audio(`${audioBasePath}/firstSong.mp3`);
  firstSong.id = "firstSong";
  var greatJob = new Audio(`${audioBasePath}/greatJob.mp3`);
  greatJob.id = "greatJob";
  var happyBirthday = new Audio(`${audioBasePath}/happyBirthday.mp3`);
  happyBirthday.id = "happyBirthday";
  var hateBroccoli = new Audio(`${audioBasePath}/hateBroccoli.mp3`);
  hateBroccoli.id = "hateBroccoli";
  var hateCake = new Audio(`${audioBasePath}/hateCake.mp3`);
  hateCake.id = "hateCake";
  var healButton = new Audio(`${audioBasePath}/healButton.mp3`);
  healButton.id = "healButton";
  var howMuchLikeSong = new Audio(`${audioBasePath}/howMuchLikeSong.mp3`);
  howMuchLikeSong.id = "howMuchLikeSong";
  var letsLearn = new Audio(`${audioBasePath}/letsLearn.mp3`);
  letsLearn.id = "letsLearn";
  var likeHappy = new Audio(`${audioBasePath}/likeHappy.mp3`);
  likeHappy.id = "likeHappy";
  var likeOkay = new Audio(`${audioBasePath}/likeOkay.mp3`);
  likeOkay.id = "likeOkay";
  var likePracticeCake = new Audio(`${audioBasePath}/likePracticeCake.mp3`);
  likePracticeCake.id = "likePracticeCake";
  var likePracticeBroccoli = new Audio(`${audioBasePath}/likePracticeBroccoli.mp3`);
  likePracticeBroccoli.id = "likePracticeBroccoli";
  var likeSad = new Audio(`${audioBasePath}/likeSad.mp3`);
  likeSad.id = "likeSad";
  var introLike = new Audio(`${audioBasePath}/introLike.mp3`);
  introLike.id = "introLike";
  var introButtons = new Audio(`${audioBasePath}/introButtons.mp3`);
  introButtons.id = "introButtons";
  var loveBroccoli = new Audio(`${audioBasePath}/loveBroccoli.mp3`);
  loveBroccoli.id = "loveBroccoli";
  var loveCake = new Audio(`${audioBasePath}/loveCake.mp3`);
  loveCake.id = "loveCake.mp3";
  var lullabyButton = new Audio(`${audioBasePath}/lullabyButton.mp3`);
  lullabyButton.id = "lullabyButton";
  var mario = new Audio(`${audioBasePath}/mario.mp3`);
  mario.id = "mario"
  var okayBroccoli = new Audio(`${audioBasePath}/okayBroccoli.mp3`);
  okayBroccoli.id = "okayBroccoli";
  var okayCake = new Audio(`${audioBasePath}/okayCake.mp3`);
  okayCake.id = "okayCake";
  var readyForNext = new Audio(`${audioBasePath}/readyForNext.mp3`);
  readyForNext.id = "readyForNext";
  var startListening = new Audio(`${audioBasePath}/startListening.mp3`);
  startListening.id = "startListening";
  var takeAGuess = new Audio(`${audioBasePath}/takeAGuess.mp3`);
  takeAGuess.id = "takeAGuess";
  var tryAgain = new Audio(`${audioBasePath}/tryAgain.mp3`);
  tryAgain.id = "tryAgain";
  var tryDance = new Audio(`${audioBasePath}/tryDance.mp3`);
  tryDance.id = "tryDance"
  var trySick = new Audio(`${audioBasePath}/trySick.mp3`);
  trySick.id = "trySick";
  var trySleep = new Audio(`${audioBasePath}/trySleep.mp3`);
  trySleep.id = "trySleep";
  var wantToPlay = new Audio(`${audioBasePath}/wantToPlay.mp3`);
  wantToPlay.id = "wantToPlay";
  var whatSongUsedFor = new Audio(`${audioBasePath}/whatSongUsedFor.mp3`);
  whatSongUsedFor.id = "whatSongUsedFor";
  var whatSongUsedForTest = new Audio(`${audioBasePath}/whatSongUsedForTest.mp3`);
  whatSongUsedForTest.id = "whatSongUsedForTest";
  var readyParent = new Audio(`${audioBasePath}/readyParent.mp3`);
  readyParent.id = "readyParent";
  var readyParentHeadphones = new Audio(`${audioBasePath}/readyParentHeadphones.mp3`);
  readyParentHeadphones.id = "readyParentHeadphones";

  var imagePreload = [
    song_list[0].image,
    song_list[1].image,
    song_list[2].image,
    song_list[3].image,
    song_list[4].image,
    song_list[5].image,
    `${imgBasePath}/pointingStar.gif`,
    `${imgBasePath}/rockOnStar.gif`,
    `${imgBasePath}/jumpingStar.gif`,
    `${imgBasePath}/thumbsUpStar.gif`,
    `${imgBasePath}/thumbsUpStar.png`,
    `${imgBasePath}/pointingStar.png`,
    `${imgBasePath}/rockOnStar.png`,
    `${imgBasePath}/jumpingStar.png`,
    `${imgBasePath}/lullaby.png`,
    `${imgBasePath}/lullabyH.png`,
    `${imgBasePath}/lullabyT.png`,
    `${imgBasePath}/lullabyTH.png`,
    `${imgBasePath}/dancing.png`,
    `${imgBasePath}/dancingH.png`,
    `${imgBasePath}/dancingT.png`,
    `${imgBasePath}/dancingTH.png`,
    `${imgBasePath}/healing.png`,
    `${imgBasePath}/healingH.png`,
    `${imgBasePath}/healingT.png`,
    `${imgBasePath}/healingTH.png`,
    `${imgBasePath}/face1.png`,
    `${imgBasePath}/face1T.png`,
    `${imgBasePath}/face2.png`,
    `${imgBasePath}/face2T.png`,
    `${imgBasePath}/face3.png`,
    `${imgBasePath}/face3T.png`,
    `${imgBasePath}/speechBubble1.png`,
    `${imgBasePath}/speechBubble2.png`,
    `${imgBasePath}/speechBubble3.png`,
    `${imgBasePath}/speechBubble3a.png`,
    `${imgBasePath}/speechBubble3b.png`,
    `${imgBasePath}/speechBubble4.png`,
    `${imgBasePath}/speechBubble4a.png`,
    `${imgBasePath}/speechBubble5.png`,
    `${imgBasePath}/speechBubble6.png`,
    `${imgBasePath}/speechBubble7.png`,
    `${imgBasePath}/speechBubble7a.png`,
    `${imgBasePath}/speechBubble8.png`,
    `${imgBasePath}/speechBubble8a.png`,
    `${imgBasePath}/speechBubble9.png`,
    `${imgBasePath}/speechBubble10.png`,
    `${imgBasePath}/speechBubble11.png`,
    `${imgBasePath}/speechBubble12.png`,
    `${imgBasePath}/speechBubble13.png`,
    `${imgBasePath}/speechBubble14.png`,
    `${imgBasePath}/speechBubble15.png`,
    `${imgBasePath}/speechBubble16.png`,
    `${imgBasePath}/speechBubble17.png`,
    `${imgBasePath}/speechBubble18.png`,
    `${imgBasePath}/speechBubble19.png`,
    `${imgBasePath}/speechBubble20.png`,
    `${imgBasePath}/speechBubble21.png`,
    `${imgBasePath}/speechBubble21a.png`,
    `${imgBasePath}/speechBubble22.png`,
    `${imgBasePath}/speechBubble23.png`,
    `${imgBasePath}/speechBubble24.png`,
    `${imgBasePath}/speechBubble25.png`,
    `${imgBasePath}/speechBubble26.png`,
    `${imgBasePath}/speechBubble27.png`,
    `${imgBasePath}/speechBubble28.png`,
    `${imgBasePath}/speechBubble28a.png`,
    `${imgBasePath}/speechBubbleNotQuite.png`,
    `${imgBasePath}/speechBubble15pts.png`,
    `${imgBasePath}/speechBubble20pts.png`,
    `${imgBasePath}/greenArrow.png`,
    `${imgBasePath}/cake.png`,
    `${imgBasePath}/cakeT.png`,
    `${imgBasePath}/cakeH.png`,
    `${imgBasePath}/christmasTree.png`,
    `${imgBasePath}/progressBar1.png`,
    `${imgBasePath}/progressBar2.png`,
    `${imgBasePath}/progressBar3.png`,
    `${imgBasePath}/progressBar4.png`,
    `${imgBasePath}/school.jpg`,
    `${imgBasePath}/schoolT.png`,
    `${imgBasePath}/bathtime.jpg`,
    `${imgBasePath}/bathtimeT.png`,
  ];

  /* Welcome - consent page */
  var welcome = {
    type: `html-button-response`,
    stimulus: `<p align="left">This experiment is being conducted by researchers at Harvard University. Before you decide to participate, please read the following information.</p><p align="left">We study how the mind works. Specifically, in this research we are investigating how infants and children make sense of the world, including the things they see and hear, the people they interact with, and the abstract worlds of music, arts, and other areas of cognition.</p><p align="left">We will play your child short clips of sounds. Some of the sounds will be music or speech, and he/she might listen to other sounds too. We will ask your child questions about what he/she hears, and may also ask him/her to compare sounds to one another. He/she can respond by speaking, pointing, writing, singing notes or melodies out loud, or choosing among a set of objects or pictures. The experiment usually takes about 10 minutes, but on occasion it may last longer. You or your child can take a break at any time.</p><p align="left">We will also ask you to answer questions concerning your emotions and behaviors, your preferences and beliefs about music and the arts, your engagement with musical activities, your personal history of musical exposure and training, and some demographic information about you and your family.</p><p align="left">This research has no known risks or anticipated direct benefits. You will not receive compensation for participating in this experiment. Your participation in this research is completely voluntary. You can end your participation at any time without penalty.</p><p align="left">Your participation is completely anonymous. Your responses will be stored securely on a server at Harvard University under password protection. Your experiment data may be shared with other researchers. The results and data from this experiment will be shared with the public. After the experiment, we will explain several ways to be informed about the research. If you have questions or problems, you can contact us at <a href="mailto:musiclab+tml@g.harvard.edu" target="_blank">musiclab+tml@g.harvard.edu</a>. By proceeding, you agree to participate in this experiment.</p>`,
    prompt: ``,
    choices: [`Next`],
    //on_finish: console.log(mobile)
  };
  welcome.on_finish = (x) => { api.onStartExperiment() }

  /* Begin parent section */
  var parentInfo = {
    timeline: [
      {
        timeline: [
          {
            type:`html-button-response`,
            stimulus:`<table align=center><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar1.png height=85 width=800></img></td></tr><tr><td><p align="center"><b>PARENTS, PLEASE READ THESE INSTRUCTIONS!</b> Kids, please ask a parent for help before playing.</p><p align="center">First, we have some questions <b>for a parent to answer</b>. Parents, please answer these questions yourself. Your child does not need to be present while you answer them.</p><p align="center">After these few questions, there will be a brief practice session before the game. The progress bar at the top will always indicate whose turn it is to play.</p></td></tr></table>`,
            choices: [`Next`]
          }
        ],
        conditional_function: function() {
          if (mobile == false) {
            return true
          } else {
            return false
          }
        }
      },
      {
        timeline: [
          {
            type:`html-button-response`,
            stimulus:`<table align=center><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar1.png height=85 width=800></img></td></tr><tr><td><p align="center"><b>PARENTS, PLEASE READ THESE INSTRUCTIONS!</b> Kids, please ask a parent for help before playing.</p><p align="center">First, we have some questions <b>for a parent to answer</b>. Parents, please answer these questions yourself. Your child does not need to be present while you answer them.</p><p align="center">After these few questions, there will be a brief practice session before the game.</p></td></tr></table>`,
            choices: [`Next`]
          }
        ],
        conditional_function: function() {
          if (mobile == true) {
            return true
          } else {
            return false
          }
        },
      }
    ]
  };

  var takenBefore = {
    type: `html-button-response-vert`,
    stimulus: `<table align=center><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar1.png height=85 width=800></img></td></tr><tr><td><p>Has your child played this game before?</p><p align="center">(It's OK if they have!)</p></td></tr></table>`,
    choices: [
      `Yes`,
      `No`
    ],
    data: {trialName: `takenBefore`},
  };

  var parentSing = {
    type: 'html-button-response-vert',
    stimulus: `<table align="top"><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar1.png height=85 width=800></img></td></tr><tr><td><p>How often do you sing to your child?</p></td></tr></table>`,
    prompt1: ' ',
    prompt2: ' ',
    choices: [
      'Once every 3 days or less',
      'Once every day or two',
      '2-3 times a day',
      '4-7 times a day',
      '8 or more times a day'
    ],
    data: {trialName: 'parentSing'},
  };
  var parentRecMusic = {
    type: 'html-button-response-vert',
    stimulus: `<table align="top"><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar1.png height=85 width=800></img></td></tr><tr><td><p>How often do you play recorded music to your child?</p></td></tr></table>`,
    prompt1: ' ',
    prompt2: ' ',
    choices: [
      'Once every 3 days or less',
      'Once every day or two',
      '2-3 times a day',
      '4-7 times a day',
      '8 or more times a day'
    ],
    data: {trialName: 'parentRecMusic'},
  };

  var gender = {
    type: `html-button-response-vert`,
    stimulus: `<table align=center><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar1.png height=85 width=800></img></td></tr><tr><td>What is your child's gender?</td></tr></table>`,
    choices: [
      `Male`,
      `Female`,
      `Other`
    ],
    data: {trialName: `gender`},
  };

  var ageList = [`3 or younger`, `4`, `5`, `6`, `7`, `8`, `9`, `10`, `11`, `12`, `13`, `14`, `15`, `16`, `17 or older`]
  var age = {
    type: `survey-text-dropdown`,
    questions: [{ prompt: `How old is your child? (in years)`, choices: ageList}],
    preamble: `<table align=center><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar1.png height=85 width=800></img></table>`,
    data: {trialName: `age`},
  };

  var countryList = [`Aotearoa/New Zealand`, `United States`, `Afghanistan`, `Albania`, `Algeria`, `Andorra`, `Angola`, `Antigua and Barbuda`, `Argentina`, `Armenia`, `Artsakh`, `Australia`, `Austria`, `Azerbaijan`, `The Bahamas`, `Bahrain`, `Bangladesh`, `Barbados`, `Belarus`, `Belgium`, `Belize`, `Benin`, `Bhutan`, `Bolivia`, `Bosnia and Herzegovina`, `Botswana`, `Brazil`, `Brunei`, `Bulgaria`, `Burkina Faso`, `Burundi`, `Cambodia`, `Cameroon`, `Canada`, `Cape Verde`, `Central African Republic`, `Chad`, `Chile`, `China`, `Colombia`, `Comoros`, `Democratic Republic of the Congo`, `Republic of the Congo`, `Democratic Republic of the Congo`, `Cook Islands`, `Costa Rica`, `Côte d'Ivoire`, `Croatia`, `Cuba`, `Cyprus`, `Czech Republic`, `Denmark`, `Djibouti`, `Dominica`, `Dominican Republic`, `East Timor`, `Ecuador`, `Egypt`, `El Salvador`, `Equatorial Guinea`, `Eritrea`, `Estonia`, `Ethiopia`, `Fiji`, `Finland`, `France`, `Gabon`, `The Gambia`, `Georgia`, `Germany`, `Ghana`, `Greece`, `Grenada`, `Guatemala`, `Guinea`, `Guinea-Bissau`, `Guyana`, `Haiti`, `Honduras`, `Hong Kong`, `Hungary`, `Iceland`, `India`, `Indonesia`, `Iran`, `Iraq`, `Ireland`, `Israel`, `Italy`, `Ivory Coast`, `Jamaica`, `Japan`, `Jordan`, `Kazakhstan`, `Kenya`, `Kiribati`, `South Korea`, `Democratic People's Republic of Korea`, `Kosovo`, `Kuwait`, `Kyrgyzstan`, `Laos`, `Latvia`, `Lebanon`, `Lesotho`, `Liberia`, `Libya`, `Liechtenstein`, `Lithuania`, `Luxembourg`, `Macedonia`, `Madagascar`, `Malawi`, `Malaysia`, `Maldives`, `Mali`, `Malta`, `Marshall Islands`, `Mauritania`, `Mauritius`, `Mexico`, `Micronesia`, `Moldova`, `Monaco`, `Mongolia`, `Montenegro`, `Morocco`, `Mozambique`, `Myanmar`, `Namibia`, `Nauru`, `Nepal`, `Kingdom of the Netherlands`, `Nicaragua`, `Niger`, `Nigeria`, `Niue`, `Northern Cyprus`, `Norway`, `Oman`, `Pakistan`, `Palau`, `Palestine`, `Panama`, `Papua New Guinea`, `Paraguay`, `Peru`, `Philippines`, `Poland`, `Portugal`, `Qatar`, `Romania`, `Russia`, `Rwanda`, `Sahrawi Arab Democratic Republic`, `Saint Kitts and Nevis`, `Saint Lucia`, `Saint Vincent and the Grenadines`, `Samoa`, `San Marino`, `São Tomé and Príncipe`, `Saudi Arabia`, `Senegal`, `Serbia`, `Seychelles`, `Sierra Leone`, `Singapore`, `Slovakia`, `Slovenia`, `Solomon Islands`, `Somalia`, `Somaliland`, `South Africa`, `South Ossetia`, `Spain`, `Sri Lanka`, `Sudan`, `South Sudan`, `Suriname`, `Swaziland`, `Sweden`, `Switzerland`, `Syria`, `Taiwan`, `Tajikistan`, `Tanzania`, `Thailand`, `Togo`, `Tonga`, `Transnistria`, `Trinidad and Tobago`, `Tunisia`, `Turkey`, `Turkmenistan`, `Tuvalu`, `Uganda`, `Ukraine`, `United Arab Emirates`, `United Kingdom`, `Uruguay`, `Uzbekistan`, `Vanuatu`, `Vatican City`, `Venezuela`, `Vietnam`, `Yemen`, `Zambia`, `Zimbabwe`]

  var country = {
    preamble: `<table align=center><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar1.png height=85 width=800></img></table>`,
    type: `survey-text-dropdown`,
    alert: `Please choose your country of residence from the dropdown menu.`,
    questions: [
      {
        prompt: `Where do you and your child live?`,
        choices: countryList
      }
    ],
    data: {trialName: `country`},prompt: `<table align=center><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar1.png height=85 width=800></img></table>`,
  };

  var langList = [`English`, `Te Reo Māori`, `Abenaki`, `Abkhaz`, `Adyghe`, `Afrikaans`, `Ainu`, `Aklanon`, `Alabama`, `Albanian`, `Algerian`, `American Sign Language`, `Apache`, `Arabic`, `Aragonese`, `Aramaic`, `Armenian`, `Avestan`, `Ayapathu`, `Aymara`, `Azeri`, `Balinese`, `Bamwe`, `Bantu`, `Basa`, `Basque`, `Belarusian`, `Bemba`, `Bengali`, `Berber`, `Betawi`, `Bicol`, `Bisaya`, `Bobangi`, `Bosnian`, `Brahui`, `Breton`, `Butuanon`, `Bukusu`, `Bulgarian`, `Burmese`, `Carib`, `Catalan`, `Catawba`, `Cayuga`, `Cebuano`, `Chamorro`, `Chechen`, `Cherokee`, `Chewa`, `Cheyenne`, `Chickasaw`, `Chinese/Cantonese/Yue`, `Chinese/Danzhou`, `Chinese/Gan`, `Chinese/Hakka`, `Chinese/Hokkien`, `Chinese/Mandarin`, `Chinese/Min Bei`, `Chinese/Min Dong`, `Chinese/Min Zhong`, `Chinese/Pu Xian`, `Chinese/Qiong Wen`, `Chinese/Shao Jiang`, `Chinese/Shaozhou Tuhua`, `Chinese/Taiwanese/Min Nan/Hokkien`, `Chinese/Wu/Shanghainese`, `Chinese/Xiang/Hunanese`, `Chinese/Xianghua`, `Chinese/Yue`, `Chinook`, `Ch'ol`, `Chorti`, `Cispa`, `Coptic`, `Cornish`, `Corsican`, `Cree`, `Creole`, `Croatian`, `Czech`, `Danish`, `Delaware`, `Demonh'ka`, `Denya`, `Duma`, `Dutch`, `Eggon`, `Ejagham`, `Ekegusii`, `Emakua`, `Eskimo`, `Esperanto`, `Estonian`, `Ewe`, `Fang`, `Faroese`, `Farsi`, `Finnish`, `Flemish`, `Frankish`, `French`, `Frisian`, `Fulfulde`, `Gaelic`, `Galician`, `Gaulish`, `Gamilaraay`, `Ganda`, `Gbari`, `Georgian`, `German`, `Gevove`, `Gilbertese`, `Ginyama`, `Gothic`, `Greek`, `Guarani`, `Gujarati`, `Gullah`, `Haida`, `Hakka`, `Hawaiian`, `Hausa`, `Hiligaynon`, `Hebrew`, `Hmong`, `Hindi`, `Hittite`, `Holoholo`, `Hungarian`, `Icelandic`, `Igbo`, `Ilongo`, `Indonesian`, `Ingush`, `Interlingua`, `Inuktitut`, `Inzebi`, `Irish`, `Ishkashmi`, `Italian`, `Jangshung`, `Japanese`, `Jita`, `Kalanga`, `Kannada`, `Kapampangan`, `Karelian`, `Kamviri`, `Karuk`, `Kashubian`, `Katcha`, `Kazakh`, `Kerewe`, `Khakas`, `Khmer`, `Khowar`, `Kiga`, `Kinyarwanda`, `Kituba`, `Klallam`, `Konkani`, `Korean`, `Koromfé`, `Koyo`, `Kurdish`, `Kyrgyz`, `Lao`, `Lakhota`, `Latgalian`, `Latin`, `Latvian`, `Lingala`, `Lithuanian`, `Livonian`, `Lojban`, `Lozi`, `Luxembourgish`, `Luwian`, `Lydian`, `Macedonian`, `Malagasy`, `Malay`, `Maliseet`, `Malayalam`, `Maltese`, `Mambwe`, `Manchu`, `Mandinka`, `Manx`, `Mapudungun`, `Marathi`, `Masaba`, `Mayan`, `Mayangna`, `Mawu`, `Miami`, `Michif`, `Miskitu`, `Mixtec`, `Mohawk`, `Mongolian`, `Mpongwe`, `Nahuatl`, `Nande`, `Nanticoke`, `Nauruan`, `Navajo`, `Ndebele`, `Nepalese`, `Newari`, `Nhirrpi`, `Norwegian`, `Nyambo`, `Nyamwezi`, `Occitan`, `Ojibwe`, `Olkola`, `Olutec`, `Onondaga`, `Oriya`, `Oscan`, `Oykangand`, `Pahlavi`, `Pakahn`, `Pali`, `Papiamento`, `Pashto`, `Pende`, `Passamdy`, `Phrygian`, `Pirahã`, `Polish`, `Popoluca`, `Portuguese`, `Potawatomi`, `Pulaar`, `Punjabi`, `Quechua`, `Quenya`, `Rapa Nui`, `Rasta`, `Rejang`, `Romani`, `Romanian`, `Roviana`, `Rotuman`, `Russian`, `Saanich`, `Saami`, `Samoan`, `Sanskrit`, `Sardinian`, `Scots`, `Serbian`, `Seri`, `Sherpa`, `Shi`, `Sina Bidoyoh`, `Shona`, `Shoshoni`, `Sindarin`, `Sinhalese`, `Slovak`, `Slovene`, `Sogdian`, `Somali`, `Sorbian`, `Spanish`, `Sranan`, `Sûdovian`, `Sumerian`, `Swabian`, `Swahili`, `Swedish`, `Swiss German`, `Tagalog`, `Tamasheq`, `Tahitian`, `Taino`, `Tajik`, `Tamazight`, `Tamil`, `Tarahumara`, `Tarok`, `Tatar`, `Telugu`, `Tetan`, `Thai`, `Tibetan`, `Tlingit`, `Tocharian`, `Tongan`, `Turkish`, `Turkmen`, `Twi`, `Ukrainian`, `Ulwa`, `Umbrian`, `Üqoi`, `Urdu`, `Uyghur`, `Uzbek`, `Venda`, `Veps`, `Vietnamese`, `Votic`, `Wagiman`, `Walloon`, `Warlpiri`, `Welsh`, `Wolof`, `Wyandot`, `Xhosa`, `Yaka`, `Yao`, `Yemba`, `Yiddish`, `Yoruba`, `Zarma`, `Zoque`, `Zulu`, `Other`]

  var language = {
    type: `survey-text-dropdown`,
    alert: `Please select your language from the dropdown menu.`,
    questions: [
      {
        prompt: `What is your child's native language?`,
        choices: langList
      }
    ],
    data: {trialName: `language`},
    preamble: `<table align=center><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar1.png height=85 width=800></img></table>`,
  };

  var hearingImpairment = {
    type: `html-button-response-vert`,
    stimulus: `<table align=center><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar1.png height=85 width=800></img></td></tr><tr><td>Does your child have a hearing impairment?</td></tr></table>`,
    prompt: ` `,
    choices: [
      `Yes`,
      `No`,
      `I don't know`
    ],
    data: {trialName: `hearingImp`},
  };

  var headphone = {
    timeline: [
      {
        type: 'html-button-response-vert',
        stimulus: `<table align=center><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar1.png height=85 width=800></img></td></tr><tr><td>
        <p align = "center">We would like your child to wear headphones during this game.</p><p align = "center">Do you have a pair of headphones available that your child can use?</p></td></tr></table>`,
        prompt1: ' ',
        prompt2: ' ',
        choices: ['Yes', 'No'],
        data: {trialName: 'headphone'}
      }
    ]
  };
  var headphonesYes;
  var noise = {
    timeline: [
      {
        type: 'html-button-response-vert',
        stimulus: `<table align=center><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar1.png height=85 width=800></img></td></tr><tr><td><p>Okay! Please put on the headphones so that you can adjust the volume</p><p align="center">We'll play you a short tune.</p><p>Turn up the volume on your device until the song is at a <b>loud but comfortable level</b>.</p><p>Press the button to continue.</p></td></tr></table>`,
        choices: [`Next`],
      },
      {
        type: 'audio-button-response-loop',
        stimulus: `${audioBasePath}/mario.mp3`,
        prompt:
          '<p>Adjust your volume to a comfortable level and press \"Continue\" when you\'re all done.</p>'+`${mobile ? '<p>The calibration sound is now playing. If you can’t hear it, make sure your device is not muted.</p>' : ''}`,
        choices: ['Continue'],
        response_ends_trial: true,
      }
    ]
  };

  var noiseNoHeadphone = {
    timeline: [
      {
        type: 'html-button-response-vert',
        stimulus: `<table align=center><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar1.png height=85 width=800></img></td></tr><tr><td><p align="center">Okay! Next we'll play you a short tune.</p><p>Turn up the volume on your device until the song is at a <b>loud but comfortable level</b>.</p><p>Press the button to continue.</p></td></tr></table>`,
        choices: [`Next`],
      },
      {
        type: 'audio-button-response-loop',
        stimulus: `${audioBasePath}/mario.mp3`,
        prompt:
          '<p>Adjust your volume to a comfortable level and press \"Continue\" when you\'re all done.</p>'+`${mobile ? '<p>The calibration sound is now playing. If you can’t hear it, make sure your device is not muted.</p>' : ''}`,
        choices: ['Continue'],
        response_ends_trial: true,
      }
    ]
  };

  var headphoneConditional = {
    timeline: [noise],
    conditional_function: function(data) {
      headphonesYes = jsPsych.data.get().last(1).values()[0].button_pressed;
      //console.log(headphonesYes);
      if (headphonesYes == 0) {
        return true;
      } else if (headphonesYes == 1) {
        return false;
      }
    }
  };

  var noHeadphoneConditional = {
    timeline: [noiseNoHeadphone],
    conditional_function: function(data) {
      //console.log(headphonesYes);
      if (headphonesYes == 1) {
        return true;
      } else if (headphonesYes == 0) {
        return false;
      }
    }
  };

  //Survey Timeline
  var parentSurveyTimeline = {
    timeline: [
      welcome,
      parentInfo,
      takenBefore,
      parentSing,
      parentRecMusic,
      gender,
      age,
      country,
      language,
      hearingImpairment,
      headphone,
      headphoneConditional,
      noHeadphoneConditional,
    ]
  };

  /* Introducing mascot and beginnning kids part */
  var preTraining = {
    type: `html-button-response`,
    choices: [`<b>Continue</b>`],
    timeline: [
      {
        timeline: [
          {
            stimulus: `<table align=center><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar1.png height=85 width=800></img></td></tr><tr><td><p align="center"><b>We are about to begin the practice session</b>. Please check that your child is ready to play!</p><p align="center">After the practice session is over we will ask you to help your child put on headphones, but for now, <b>your child should not wear headphones.</b></p><p align="center">It's ok for you to help your child during the practice session, but please don't help your child during the real game.</p></td></tr></table>`,
            choices: [`Start practice session`],
          },
        ],
        conditional_function: function(){
          //console.log (headphonesYes);
          if (headphonesYes == 0) {
            return true;
            } else {
            return false;
        }
      },
    },
    {
      timeline: [
        {
          stimulus: `<table align=center><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar1.png height=85 width=800></img></td></tr><tr><td><p><b>We are about to begin the practice session</b>. Please turn up your device's volume and check that your child is ready to play!</p><p>It's ok for you to help your child during the practice session, but please don't help your child during the real game.</p></td></tr></table>`,
          choices: [`Start practice session`],
        },
      ],
      conditional_function: function(){
        //console.log (headphonesYes);
        if (headphonesYes == 1) {
          return true;
          } else {
          return false;
        }
      },
    },
    {
      type: `html-button-response`,
      stimulus: function(){
        wantToPlay.currentTime = 0;
        wantToPlay.play();
        return `<table><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar2.png height=85 width=800></img></td></tr><tr><td><img src=${imgBasePath}/pointingStar.gif class="susie-scale"></img></img><img src=${imgBasePath}/speechBubble1.png class="speechBubble-scale"></img></td></tr></table><p align="center">`
      },
      choices: [`<img align=center src=${imgBasePath}/greenArrow.png class="arrow-scale"></img>`],
      on_finish: function() {
        wantToPlay.pause();
      }
    },
    {
      type: `html-button-response`,
      stimulus: function(){
        letsLearn.currentTime = 0;
        letsLearn.play();
        return `<table><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar2.png height=85 width=800></img></td></tr><tr><td><img src=${imgBasePath}/pointingStar.gif class="susie-scale"></img><img src=${imgBasePath}/speechBubble2.png class="speechBubble-scale"></img></tr></table><p align="center">`
      },
      choices: [`<img align=center src=${imgBasePath}/greenArrow.png class="arrow-scale"></img>`],
      on_finish: function() {
        letsLearn.pause();
      }
    },
    ],
  };

  /* Training Trial1 */
  var birthdaySong = {
    choices: [`<img align=center src=${imgBasePath}/greenArrow.png class="arrow-scale"></img>`],
    timeline: [
    {
      type: `audio-countdown-keyboard-response`,
      wave: true,
      countdown: false,
      choices: `q`,
      stimulus: `${audioBasePath}/happyBirthday.mp3`,
      trial_ends_after_audio: true
    },
  ],
};
  var birthdayTraining = {
    timeline: [
    {
      type: `audio-countdown-keyboard-response`,
      stimulus: `${audioBasePath}/birthdayIntro.mp3`,
      countdown: false,
      choices: `q`,
      trial_ends_after_audio: true,
      prompt: `<table align=center><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar2.png height=85 width=800></img></td></tr><tr><td><img src=${imgBasePath}/pointingStar.gif class="susie-scale"></img><img src=${imgBasePath}/speechBubble3.png class="speechBubble-scale"></img></td></tr></table>` + birthdayButtons[0] + birthdayButtons[1] + birthdayButtons[2],
    },
    {
      type: `audio-countdown-keyboard-response`,
      stimulus: `${audioBasePath}/birthdayShow.mp3`,
      countdown: false,
      choices: `q`,
      trial_ends_after_audio: true,
      prompt: function() {
        birthdayButtons[0] = `<img src=${imgBasePath}/cakeH.png hspace="16" class="button-scale-h"></img>`;
        return `<table align=center><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar2.png height=85 width=800></img></td></tr><tr><td><img src=${imgBasePath}/pointingStar.gif class="susie-scale"></img><img src=${imgBasePath}/speechBubble3a.png class="speechBubble-scale"></img></td></tr></table>` + birthdayButtons[0] + birthdayButtons[1] + birthdayButtons[2]
      },
      on_finish: function() {
        birthdayButtons[0] = `<img src=${imgBasePath}/cakeT.png hspace="16" class="button-scale-tbl"></img>`;
      }
    },
    {
      type: `html-button-response`,
      stimulus: function(){
        whatSongUsedFor.currentTime = 0;
        whatSongUsedFor.play();
        return `<table><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar2.png height=85 width=800></img></td></tr><tr><table><tr><img src=${imgBasePath}/pointingStar.gif class="susie-scale"></img><img src=${imgBasePath}/speechBubble3b.png class="speechBubble-scale"></img></tr></table><p align="center">`
      },
      choices: [`<table align="center"><tr><td><img src=${imgBasePath}/cake.png class="button-scale-tbl"></img></td></tr><tr><td><p class="font-scale">Singing for a Birthday</p></td></tr></table>`,`<table align="center"><tr><td><img src=${imgBasePath}/bathtime.jpg class="button-scale-tbl"></img></td></tr><tr><td><p class="font-scale">Singing for Bathtime</p></td></tr></table>`,`<table align="center"><tr><td><img src=${imgBasePath}/school.jpg class="button-scale-tbl"></img></td></tr><tr><td><p class="font-scale">Singing for School Assembly</p></td></tr></table>`],
      on_finish: function() {
        whatSongUsedFor.pause();
      },
    },
    {
      timeline: [
        {
          type: `html-button-response`,
          stimulus: function(){
            tryAgain.currentTime = 0;
            tryAgain.play();
            return `<table align=center><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar2.png height=85 width=800></img></td></tr><tr><td><img src=${imgBasePath}/pointingStar.gif class="susie-scale"></img><img src=${imgBasePath}/speechBubbleNotQuite.png class="speechBubble-scale"></img></tr></table>`
          },
          choices: [`<img align=center src=${imgBasePath}/greenArrow.png class="arrow-scale"></img>`],
          on_finish: function() {
            tryAgain.pause();
          },
        },
      ],
      conditional_function: function(){
        buttonPressed = jsPsych.data.get().last(1).values()[0].button_pressed;
        //console.log (buttonPressed);
        if (buttonPressed == 0) {
          return false;
        } else {
          return true;
        }
      },
    },
    ],
    loop_function: function(){
      //console.log (buttonPressed);
      if (buttonPressed == 0) {
        return false;
      } else {
        return true;
      }
    }
  };

  //Button Training
  var buttonPressed;
  var introButtons = {
    type: `audio-countdown-keyboard-response`,
    stimulus: `${audioBasePath}/introButtons.mp3`,
    countdown: false,
    choices: `q`,
    trial_ends_after_audio: true,
    prompt: `<table align=center><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar2.png height=85 width=800></img></td></tr><tr><td><img src=${imgBasePath}/pointingStar.gif class="susie-scale"></img></img><img src=${imgBasePath}/speechBubble4.png class="speechBubble-scale"></img></td></tr></table>` + trainingButtons[0] + trainingButtons[1] + trainingButtons[2],
    choices: `q`,
  };

  var buttonTrainingDancing = {
    type: `html-button-response`,
    timeline: [
      {
        stimulus: function(){
          danceButton.currentTime = 0;
          danceButton.play();
          return `<table align=center><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar2.png height=85 width=800></img></td></tr><tr><td><img src=${imgBasePath}/pointingStar.gif class="susie-scale"></img><img src=${imgBasePath}/speechBubble4a.png class="speechBubble-scale"></img></table>`
        },
        choices: function() {
          buttons[dancing] = `<table align="center" class="potrait-tbl"><tr><td><img src=${imgBasePath}/dancingH.png class="button-scale-h"></img></td></tr><tr><td><p class="font-scale">Singing for Dancing</p></td></tr></table>`;
          return [buttons[0], buttons[1], buttons[2]]
        },
          on_finish: function() {
            danceButton.pause();
          },
      },
      {
        timeline: [
          {
            type: `html-button-response`,
            stimulus: function(){
              tryAgain.currentTime = 0;
              tryAgain.play();
              return `<table align=center><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar2.png height=85 width=800></img></td></tr><tr><td><img src=${imgBasePath}/pointingStar.gif class="susie-scale"></img><img src=${imgBasePath}/speechBubbleNotQuite.png class="speechBubble-scale"></img></tr></table>`
            },
            choices: [`<img align=center src=${imgBasePath}/greenArrow.png class="arrow-scale"></img>`],
            on_finish: function() {
              tryAgain.pause();
            },
          },
        ],
        conditional_function: function(){
          buttonPressed = jsPsych.data.get().last(1).values()[0].button_pressed;
          //console.log (buttonPressed);
          if (buttonPressed == dancing) {
            return false;
          } else {
            return true;
          }
        },
      },
    ],
    loop_function: function(){
      //console.log (buttonPressed);
      if (buttonPressed == dancing) {
        return false;
      } else {
        return true;
      }
    }
  };

  var buttonTrainingLullaby = {
    type: `html-button-response`,
    timeline: [
      {
        stimulus: function(){
          lullabyButton.currentTime = 0;
          lullabyButton.play();
          return `<table align=center><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar2.png height=85 width=800></img></td></tr><tr><td><img src=${imgBasePath}/pointingStar.gif class="susie-scale"></img><img src=${imgBasePath}/speechBubble5.png class="speechBubble-scale"></img></table>`
        },
        choices: function() {
          buttons[dancing] = `<table align="center" class="potrait-tbl"><tr><td><img src=${imgBasePath}/dancing.png class="button-scale-tbl"></img></td></tr><tr><td><p class="font-scale">Singing for Dancing</p></td></tr></table>`;
          buttons[lullaby] = `<table align="center" class="potrait-tbl"><tr><td><img src=${imgBasePath}/lullabyH.png class="button-scale-h"></img></td></tr><tr><td><p class="font-scale">To Put a Baby to Sleep</p></td></tr></table>`;
          return [buttons[0], buttons[1], buttons[2]]
        },
        on_finish: function() {
          lullabyButton.pause();
        },
      },
      {
        timeline: [
          {
            type: `html-button-response`,
            stimulus: function(){
              tryAgain.currentTime = 0;
              tryAgain.play();
              return `<table align=center><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar2.png height=85 width=800></img></td></tr><tr><td><img src=${imgBasePath}/pointingStar.gif class="susie-scale"></img><img src=${imgBasePath}/speechBubbleNotQuite.png class="speechBubble-scale"></img></tr></table>`
            },
            choices: [`<img align=center src=${imgBasePath}/greenArrow.png class="arrow-scale"></img>`],
            on_finish: function() {
              tryAgain.pause();
            },
          },
        ],
        conditional_function: function(){
          buttonPressed = jsPsych.data.get().last(1).values()[0].button_pressed;
          //console.log (buttonPressed);
          if (buttonPressed == lullaby) {
            return false;
          } else {
            return true;
          }
        },
      },
    ],
    loop_function: function(){
      //console.log (buttonPressed);
      if (buttonPressed == lullaby) {
        return false;
      } else {
        return true;
      }
    }
  };

  var buttonTrainingHealing = {
    type: `html-button-response`,
    timeline: [
      {
        stimulus: function(){
          healButton.currentTime = 0;
          healButton.play();
          return `<table align=center><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar2.png height=85 width=800></img></td></tr><tr><td><img src=${imgBasePath}/pointingStar.gif class="susie-scale"></img><img src=${imgBasePath}/speechBubble6.png class="speechBubble-scale"></img></table>`
        },
        choices: function() {
          buttons[lullaby] = `<table align="center" class="potrait-tbl"><tr><td><img src=${imgBasePath}/lullaby.png class="button-scale-tbl"></img></td></tr><tr><td><p class="font-scale">To Put a Baby to Sleep</p></td></tr></table>`
          buttons[healing] = `<table align="center" class="potrait-tbl"><tr><td><img src=${imgBasePath}/healingH.png class="button-scale-h"></img></td></tr><tr><td><p class="font-scale">Singing for Healing</p></td></tr></table>`;
          return [buttons[0], buttons[1], buttons[2]]
        },
        on_finish: function() {
          healButton.pause();
        },
      },
      {
        timeline: [
          {
            type: `html-button-response`,
            stimulus: function(){
              tryAgain.currentTime = 0;
              tryAgain.play();
              return `<table align=center><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar2.png height=85 width=800></img></td></tr><tr><td><img src=${imgBasePath}/pointingStar.gif class="susie-scale"></img><img src=${imgBasePath}/speechBubbleNotQuite.png class="speechBubble-scale"></img></tr></table>`
            },
            choices: [`<img align=center src=${imgBasePath}/greenArrow.png class="arrow-scale"></img>`],
            on_finish: function() {
              tryAgain.pause();
            },
          },
        ],
        conditional_function: function(){
          buttonPressed = jsPsych.data.get().last(1).values()[0].button_pressed;
          //console.log (buttonPressed);
          if (buttonPressed == healing) {
            return false;
          } else {
            return true;
          }
        },
      },
    ],
    loop_function: function(){
      //console.log (buttonPressed);
      if (buttonPressed == healing) {
        return false;
      } else {
        return true;
      }
    }
  };

  //Like Training
  var likeTraining1 = {
    type: `html-button-response`,
    choices: [`<img align=center src=${imgBasePath}/greenArrow.png class="arrow-scale"></img>`],
    timeline: [
    {
      type: `audio-countdown-keyboard-response`,
      stimulus: `${audioBasePath}/introLike.mp3`,
      countdown: false,
      choices: `q`,
      trial_ends_after_audio: true,
      prompt: `<table align=center><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar2.png height=85 width=800></img></td></tr><tr><td><img src=${imgBasePath}/pointingStar.gif class="susie-scale"></img></img><img src=${imgBasePath}/speechBubble7.png class="speechBubble-scale"></img></td></tr></table>` + likeButtonImg[0] + likeButtonImg[1] + likeButtonImg[2],
      choices: `q`
    },
    {
      stimulus: function(){
        likeHappy.currentTime = 0;
        likeHappy.play();
        return `<table align=center><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar2.png height=85 width=800></img></td></tr><tr><td><img src=${imgBasePath}/pointingStar.gif class="susie-scale"></img><img src=${imgBasePath}/speechBubble7a.png class="speechBubble-scale"></img></table>`
      },
      choices: [`<table align=center><tr><td><img src=${imgBasePath}/face1.png class="button-scale-tbl"></img></td></table>`, `<table align="center"><tr><td><img src=${imgBasePath}/face2.png class="button-scale-tbl"></img></td></table>`, `<table align="center"><tr><td><img src=${imgBasePath}/face3.png class="button-scale-h"></img></td></table>`],
      on_finish: function() {
        likeHappy.pause();
      },
    },
    {
      timeline: [
        {
          type: `html-button-response`,
          stimulus: function(){
            tryAgain.currentTime = 0;
            tryAgain.play();
            return `<table align=center><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar2.png height=85 width=800></img></td></tr><tr><td><img src=${imgBasePath}/pointingStar.gif class="susie-scale"></img><img src=${imgBasePath}/speechBubbleNotQuite.png class="speechBubble-scale"></img></tr></table>`
          },
          choices: [`<img align=center src=${imgBasePath}/greenArrow.png class="arrow-scale"></img>`],
          on_finish: function() {
            tryAgain.pause();
          },
        },
      ],
      conditional_function: function(){
        var buttonPressed = jsPsych.data.get().last(1).values()[0].button_pressed;
        //console.log (buttonPressed);
        if (buttonPressed == 2) {
          return false;
        } else {
          return true;
        }
      },
    },
    ],
    loop_function: function(){
      var buttonPressed = jsPsych.data.get().last(1).values()[0].button_pressed;
      //console.log (buttonPressed);
      if (buttonPressed == 2) {
        return false;
      } else {
        return true;
      }
    }
  };

  var likeTraining2 = {
    type: `html-button-response`,
    choices: [`<img align=center src=${imgBasePath}/greenArrow.png class="arrow-scale"></img>`],
    timeline: [
    {
      stimulus: function(){
        likeSad.currentTime = 0;
        likeSad.play();
        return `<table align=center><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar2.png height=85 width=800></img></td></tr><tr><td><img src=${imgBasePath}/pointingStar.gif class="susie-scale"></img><img src=${imgBasePath}/speechBubble8a.png class="speechBubble-scale"></img></table>`
      },
      choices: [`<table align="center"><tr><td><img src=${imgBasePath}/face1.png class="button-scale-h"></img></td></table>`, `<table align="center"><tr><td><img src=${imgBasePath}/face2.png class="button-scale-tbl"></img></td></table>`, `<table align="center"><tr><td><img src=${imgBasePath}/face3.png class="button-scale-tbl"></img></td></table>`],
      on_finish: function() {
        likeSad.pause();
      },
    },
    {
      timeline: [
        {
          type: `html-button-response`,
          stimulus: function(){
            tryAgain.currentTime = 0;
            tryAgain.play();
            return `<table align=center><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar2.png height=85 width=800></img></td></tr><tr><td><img src=${imgBasePath}/pointingStar.gif class="susie-scale"></img><img src=${imgBasePath}/speechBubbleNotQuite.png class="speechBubble-scale"></img></tr></table>`
          },
          choices: [`<img align=center src=${imgBasePath}/greenArrow.png class="arrow-scale"></img>`],
          on_finish: function() {
            tryAgain.pause();
          },
        },
      ],
      conditional_function: function(){
        buttonPressed = jsPsych.data.get().last(1).values()[0].button_pressed;
        //console.log (buttonPressed);
        if (buttonPressed == 0) {
          return false;
        } else {
          return true;
        }
      },
    },
    ],
    loop_function: function(){
      //console.log (buttonPressed);
      if (buttonPressed == 0) {
        return false;
      } else {
        return true;
      }
    }
  };

  var likeTraining3 = {
    type: `html-button-response`,
    choices: [`<img align=center src=${imgBasePath}/greenArrow.png class="arrow-scale"></img>`],
    timeline: [
    {
      stimulus: function(){
        likeOkay.currentTime = 0;
        likeOkay.play();
        return `<table align=center><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar2.png height=85 width=800></img></td></tr><tr><td><img src=${imgBasePath}/pointingStar.gif class="susie-scale"></img><img src=${imgBasePath}/speechBubble8.png class="speechBubble-scale"></img></table>`
      },
      choices: [`<table align="center"><tr><td><img src=${imgBasePath}/face1.png class="button-scale-tbl"></img></td></table>`, `<table align="center"><tr><td><img src=${imgBasePath}/face2.png class="button-scale-h"></img></td></table>`, `<table align="center"><tr><td><img src=${imgBasePath}/face3.png class="button-scale-tbl"></img></td></table>`],
      on_finish: function() {
        likeOkay.pause();
      },
    },
    {
      timeline: [
        {
          type: `html-button-response`,
          stimulus: function(){
            tryAgain.currentTime = 0;
            tryAgain.play();
            return `<table align=center><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar2.png height=85 width=800></img></td></tr><tr><td><img src=${imgBasePath}/pointingStar.gif class="susie-scale"></img><img src=${imgBasePath}/speechBubbleNotQuite.png class="speechBubble-scale"></img></tr></table>`
          },
          choices: [`<img align=center src=${imgBasePath}/greenArrow.png class="arrow-scale"></img>`],
          on_finish: function() {
            tryAgain.pause();
          },
        },
      ],
      conditional_function: function(){
        var buttonPressed = jsPsych.data.get().last(1).values()[0].button_pressed;
        //console.log (buttonPressed);
        if (buttonPressed == 1) {
          return false;
        } else {
          return true;
        }
      },
    },
    ],
    loop_function: function(){
      var buttonPressed = jsPsych.data.get().last(1).values()[0].button_pressed;
      //console.log (buttonPressed);
      if (buttonPressed == 1) {
        return false;
      } else {
        return true;
      }
    }
  };

  var likeTraining = {
    type: `html-button-response`,
    choices: [`<img align=center src=${imgBasePath}/greenArrow.png class="arrow-scale"></img>`],
    timeline: [
    {
      stimulus: function(){
        likePracticeCake.currentTime = 0;
        likePracticeCake.play();
        return `<table align=center><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar2.png height=85 width=800></img></td></tr><tr><td><img src=${imgBasePath}/pointingStar.gif class="susie-scale"></img><img src=${imgBasePath}/speechBubble9.png class="speechBubble-scale"></img></tr></table>`
      },
      choices: likeButtons,
      on_finish: function(data){
        likePracticeCake.pause();
        userResp = data.button_pressed;
        if (userResp == 0) userResp = likeButtons[0];
        if (userResp == 1) userResp = likeButtons[1];
        if (userResp == 2) userResp = likeButtons[2];
      }
    },
    {
      timeline: [
        {
          stimulus: function(){
            hateCake.currentTime = 0;
            hateCake.play();
            return `<table align=center><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar2.png height=85 width=800></img></td></tr><tr><td><img src=${imgBasePath}/thumbsUpStar.gif class="susie-scale"></img><img src=${imgBasePath}/speechBubble11.png class="speechBubble-scale"></img></tr></table>`
          },
          on_finish: function() {
            hateCake.pause();
          },
        },
      ],
      conditional_function: function(){
        if (userResp == likeButtons[0]) {
          return true;
        } else {
          return false;
        }
      },
    },
    {
      timeline: [
        {
          stimulus: function(){
            okayCake.currentTime = 0;
            okayCake.play();
            return `<table align=center><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar2.png height=85 width=800></img></td></tr><tr><td><img src=${imgBasePath}/thumbsUpStar.gif class="susie-scale"></img><img src=${imgBasePath}/speechBubble12.png class="speechBubble-scale"></img></tr></table>`
          },
          on_finish: function() {
            okayCake.pause();
          },
        },
      ],
      conditional_function: function(){
        if (userResp == likeButtons[1]) {
          return true;
        } else {
          return false;
        }
      },
    },
    {
      timeline: [
        {
          stimulus: function(){
            loveCake.currentTime = 0;
            loveCake.play();
            return `<table align=center><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar2.png height=85 width=800></img></td></tr><tr><td><img src=${imgBasePath}/thumbsUpStar.gif class="susie-scale"></img><img src=${imgBasePath}/speechBubble10.png class="speechBubble-scale"></img></tr></table>`
          },
          on_finish: function() {
            loveCake.pause();
          },
        },
      ],
      conditional_function: function(){
        if (userResp == likeButtons[2]) {
          return true;
        } else {
          return false;
        }
      },
    },
    {
      stimulus: function(){
        likePracticeBroccoli.currentTime = 0;
        likePracticeBroccoli.play();
        return `<table align=center><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar2.png height=85 width=800></img></td></tr><tr><td><img src=${imgBasePath}/pointingStar.gif class="susie-scale"></img><img src=${imgBasePath}/speechBubble13.png class="speechBubble-scale"></img></tr></table>`
      },
      choices: likeButtons,
      on_finish: function(data){
        likePracticeBroccoli.pause();
        userResp = data.button_pressed;
        if (userResp == 0) userResp = likeButtons[0];
        if (userResp == 1) userResp = likeButtons[1];
        if (userResp == 2) userResp = likeButtons[2];
      }
    },
    {
      timeline: [
        {
          stimulus: function(){
            hateBroccoli.currentTime = 0;
            hateBroccoli.play();
            return `<table align=center><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar2.png height=85 width=800></img></td></tr><tr><td><img src=${imgBasePath}/thumbsUpStar.gif class="susie-scale"></img><img src=${imgBasePath}/speechBubble15.png class="speechBubble-scale"></img></tr></table>`
          },
          on_finish: function() {
            hateBroccoli.pause();
          },
        },
      ],
      conditional_function: function(){
        if (userResp == likeButtons[0]) {
          return true;
        } else {
          return false;
        }
      },
    },
    {
      timeline: [
        {
          stimulus: function(){
            okayBroccoli.currentTime = 0;
            okayBroccoli.play();
            return `<table align=center><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar2.png height=85 width=800></img></td></tr><tr><td><img src=${imgBasePath}/thumbsUpStar.gif class="susie-scale"></img><img src=${imgBasePath}/speechBubble16.png class="speechBubble-scale"></img></tr></table>`
          },
          on_finish: function() {
            okayBroccoli.pause();
          },
        },
      ],
      conditional_function: function(){
        if (userResp == likeButtons[1]) {
          return true;
        } else {
          return false;
        }
      },
    },
    {
      timeline: [
        {
          stimulus: function(){
            loveBroccoli.currentTime = 0;
            loveBroccoli.play();
            return `<table align=center><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar2.png height=85 width=800></img></td></tr><tr><td><img src=${imgBasePath}/thumbsUpStar.gif class="susie-scale"></img><img src=${imgBasePath}/speechBubble14.png class="speechBubble-scale"></img></tr></table>`
          },
          on_finish: function() {
            loveBroccoli.pause();
          },
        },
      ],
      conditional_function: function(){
        if (userResp == likeButtons[2]) {
          return true;
        } else {
          return false;
        }
      },
    },
    {
      type: `html-button-response`,
      stimulus: function(){
        startListening.currentTime = 0;
        startListening.play();
        return `<table align=center><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar2.png height=85 width=800></img></td></tr><tr><td><img src=${imgBasePath}/pointingStar.gif class="susie-scale"></img><img src=${imgBasePath}/speechBubble17.png class="speechBubble-scale"></img></tr></table>`
      },
      on_finish: function() {
        startListening.pause();
      },
    },
    ],
  }

  var repeatAllTrainingTrial;
  var repeatAllTrainingTrialQ = {
    type: `html-button-response`,
    stimulus: `<table><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar2.png height=85 width=800></img></td></tr><tr><td><b>PARENTS:</b> We are now ready to begin the game. Before we start, <b>do you think your child understands how to play?</b></p><p align="center">If not, you can choose to do the practice session one more time.</td></tr></table>`,
    choices: [`Yes, let's get started`, `No, let's practice again`],
    on_finish: function(data){
      if (data.button_pressed == 0) repeatAllTrainingTrial = false;
      if (data.button_pressed == 1) repeatAllTrainingTrial = true;
    }
  };

  var repeatAllTrainingTrialLoop = {
    timeline: [
      preTraining,
      birthdaySong,
      birthdayTraining,
      introButtons,
      buttonTrainingDancing,
      buttonTrainingLullaby,
      buttonTrainingHealing,
      likeTraining1,
      likeTraining2,
      likeTraining3,
      likeTraining,
      repeatAllTrainingTrialQ
    ],
    conditional_function: function(){
      if (repeatAllTrainingTrial == true) return true;
      if (repeatAllTrainingTrial == false) return false;
    },
    loop_function: function(){
      if (repeatAllTrainingTrial == true) return true;
      if (repeatAllTrainingTrial == false) return false;
    },
  };

  /*Pre experiment prompt*/

  /*Entire Training Timeline*/
  var trainingTimeline = {
    timeline: [
      preTraining,
      birthdaySong,
      birthdayTraining,
      introButtons,
      buttonTrainingDancing,
      buttonTrainingLullaby,
      buttonTrainingHealing,
      likeTraining1,
      likeTraining2,
      likeTraining3,
      likeTraining,
      repeatAllTrainingTrialQ,
      repeatAllTrainingTrialLoop,
    ]
  };


  /* Experiment */
  songTestNo = 0;
  headphonesYes = 0;
  var songTest = {
    timeline: [
      {
        timeline: [
          {
            timeline: [
              {
                type: `html-button-response`,
                stimulus: `<table><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar2.png height=85 width=800></img></td></tr><tr><td><p align=center><b>PARENTS:</b> If you have headphones available, please help your child to put them on now.</p></td></tr></table>`,
                choices: [`Continue`],
              },
            ],
            conditional_function: function(){
              //console.log (headphonesYes);
              if (headphonesYes == 1) {
                return true;
                } else {
                return false;
              }
            },
          },
          {
            type: `audio-countdown-keyboard-response`,
            stimulus: `${audioBasePath}/firstSong.mp3`,
            prompt: function() {
              return `<table align=center><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar3.png height=85 width=800></img></td></tr><tr><td><img src=${imgBasePath}/pointingStar.gif class="susie-scale"></img></img><img src=${imgBasePath}/speechBubble18.png class="speechBubble-scale"></img></td></tr></table>` + trainingButtons[0] + trainingButtons[1] + trainingButtons[2]
            },
            data: {trialName: `song_like_dislike`},
            choices: `q`,
            countdown: false,
            trial_ends_after_audio: true,
          },
          {
            type: `audio-countdown-keyboard-response`,
            stimulus: `${audioBasePath}/trySick.mp3`,
            prompt: function() {
              trainingButtons[healing] = `<img align=center src=${imgBasePath}/healingTH.png hspace="16" class="button-scale-h"></img>`;
              return `<table align=center><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar3.png height=85 width=800></img></td></tr><tr><td><img src=${imgBasePath}/pointingStar.gif class="susie-scale"></img></img><img src=${imgBasePath}/speechBubble19.png class="speechBubble-scale"></img></td></tr></table>` + trainingButtons[0] + trainingButtons[1] + trainingButtons[2]
            },
            data: {trialName: `song_like_dislike`},
            choices: `q`,
            countdown: false,
            trial_ends_after_audio: true,
            on_finish: function() {
              trainingButtons[healing] = `<img align=center src=${imgBasePath}/healingT.png hspace="16" class="button-scale"></img>`;
            }
          },
          {
            type: `audio-countdown-keyboard-response`,
            stimulus: `${audioBasePath}/trySleep.mp3`,
            prompt: function() {
              trainingButtons[lullaby] = `<img align=center src=${imgBasePath}/lullabyTH.png hspace="16" class="button-scale-h"></img>`;
              return `<table align=center><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar3.png height=85 width=800></img></td></tr><tr><td><img src=${imgBasePath}/pointingStar.gif class="susie-scale"></img></img><img src=${imgBasePath}/speechBubble20.png class="speechBubble-scale"></img></td></tr></table>` + trainingButtons[0] + trainingButtons[1] + trainingButtons[2]
            },
            data: {trialName: `song_like_dislike`},
            choices: `q`,
            countdown: false,
            trial_ends_after_audio: true,
            on_finish: function() {
              trainingButtons[lullaby] = `<img align=center src=${imgBasePath}/lullabyT.png hspace="16" class="button-scale"></img>`;
            }
          },
          {
            type: `audio-countdown-keyboard-response`,
            stimulus: `${audioBasePath}/tryDance.mp3`,
            prompt: function() {
              trainingButtons[dancing] = `<img align=center src=${imgBasePath}/dancingTH.png hspace="16" class="button-scale-h"></img>`;
              return `<table align=center><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar3.png height=85 width=800></img></td></tr><tr><td><img src=${imgBasePath}/pointingStar.gif class="susie-scale"></img></img><img src=${imgBasePath}/speechBubble21.png class="speechBubble-scale"></img></td></tr></table>` + trainingButtons[0] + trainingButtons[1] + trainingButtons[2]
            },
            data: {trialName: `song_like_dislike`},
            choices: `q`,
            countdown: false,
            trial_ends_after_audio: true,
            on_finish: function() {
              trainingButtons[dancing] = `<img align=center src=${imgBasePath}/dancingT.png hspace="16" class="button-scale"></img>`;
            }
          },
          {
            type: `audio-countdown-keyboard-response`,
            stimulus: `${audioBasePath}/takeAGuess.mp3`,
            prompt: `<table align=center><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar3.png height=85 width=800></img></td></tr><tr><td><img src=${imgBasePath}/pointingStar.gif class="susie-scale"></img></img><img src=${imgBasePath}/speechBubble21a.png class="speechBubble-scale"></img></td></tr></table>` + trainingButtons[0] + trainingButtons[1] + trainingButtons[2],
            data: {trialName: `song_like_dislike`},
            choices: `q`,
            countdown: false,
            trial_ends_after_audio: true
          },
        ],
        conditional_function: function(){
          if (songTestNo == 0) {
            return true;
          } else {
            return false;
          }
        },
      },
      {
        type: `audio-countdown-keyboard-response`,
        wave: true,
        countdown: false,
        prompt: `<table align=center><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar3.png height=85 width=800></img></td></tr></table>`,
        choices: `q`,
        stimulus: jsPsych.timelineVariable(`stimulus`),
        trial_ends_after_audio: true,
        on_finish: function(data) {
          songsHeard.push(data.stimulus);
          var fileNumber = data.stimulus.match(/[0-9]{3}/g);
          numbersHeard.push(parseInt(fileNumber-1));
          lat = data.lat;
          lng = data.lng;
        }
      },
      {
        type: `html-button-response`,
        stimulus: function(){
          whatSongUsedForTest.currentTime = 0;
          whatSongUsedForTest.play();
          return `<table align=center><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar3.png height=85 width=800></img></td></tr><tr><td><img src=${imgBasePath}/pointingStar.gif class="susie-scale"></img><img src=${imgBasePath}/speechBubble22.png class="speechBubble-scale"></img></td></tr></table>`
        },
        choices: function(){
          buttons[healing] = `<table align="center" class="potrait-tbl"><tr><td><img src=${imgBasePath}/healing.png class="button-scale-tbl"></img></td></tr><tr><td><p class="font-scale">Singing for Healing</p></td></tr></table>`;
          return buttons
        },
        data: jsPsych.timelineVariable(`data`),
        on_finish: function(data) {
          whatSongUsedForTest.pause();
          data.correct = data.button_pressed == data.correct_responseM;
          count = jsPsych.data.get().filter({correct: true}).count();
          reaction = jsPsych.data.get().select(`rt`);
          songPlay = data.stimulus;
          correctResp = data.correct_response;
          userResp = data.button_pressed;
          userRespM = data.button_pressed;
          songTestNo += 1;
          if (data.correct == true) currentScore = 20;
          if (data.correct == false) currentScore = 15;
          score += currentScore;
          if (userResp == 0) userResp = buttons[0];
          if (userResp == 1) userResp = buttons[1];
          if (userResp == 2) userResp = buttons[2];
          data.userResp = userResp;
          data.count = count;
          //console.log(reaction);
          //console.log(count);
          //console.log(songPlay);
          //console.log(correctResp);
          //console.log(userResp);
          //console.log(userRespM);
          //console.log(currentScore);
          //console.log(score);
          //console.log(data.correct_responseM);
          //console.log(data.correct_response);
          //console.log(data.correct);
          if (count == "8") percentile = "100%";
          if (count == "7") percentile = "99.9%";
          if (count == "6") percentile = "98%";
          if (count == "5") percentile = "92%";
          if (count == "4") percentile = "76%";
          if (count == "3") percentile = "50%";
          if (count == "2") percentile = "24%";
          if (count == "1") percentile = "7%";
          if (count == "0") percentile = "1%";
          //console.log(percentile);
          //console.log(song_list)
        }
      },
      {
        type: `audio-countdown-keyboard-response`,
        stimulus:`${audioBasePath}/greatJob.mp3`,
        countdown: false,
        trial_ends_after_audio: true,
        prompt: function() {
          if (currentScore == 15) return `<table><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar3.png height=85 width=800></img></td></tr><tr><td><img src=${imgBasePath}/pointingStar.gif class="susie-scale"></img><img src=${imgBasePath}/speechBubble15pts.png class="speechBubble-scale"></img></td></tr></table>`;
          if (currentScore == 20) return `<table><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar3.png height=85 width=800></img></td></tr><tr><td><img src=${imgBasePath}/pointingStar.gif class="susie-scale"></img><img src=${imgBasePath}/speechBubble20pts.png class="speechBubble-scale"></img></td></tr></table>`
        },
        choices: `q`,
      },
      {
        type: `html-button-response`,
        stimulus: function(){
          howMuchLikeSong.currentTime = 0;
          howMuchLikeSong.play();
          return `<table align=center><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar3.png height=85 width=800></img></td></tr><tr><td><img src=${imgBasePath}/pointingStar.gif class="susie-scale"></img><img src=${imgBasePath}/speechBubble24.png class="speechBubble-scale"></img></td></tr></table>`
        },
        data: {trialName: `song_like_dislike`},
        choices: likeButtons,
        on_finish: function() {
          howMuchLikeSong.pause();
        },
      },
      {
        timeline: [
          {
            type:`html-button-response`,
            stimulus: function(){
              almostDone.currentTime = 0;
              almostDone.play();
              return `<table><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar3.png height=85 width=800></img></td></tr><tr><td><img src=${imgBasePath}/pointingStar.gif class="susie-scale"></img><img src=${imgBasePath}/speechBubble26.png class="speechBubble-scale"></img></td></tr></table>`
            },
            choices: [`<img align=center src=${imgBasePath}/greenArrow.png class="arrow-scale"></img>`],
            on_finish: function() {
              almostDone.pause();
            },
          },
        ],
        conditional_function: function(){
          if (songTestNo == 4) {
            return true;
          } else {
            return false;
            }
        },
      },
      {
        timeline: [
          {
            type: `html-button-response`,
            stimulus: function(){
              readyForNext.currentTime = 0;
              readyForNext.play();
              return `<table><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar3.png height=85 width=800></img></td></tr><tr><td><img src=${imgBasePath}/pointingStar.gif class="susie-scale"></img><img src=${imgBasePath}/speechBubble25.png class="speechBubble-scale"></img></td></tr></table>`
            },
            choices: [`<img align=center src=${imgBasePath}/greenArrow.png class="arrow-scale"></img>`],
            on_finish: function() {
              readyForNext.pause();
            },
          },
        ],
        conditional_function: function(){
          if (songTestNo == 6 || songTestNo == 4) {
            return false;
          } else {
            return true;
          }
        },
      },
      {
        timeline: [
          {
            type: `audio-countdown-keyboard-response`,
            stimulus: `${audioBasePath}/allDone.mp3`,
            prompt: `<table align="center"><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar3.png height=85 width=800></img></td></tr><tr><td><img src=${imgBasePath}/pointingStar.gif class="susie-scale"></img><img src=${imgBasePath}/speechBubble27.png class="speechBubble-scale"></img></td></table>`,
            data: {trialName: `song_like_dislike`},
            choices: `q`,
            countdown: false,
            trial_ends_after_audio: true
          },
          {
            type: `html-button-response`,
            stimulus: function(){
              readyParent.currentTime = 0;
              readyParent.play();
              return `<table><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar3.png height=85 width=800></img></td></tr><tr><td><img src=${imgBasePath}/pointingStar.gif class="susie-scale"></img><img src=${imgBasePath}/speechBubble28a.png class="speechBubble-scale"></img></td></tr></table>`
            },
            choices: [`<img align=center src=${imgBasePath}/greenArrow.png class="arrow-scale"></img>`],
            on_finish: function() {
              readyParent.pause();
            },
          },
        ],
        conditional_function: function(){
          if (songTestNo == 6 && headphonesYes == 0) {
            return true;
          } else {
            return false;
          }
        },
      },
      {
        timeline: [
          {
            type: `audio-countdown-keyboard-response`,
            stimulus: `${audioBasePath}/allDone.mp3`,
            prompt: `<table align="center"><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar3.png height=85 width=800></img></td></tr><tr><td><img src=${imgBasePath}/pointingStar.gif class="susie-scale"></img><img src=${imgBasePath}/speechBubble27.png class="speechBubble-scale"></img></td></tr></table>`,
            data: {trialName: `song_like_dislike`},
            choices: `q`,
            countdown: false,
            trial_ends_after_audio: true
          },
          {
            type: `html-button-response`,
            stimulus: function(){
              readyParentHeadphones.currentTime = 0;
              readyParentHeadphones.play();
              return `<table><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar3.png height=85 width=800></img></td></tr><tr><td><img src=${imgBasePath}/pointingStar.gif class="susie-scale"></img><img src=${imgBasePath}/speechBubble28.png class="speechBubble-scale"></img></td></tr></table>`
            },
            choices: [`<img align=center src=${imgBasePath}/greenArrow.png class="arrow-scale"></img>`],
            on_finish: function() {
              readyParentHeadphones.pause();
            },
          },
        ],
        conditional_function: function(){
          if (songTestNo == 6 && headphonesYes == 1) {
            return true;
          } else {
            return false;
          }
        },
      },
    ],
    timeline_variables: song_list,
  };
  let reaction

  var postTestQuestions = {
    timeline: [
      {
        type: `html-button-response`,
        choices: [`Continue`],
        stimulus: `<table><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar4.png height=85 width=800></img></td></tr><tr><td><p align = "center">Thanks for helping your child to play today! Last, we'd like to ask you a couple questions.</p></td></tr></table>`
      },
      {
        stimulus: `<table><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar4.png height=85 width=800></img></td></tr><tr><td><p align="center">Did your child wear headphones during this experiment?</p></td></tr></table>`,
        type: `html-button-response`,
        choices: [`Yes`, `No`],
      },
      {
        stimulus: `<table><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar4.png height=85 width=800></img></td></tr><tr><td><p align="center">Did you help your child at all during the practice session?</p></td></tr></table>`,
        type: `html-button-response`,
        choices: [`Yes`, `No`],
      },
      {
        stimulus: `<table><tr><td><img class="hide-on-mobile" align=center src=${imgBasePath}/progressBar4.png height=85 width=800></img></td></tr><tr><td><p align="center">Did you help your child at all during the real game?</p></td></tr></table>`,
        type: `html-button-response`,
        choices: [`Yes`, `No`],
      },
      {
        preamble: `<table align="center"><tr><td><img class="hide-on-mobile" align="center" src=${imgBasePath}/progressBar4.png height=85 width=800></img></td></tr></table>`,
        type: `survey-text`,
        questions: [{prompt:`<p align="center"><b>Thanks for playing the World Music Quiz!</b></p><p align="center"> We’re still testing out this game and would love your feedback so we can make it better and easier to play. Please write any comments in the box below, including anything you and/or your child noticed, found challenging or confusing, or anything else you’d like to tell us.</p><p align="center"><i>(if not, please leave the box blank)</i></p>`, rows: 5, columns: 30,}],
        button_label: [`Continue`],
      },
    ],
  };

  /* Feedback and debrief */

  var social = {
    type: 'react',
    on_start: function(){
      api.onFinishExperiment();
    },
    component: () => {
      let post = `My kid scored `+score+` points on the World Music Quiz! You and your child can be citizen scientists too at themusiclab.org!`; //remove this?

      let songsFinal = [
        {info: info[numbersHeard[0]].citation, image: `${baseUrl}/quizzes/fc/img/NHSDiscography-`+info[numbersHeard[0]].track+`-pic.jpg`, stimulus: songsHeard[0], raw: `${baseUrl}/quizzes/fc/audio/TML-RAW-`+info[numbersHeard[0]].track+`.mp3`, location: [info[numbersHeard[0]].latitude, info[numbersHeard[0]].longitude]},
        {info: info[numbersHeard[1]].citation, image: `${baseUrl}/quizzes/fc/img/NHSDiscography-`+info[numbersHeard[1]].track+`-pic.jpg`, stimulus: songsHeard[1], raw: `${baseUrl}/quizzes/fc/audio/TML-RAW-`+info[numbersHeard[1]].track+`.mp3`, location: [info[numbersHeard[1]].latitude, info[numbersHeard[1]].longitude]},
        {info: info[numbersHeard[2]].citation, image: `${baseUrl}/quizzes/fc/img/NHSDiscography-`+info[numbersHeard[2]].track+`-pic.jpg`, stimulus: songsHeard[2], raw: `${baseUrl}/quizzes/fc/audio/TML-RAW-`+info[numbersHeard[2]].track+`.mp3`, location: [info[numbersHeard[2]].latitude, info[numbersHeard[2]].longitude]},
        {info: info[numbersHeard[3]].citation, image: `${baseUrl}/quizzes/fc/img/NHSDiscography-`+info[numbersHeard[3]].track+`-pic.jpg`, stimulus: songsHeard[3], raw: `${baseUrl}/quizzes/fc/audio/TML-RAW-`+info[numbersHeard[3]].track+`.mp3`, location: [info[numbersHeard[3]].latitude, info[numbersHeard[3]].longitude]},
        {info: info[numbersHeard[4]].citation, image: `${baseUrl}/quizzes/fc/img/NHSDiscography-`+info[numbersHeard[4]].track+`-pic.jpg`, stimulus: songsHeard[4], raw: `${baseUrl}/quizzes/fc/audio/TML-RAW-`+info[numbersHeard[4]].track+`.mp3`, location: [info[numbersHeard[4]].latitude, info[numbersHeard[4]].longitude]},
        {info: info[numbersHeard[5]].citation, image: `${baseUrl}/quizzes/fc/img/NHSDiscography-`+info[numbersHeard[5]].track+`-pic.jpg`, stimulus: songsHeard[5], raw: `${baseUrl}/quizzes/fc/audio/TML-RAW-`+info[numbersHeard[5]].track+`.mp3`, location: [info[numbersHeard[5]].latitude, info[numbersHeard[5]].longitude]}
      ];

      return (
        <ExperimentEndPage id={experimentInfo.id} shareTitle={post} hideSocialIntro={true}>
          <h1>Wow! You scored <b>{score} points</b>!</h1>
          <p align="center" style={{ display: mobile ? 'none' : ''}}>
            To listen again to the songs you heard, and to learn more about them, explore this world map:
          </p>
          <div style={{ display: mobile ? 'none' : ''}}>
            <ReactMap songdata={songsFinal} label={''}></ReactMap>
          </div>
          <p align="left">
            In previous research, we found that adult listeners are quite good at guessing what a song from an unfamiliar culture is used for in the society where it was recorded. For instance, listeners can usually tell that a song is used to soothe a baby when they are listening to a song that is <i>actually</i> used as a lullaby, wherever it was recorded. You can read more about that research in <a href="https://www.theatlantic.com/science/archive/2018/01/the-search-for-universal-qualities-in-music-heats-up/551447/?utm_source=twb" target="_blank">The Atlantic.</a>
          </p>
          <p align="left">
            In the game you just played, we are interested to find out whether children can guess what these songs are used for, and whether their own experiences with music might predict the accuracy of their guesses. For instance, children who listen to a whole lot of music may be more accurate guessers than people who don't listen to much music.
          </p>
          <p align="left">
            Keep in touch with us in the next few months to find out the answer! You can also follow us on <a href="https://twitter.com/_themusiclab" target="_blank">Twitter</a> or <a href="https://www.facebook.com/harvardmusiclab" target="_blank">Facebook</a> to hear updates about our findings.
          </p>
          <p align="left">
            <b>If you and your child enjoyed being citizen scientists,</b> share <a href="http://themusiclab.org" target="_blank">themusiclab.org</a> with your friends so that they can play too!
          </p>
        </ExperimentEndPage>
      )}
  };

  timeline.push(
    parentSurveyTimeline,
    trainingTimeline,
    songTest,
    postTestQuestions,
    emailFollowup,
    social
  );

  api.checkTimeline(timeline);

  // ==== Paste before here ====

  options.targetElement.focus();
  options.targetElement.style.outline = `none`;

  // ==== Init Experiment ====
  jsPsych.init({
    timeline: timeline,
    preload_audio: audioPreload,
    preload_images: imagePreload,

    use_webaudio: true,
    show_progress_bar: false,

    display_element: options.targetElement,

    on_trial_finish: function(data) {
      // Save data for *every* trial
      api.saveDataOnFinish(data)

      // Fix keys not being registered
      options.targetElement.focus();
      options.targetElement.style.outline = `none`;

      // Reset to top of page
      window.scrollTo(0,0)
    },
  });
}
/* eslint-disable max-len */
