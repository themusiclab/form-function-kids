##jspsych-display-prediction plugin

The display prediction plugin takes as input 2 arrays of "predictions" and displays those in a table with 2 columns.

###Parameters

The following table lists the parameters associated with this plugin. Parameters with the default value of *undefined* must be specified. 

| Parameter| Type| Default Value| Description|
| ---------|:---:|:------------:|:-----------|
|prediction1|array|*undefined*|An array containing the predictions you want displayed in the first column. 
|prediction3|array|*undefined*|An array containing the predictions you want displayed in the second column.|buttonText|string|*undefined*|The text you want to use for the button that allows the participant to continue to the next trial.
|prompt1|string|*undefined*|The  title of the first column of predictions.
|prompt2|string|*undefined*|The  title of the second column of predictions.
|quizURL|string|empty string|The quiz URL to be used for social media sharing.
|subjectLine|string|empty string|The subject line to be used for emails when results are shared via email.
|teaserPart1|string|empty string|First part of the teaser text that will appear near the top of the page.
|teaserPart2|string|empty string|Second part of the teaser text that will appear near the top of the page.
|teaserPart3|string|empty string|Third part of the teaser text that will appear near the top of the page.
|buttonText|string|'Finish'|The text displayed on the button which triggers end of trial. 
|socialSharing|boolean|*undefined*|If set to true, the social media buttons will appear and the quiz taker will be able to share their results via email, facebook, twitter or weibo. If set to false, text encouraging the participant to fill out demographic questions will appear.
|encourageDemographics|string|''|Text to encourage participants to answer demographic questions.
|mailButtonImg|string|''|Path to image to be used for the mail button for social sharing.
|fbButtonImg|string|''|Path to image to be used for the Facebook button for social sharing.
|twitterButtonImg|string|''|Path to image to be used for the Twitter button for social sharing.
|weiboButtonImg|string|''|Path to image to be used for the Weibo button for social sharing.



###Data Generated

This plugin generates no data.


###How to assemble the teaser
The teaser is optional. If you do not want to use it, do not provide ANY VALUES for teaserPart1, teaserPart2, or teaserPart3 and the teaser div will not get created.

The teaser is constructed as follows:

[text part 1] [top prediction for the first category] [text part 2] [top prediction for the second category] [text part 3]

The top predictions are automatically taken from th prediction1 and prediction2 arrays. teaserPart1, teaserPart2 and teaserPart3 correspond to text part 1, text part 2 and text part 3 in the above breakdown. They can be any string.

The whole teaser is assembled from the input for those plugin parameters and the top predictions, and is presented near the top of the page. Any string is allowed for teaserPart1, teaserPart2, and teaserPart3. An example of a teaser with the code and the trial it produces is shown below.



###Example

```
var test = {
  type:'display-prediction',
  prompt1:"Our top guesses for your native language:",
  prompt2:"Our top guesses for your dialect:",
  prediction1:['Some Guess 1', 'Some Guess 2', 'Some Guess 3'],
  prediction2:['Some Guess', 'Another Guess'],
  buttonText:'Continue',
  quizURL:'http://www.gameswithwords.org/WhichEnglish/',
  subjectLine: 'Mapping English grammar around the world.',
  teaserPart1: "I helped GamesWithWords.org train their algorithm to guess which English I speak (http://www.gameswithwords.org/WhichEnglish/). It guessed that I speak ",
  teaserPart2:". ",
  teaserPart3:" is my dialect. Which English do you speak?",
  socialSharing:false,
  encourageDemographics: 'Please continue to answer some demographic questions and help us train our algorithm!',
  mailButtonImg:`${baseUrl}/quizzes/email.png`,
  fbButtonImg: `${baseUrl}/quizzes/fb.png`,
  twitterButtonImg: `${baseUrl}/quizzes/twitter.png`,
  weiboButtonImg: `${baseUrl}/quizzes/weibo.png`,
}



```

produces:



![alt text][logo2]

[logo2]:  https://github.com/marielajennings/jspsych-display-prediction/raw/master/pic2.png


while

```
var test = {
  type:'display-prediction',
  prompt1:"Our top guesses for your native language:",
  prompt2:"Our top guesses for your dialect:",
  prediction1:['Some Guess 1', 'Some Guess 2', 'Some Guess 3'],
  prediction2:['Some Guess', 'Another Guess'],
  buttonText:'Continue',
  quizURL:'http://www.gameswithwords.org/WhichEnglish/',
  subjectLine: 'Mapping English grammar around the world.',
  teaserPart1: "I helped GamesWithWords.org train their algorithm to guess which English I speak (http://www.gameswithwords.org/WhichEnglish/). It guessed that I speak ",
  teaserPart2:". ",
  teaserPart3:" is my dialect. Which English do you speak?",
  socialSharing:true,
  encourageDemographics: 'Please continue to answer some demographic questions and help us train our algorithm!',
  mailButtonImg:`${baseUrl}/quizzes/email.png`,
  fbButtonImg: `${baseUrl}/quizzes/fb.png`,
  twitterButtonImg: `${baseUrl}/quizzes/twitter.png`,
  weiboButtonImg: `${baseUrl}/quizzes/weibo.png`,
}

```

produces:

![alt text][logo]
[logo]: https://github.com/marielajennings/jspsych-display-prediction/raw/master/pic1.png "Logo Title Text 2"
