
# Children infer the behavioral contexts of unfamiliar foreign songs

This is the repository for Hilton and Crowley-de Thierry et al. (2022). "Children infer the behavioral contexts of unfamiliar foreign songs". The manuscript is publicly available at https://psyarxiv.com/rz6qn/.

You can find the following here:
- an R Markdown file that generates the manuscript
- data, analysis, and visualization code to produce the results reported in the manuscript
- supplementary data and materials
- code to run the experiment

Further data and information are available elsewhere: 
- the Natural History of Song audio excerpts, used in the experiment, are available at https://osf.io/vcybz; these can be explored interactively at https://themusiclab.org/nhsplots
- the preregistration for the study is at https://osf.io/56zne
- you can participate in the naïve listener experiment at <https://themusiclab.org/quizzes/kfc>

**For assistance, please contact the corresponding authors: Courtney Hilton (courtneyhilton@g.harvard.edu), Liam Crowley-de Thierry (liam.crowleydethierry@vuw.ac.nz), and Samuel Mehr (sam@wjh.harvard.edu).**

## Anatomy of the repo

To render the paper, run the code in `/writing/manuscript.Rmd`.

> **Warning**  
> The manuscript file combines output from several `.Rmd` files devoted to analysis, visualization, and the like. The `full_run` flag in `manuscript.Rmd` determines whether analyses and figures should be generated from scratch (which can take > 30 minutes), or not. By default, it is set to `FALSE`, to save knitting time. If you set it to `TRUE`, all preprocessing, analysis, and visualization code will be run.

### Data and analysis code

Data files are in `/data`, in `csv` format. The chilren's and adults' raw data contains identifiable information (such as email addresses), so in those cases we posted processed, de-identified versions of the datasets in `/results` (with associated processing code at `/analysis/preprocessing.R`). 

Scripts for preprocessing the data and running the analyses are in `/analysis`.

Preprocessed data, interim datasets, output of models, and the like are in `/results`.

### Visualizations

Visualization code is in `/viz`, along with images and static data used for non-dynamic visualizations. The `/viz/figures` subdirectory contains static images produced by `figures.Rmd`, which can be regenerated with a `full_run` of `manuscript.Rmd`.

### Materials

Research materials are in `/materials`, and include two versions of the kids' experiment. The first, `experiment-Pushkin.js` is the code actually used to collect the data reported in the paper, distributed via Pushkin at <https://themusiclab.org/quizzes/kfc>. This code will only run via Pushkin, so it will not execute as-is; we have posted it here for transparency.

The second version, `experiment-jsPsych.html`, and associated jsPsych files, is a version of the same experiment converted to run in standalone jsPsych (i.e., without Pushkin or any other software). While this code was not actually used to collect data, we made it to facilitate demonstration of the experiment. It can be used to understand the structure of the code that *was* used to collect data and is intended for informational/educational purposes. It is not a direct replication of the experiment reported in the paper. To try the demonstration experiment, clone this repository and open `experiment-jsPsych.html` in a browser.
