/**
 *
 * Social media sharing and quiz debrief, made by Constance M Bainbridge @ Harvard Music Lab
 *
 * Adapted from Mariela Jennings jspsych-display-prediction plugin
 *
**/

function definePlugin (){
var plugin = {};

plugin.info= {
	name: 'display-prediction',
	description: 'This plugin displays a prediction in a visually appealing way!',
	parameters: {
		quizURL: {
			type: [jsPsych.plugins.parameterType.STRING],
			default: null,
			description: 'URL to be used with social media post'
		},
		subjectLine: {
			type: [jsPsych.plugins.parameterType.STRING],
			default: null,
			description: 'Subject line for an email (something to do with the quiz the participant just took)'
		},
		teaserPart1: {
			type: [jsPsych.plugins.parameterType.STRING],
			default: '',
			description: 'teaser about your results part 1'
		},
		teaserShare: {
			type: [jsPsych.plugins.parameterType.STRING],
			default: '',
			description: 'share on social'
		},
		socialPost1: {
			type: [jsPsych.plugins.parameterType.STRING],
			default: '',
			description: 'teaser about your results part 3'
		},
		buttonText: {
			type: [jsPsych.plugins.parameterType.STRING],
			default: 'Finish',
			description: 'Button label'
		},
		mailButtonImg:{
			type: [jsPsych.plugins.parameterType.STRING],
			default: '',
			description: 'Path to image to be used for the mail button.'
		},
		fbButtonImg:{
			type: [jsPsych.plugins.parameterType.STRING],
			default: '',
			description: 'Path to image to be used for the Facebook button.'
		},
		twitterButtonImg:{
			type: [jsPsych.plugins.parameterType.STRING],
			default: '',
			description: 'Path to image to be used for the Twitter button.'
		},
		weiboButtonImg:{
			type: [jsPsych.plugins.parameterType.STRING],
			default: '',
			description: 'Path to image to be used for the Weibo button.'
		},
		footer:{
			type: [jsPsych.plugins.parameterType.STRING],
			default: ' ',
			description: 'Footer html'
		}
	}
};

plugin.trial= function (display_element, trial) {
  var _join = function( /*args*/ ) {
      var arr = Array.prototype.slice.call(arguments, _join.length);
      return arr.join(separator = '-');
    }

if (trial.teaserPart1 != '' || trial.teaserShare != '' || trial.socialPost1 != '' ){

//assembling the trial
var teaserDiv = document.createElement("div")
display_element.appendChild(teaserDiv)

//text and results for page
teaserDiv.innerHTML +='<div style="font-family:Arial;">'+trial.teaserPart1+'</div><div>'+trial.teaserShare+'</div>';
}

//text and results to post to social medi
var teaser = trial.socialPost1;

///buttons
var socialDiv = document.createElement('div');

var mailimg = document.createElement('img')
mailimg.src = trial.mailButtonImg
mailimg.setAttribute("height", "50");
mailimg.setAttribute("width", "50");
var mailTo = document.createElement('a');
mailTo.href = 'mailto:?body='+teaser+trial.quizURL+'&subject='+trial.subjectLine;
mailTo.target ="_blank";
mailTo.appendChild(mailimg);
socialDiv.appendChild(mailTo);

display_element.appendChild(socialDiv)

var fbimg = document.createElement('img')
fbimg.src = trial.fbButtonImg
fbimg.setAttribute("height", "50");
fbimg.setAttribute("width", "50");
var fblink = document.createElement('a');
fblink.href = 'https://www.facebook.com/sharer.php?u='+trial.quizURL;
fblink.target ="_blank";
fblink.appendChild(fbimg);
socialDiv.appendChild(fblink);

var twitterimg = document.createElement('img')
twitterimg.src = trial.twitterButtonImg
twitterimg.setAttribute("height", "50");
twitterimg.setAttribute("width", "50");
var twitterlink = document.createElement('a');
twitterlink.href = 'https://twitter.com/intent/tweet?url='+trial.quizURL+'&text='+teaser;
twitterlink.target ="_blank";
twitterlink.appendChild(twitterimg);
socialDiv.appendChild(twitterlink);

/* Add in to be able to preview data output
var buttonDiv = document.createElement('div')
buttonDiv.innerHTML+='<br><br><br>'
display_element.appendChild(buttonDiv)
var button = document.createElement('button');
button.setAttribute('type','button');
button.setAttribute('class', 'jspsych-btn')
buttonDiv.appendChild(button);
button.innerHTML=trial.buttonText;
button.addEventListener('click', () => {jsPsych.finishTrial({})});
buttonDiv.innerHTML+='<br><br><br>';
*/

var webDiv = document.createElement('div')
display_element.appendChild(webDiv)
webDiv.innerHTML+=trial.footer;

}
return plugin;
}

jsPsych.plugins['display-prediction'] = definePlugin() ;
