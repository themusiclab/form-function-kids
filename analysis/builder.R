## TML-KFC builder script
# constructs clean datasets for both:
# - KFC data (kids)
# - FC data (adults)

# Libraries ---------------------------------------------------------------
library(plyr) # note loading plyr BEFORE tidyverse so that tidyverse functions get preferred in namespace
library(tidyverse)
library(here)

fc_update <- FALSE # use this to update the FC data as well as KFC

# custom functions
`%nin%` <- Negate(`%in%`)
`%.%` <- paste0

#^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^#
#^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^#
# Part 1: Kids data -------------------------------------------------------
#^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^#
#^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^#

# Load raw data -----------------------------------------------------------

kfcFullDataset <- read_csv(
  file = here("data", "big", "kfc_stimulusResponses_processed.csv.gz"),
  col_names = TRUE,
  col_types = cols(.default = col_character()),
  guess_max = 100000) %>%
  # basic cleaning
  mutate(across(c("id","user_id", "rt", "button_pressed", "trial_index", "time_elapsed"), as.numeric),
         response = coalesce(response, responses)) %>% 
  # sorting the rows within participant by trial index
  group_by(user_id) %>% 
  arrange(trial_index, .by_group = TRUE) %>% 
  ungroup()

prac <- kfcFullDataset %>% 
  # adding whether they got the  "press the birthday button trial" correct
  mutate(prac_correct = case_when(
    stimulus == "/quizzes/kfc/audio/birthdayShow.mp3" &
      lead(button_pressed, 1) == 0  ~ TRUE,
    stimulus == "/quizzes/kfc/audio/birthdayShow.mp3" &
      lead(button_pressed, 1) %in% c(1,2)  ~ FALSE
  )
  ) %>% 
  select(user_id, prac_correct) %>% 
  drop_na()

# # pull out responses of whether participants say they understand how to play
# understands <- kfcFullDataset %>%
#   filter(str_detect(stimulus, "do you think your child understands how to play?")) %>%
#   mutate(understand = ifelse(button_pressed == 0, 1, 0)) %>%
#   select(user_id, understand)
#   
# extract dates participants started the experiment
date <- kfcFullDataset %>% 
  group_by(user_id) %>% 
  summarise(date = first(created_at))

# Preprocess --------------------------------------------------------------

# 1 row = 1 participant. Columns = their info
covariates <- kfcFullDataset %>% 
  mutate(
    # parent help
    trialName = case_when(
      # add info for 'parentHelp'
      grepl("help your child at all during the real game", stimulus) ~ "parentHelp",
      # add info for whether they understood training trials
      str_detect(stimulus, "do you think your child understands how to play?") ~ "understand",
      TRUE ~ trialName
    ),
    # trialName = ifelse(grepl("help your child at all during the real game", stimulus), "parentHelp", trialName),
    response = ifelse(trialName == "parentHelp" | trialName == "understand", button_pressed, response) # 1 = no, 0 = yes
  ) %>% 
  select(id, user_id, trialName, response) %>% 
  filter(trialName %in% c("age", "country", "gender", "takenBefore", "language", "hearingImp",
                          "parentSing", "parentRecMusic", "headphone", "parentHelp", "understand")) %>% 
  pivot_wider(id_cols = user_id, names_from = trialName, values_from = response, values_fn = first) %>% 
  mutate(
    # extract age
    age = str_extract(age, "(?<=name: ).*(?=[\"])"),
    # extract country
    country = str_extract(country, "(?<=name: ).*(?=[\"])"),
    # extract language
    language = str_extract(language, "(?<=name: ).*(?=[\"])")
    ) %>% 
  # ensuring column names same as in the old preprocessed data
  rename(headphones = headphone, playedBefore = takenBefore,
         singOften = parentSing, playMusicOften = parentRecMusic,
         hearingImpairment = hearingImp) %>% 
  left_join(., prac, by = "user_id") %>% 
  left_join(., date, by = "user_id")

# 1 row = 1 song per participant. Columns = their guess, liking, etc
trial_data <- kfcFullDataset %>% 
  arrange(user_id) %>% # ensures rows grouped by participants, needed for likert 
  mutate(
    # add likert column
    likert = ifelse(grepl("speechBubble24", stimulus), button_pressed, ""),
    trialName = ifelse(grepl("speechBubble24", stimulus), "likert", trialName),
    # remove RTs for non song trials to make pivoting easier
    rt = ifelse(trialName == "songType", rt, NA)
  ) %>% 
  # add song number
  mutate(
    song = ifelse(
      grepl("\\d{3}.mp3", stim_played), 
      as.numeric(str_extract(stim_played, "\\d{3}")), 
      NA),
    type = case_when(
      grepl("dancing", correct_response) ~ "DANCE",
      grepl("heal", correct_response) ~ "HEALING",
      grepl("soothe", correct_response) ~ "LULLABY"
    ),
    response = case_when(
      grepl("dancing", userResp) ~ "DANCE",
      grepl("heal", userResp) ~ "HEALING",
      grepl("lullaby", userResp) ~ "LULLABY"
    ),
    # retrieving likert values is a bit complicated as the row containing the correct value
    # can be between 2-4 rows in front of the song row, and that row doesn't contain
    # a unique song_trial index that one could group by... therefore I (CH) had to do:
    ##### CURRENTLY COMMENTING OUT LIKERT STUFF SINCE WE AREN'T USING IT RIGHT NOW
    # likert = case_when(
    #   lead(trialName, n = 1) == "likert" & trialName == "songType" ~ lead(button_pressed, n = 1),
    #   lead(trialName, n = 2) == "likert" & trialName == "songType" ~ lead(button_pressed, n = 2),
    #   lead(trialName, n = 3) == "likert" & trialName == "songType" ~ lead(button_pressed, n = 3),
    #   lead(trialName, n = 4) == "likert" & trialName == "songType" ~ lead(button_pressed, n = 4),
    #   ),
    # likert = as.numeric(likert),
    # early-pilot data where things weren't logged correctly (user_ids before 372) CH: I got this number from Liam
    pilot = ifelse(user_id < 372, 1, 0)) %>% 
  group_by(user_id) %>% 
  # participants who completed experiment
  mutate(complete = ifelse(any(grepl("Thanks for helping", stimulus)),1,0)) %>% 
  filter(trialName == "songType") %>% 
  mutate(
    # missing data if less than 6 trials + they completed experiment
    missing = ifelse((n() < 6) & complete == 1,1,0),
    # converting correct to numeric
    correct = ifelse(correct == "True",1,0)) %>% 
  ungroup() %>% 
  # marking trials for exclusion outside 300ms to 10seconds range
  mutate(
    rt_dodgy = ifelse(!between(rt, 100,10000), 1, 0)
  )
  
# save exclusion info -----------------------------------------------------

participant_info <- trial_data %>% 
  group_by(user_id) %>% 
  summarise(across(c(pilot, complete, missing, rt_dodgy), unique)) %>% 
  left_join(., covariates) %>% 
  ungroup()
  
# list for exclusion info
exclusions <- list()

# n before any exclusions
exclusions$before_exclusions <- n_distinct(participant_info$user_id)

excl_count <- function(var_x, value_x) {
  participant_info %>% 
    filter({{var_x}} %in% value_x) %>% 
    summarise(n = n_distinct(user_id)) %>% 
    pull()
}

participant_info %>% 
  ungroup() %>% 
  filter(complete == 0) %>% 
  summarise(n = n_distinct(user_id)) %>% 
  pull()


exclusions$non_complete <- excl_count(complete, 0) # not completing experiment
exclusions$pilot <- excl_count(pilot, 1) # in pre-pilot
exclusions$age <- excl_count(age, c("3 or younger", "14 or older", "17 or older"))
exclusions$parentHelp <- excl_count(parentHelp, "0") # parent helped
exclusions$playedBefore <- excl_count(playedBefore, "Yes") # played before
exclusions$hearing <- excl_count(hearingImpairment, "Yes") # hearing impairment
exclusions$missing <- excl_count(missing, 1) # missing data
exclusions$rt <- excl_count(rt_dodgy, 1) # has trials with RT < 300ms or < 10s 

# Combine, tidy, and save final data --------------------------------------

KFC_clean <- trial_data %>% 
  left_join(., covariates) %>% 
  # exclusions
  filter(pilot == 0,
         complete == 1,
         age %nin% c("14 or older"),
         parentHelp == 1,
         playedBefore != "Yes",
         hearingImpairment != "Yes",
         missing == 0,
         !is.na(age), # there were 63 NAs for age, presumably when people skipped that question??
         rt_dodgy == 0 # now just excluding individual trials, rather than whole participants
         ) %>% 
  # reorder according to original preprocessed order (for consistency)
  select(user_id, rt, song, type, response, correct, age, country, language, playMusicOften, singOften, playedBefore, gender, headphones,
         parentHelp, hearingImpairment, prac_correct, date, understand) %>% 
  drop_na(age) %>% 
  mutate(
    # WARNING: simplifying the coding for these so the age column can be numeric
    age = case_when(
      age == "3 or younger" ~ "3", 
      age == "17 or older" ~ "17",
      TRUE ~ age
    ),
    age = as.numeric(age),
    singOften = factor(singOften,
                       levels = c("Once every 3 days or less",
                                  "Once every day or two",
                                  "2-3 times a day",
                                  "4-7 times a day",
                                  "8 or more times a day")),
    playMusicOften = factor(playMusicOften,
                            levels = c("Once every 3 days or less",
                                       "Once every day or two",
                                       "2-3 times a day",
                                       "4-7 times a day",
                                       "8 or more times a day"))
  )

KFC_weird_ages <- KFC_clean %>% filter(age %in% c(3, 17))
KFC_clean <- KFC_clean %>% filter(age %nin% c(3, 17))
  
# write clean .csv  
write_csv(KFC_clean, here("results", "KFC_clean.csv"))

#^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^#
#^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^#
# Part 2: Adults data -----------------------------------------------------
#^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^#
#^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^#

if (fc_update == TRUE) {
  
  FC_clean <- read_csv(file = here("data", "big", "fc_stimulusResponses_joined_processed.csv.gz"), 
                       col_names = TRUE,
                       col_types = cols(.default = col_character())) %>% 
    # removing unnecessary cols
    select(-(38:67)) %>% 
    mutate(across(c(user_id, trial_index, rt, time_elapsed), as.numeric), # necessary for ordering
           correct = ifelse(correct == "True", 1, 0)) %>% 
    arrange(user_id, trial_index) %>% 
    # parsing trialName info
    mutate(trialName = case_when(str_detect(stimulus, "gender") ~ "gender",
                                 trial_type == "survey-text-number" ~ "age",
                                 stimulus == "Do you live in the United States?" ~ "country",
                                 str_detect(response, "native language") | str_detect(responses, "native language") ~ "language",
                                 grepl("Where do you live", responses) ~ "country",
                                 grepl("\\d\\d\\d.mp3", stimulus) & grepl("^audio", trial_type) ~ "songType",
                                 stimulus == "Have you taken this quiz before?" ~ "takenBefore"),
           # parse song number
           song = ifelse(trialName == "songType", str_extract(str_extract(stimulus, "\\d\\d\\d.mp3"), "\\d\\d\\d"),""),
           song = as.numeric(song)) %>% 
    # coalesce columns from different versions of experiment into 1
    mutate(type = coalesce(correct_answer, correct_response),
           # renaming song type
           type = case_when(type == "to soothe a baby" ~ "LULLABY",
                            type ==  "for dancing" ~ "DANCE",
                            type == "to heal the sick" ~ "HEALING",
                            type == "to express love to another person" ~ "LOVE"),
           # converting key press numbers to letters
           # these mappings can be found in the keyNumbers column and appear to be the same for all participants
           key_press = case_when(
             key_press == "83.0" ~ "s",
             key_press == "70.0" ~ "f",
             key_press == "74.0" ~ "j",
             key_press == "76.0" ~ "l",
             key_press == "49.0" ~ "1",
             key_press == "50.0" ~ "2",
             key_press == "51.0" ~ "3",
             key_press == "52.0" ~ "4"
           ),
           # parse what their guess was (catching older parts of the data)
           guess = ifelse(trialName == "songType", case_when(
             key_press == lead(`0_key`) ~ lead(`0_label`),
             key_press == lead(`1_key`) ~ lead(`1_label`),
             key_press == lead(`2_key`) ~ lead(`2_label`),
             key_press == lead(`3_key`) ~ lead(`3_label`),
             TRUE ~ ""), ""),
           # parsing their guess (for newer parts of the data)
           guess = ifelse(trialName == "songType" & guess == "", 
                          response, guess),
           # renaming
           guess = case_when(guess == "Soothing a baby" ~ "LULLABY",
                             guess == "Dancing" ~ "DANCE",
                             guess == "Healing the sick" ~ "HEALING",
                             grepl("Expressing love", guess) ~ "LOVE",
                             TRUE ~ "")
           # extract likert ratings for each song
           ### COMMENTED OUT FOR NOW... we aren't using this
           # likert = ifelse(trialName == "songType", 
           #                 case_when(
           #                   grepl("you (like/dislike|enjoy) this song", lead(stimulus, n = 1)) ~ lead(paste(key_press, response), n = 1),
           #                   grepl("you (like/dislike|enjoy) this song", lead(stimulus, n = 2)) ~ lead(paste(key_press, response), n = 2),
           #                   grepl("you (like/dislike|enjoy) this song", lead(stimulus, n = 3)) ~ lead(paste(key_press, response), n = 3),
           #                   grepl("you (like/dislike|enjoy) this song", lead(stimulus, n = 4)) ~ lead(paste(key_press, response), n = 4),
           #                 ),
           #                 NA),
           # # convert letters to numeric, s = 1, f = 2, j = 3, l = 4
           # likert = case_when(grepl("s|83.0|I hated it", likert) ~ 1,
           #                    grepl("f|70.0|I disliked it", likert) ~ 2,
           #                    grepl("j|74.0|I liked it", likert) ~ 3,
           #                    grepl("j|76.0|I liked it", likert) ~ 4)
           )
  
  # extract covariates
  covs <- FC_clean %>% 
    filter(trialName %in% c("gender", "age", "country", "language", "songType", "takenBefore")) %>% 
    mutate(response = coalesce(response, responses)) %>% 
    select(user_id, trialName, response) %>% 
    pivot_wider(names_from = trialName, values_from = response, values_fn = first) %>% 
    mutate(age = str_sub((str_extract(age, ":\"..?")), 3, 10),
           # extract country
           country = str_extract(country, "(?<=name: ).*(?=[\"])"),
           # extract language
           language = str_extract(language, "(?<=name: ).*(?=[\"])")) %>% 
    select(-songType)
  
  FC_clean <- FC_clean %>% 
    filter(trialName == "songType") %>% 
    select(user_id, created_at, correct, song, type, guess) %>% 
    left_join(., covs) %>% 
    # When participants quit before giving their 'liking' rating of a song, we cannot recover which function they guess for
    filter(
      # for the older data... these rows will be dropped. 
      guess != "",
      # remove love songs
      type != "LOVE",
      # remove participants younger than 18
      as.numeric(age) >= 18
    ) %>% 
    rename(response = guess)
  
  # save .csv
  write_csv(FC_clean, here("results", "preprocessed_FC.csv"))
} else {
  FC_clean <- read_csv(here("results", "preprocessed_FC.csv"))
}

#^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^#
#^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^#
# Part 3: Features and metadata on songs ----------------------------------
#^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^#
#^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^#

# Expert annotations ------------------------------------------------------

# Features to keep
features.expert <- c( 
  'tempo_adj',
  'macrometer_ord',
  'syncopate',
  'accent',
  'dynamics',
  'ritard_accel',
  'micrometer_duple',
  'micrometer_triple',
  'macrometer_duple',
  'macrometer_triple',
  'variation_rhythmic',
  'variation_melodic',
  'ornament',
  'vibrato',
  'tension',
  'scale_quality_minor'
)

# load expert ratings + pool certain variables
disco.expert <- read_csv(here('data', 'NHSDiscography_Annotate.csv')) %>% 
  mutate(
    # Pooling MICROMETER
    micrometer_duple = micrometer %in% c('Duple', 'Both duple and triple'),
    micrometer_triple = micrometer %in% c('Triple', 'Both duple and triple'),
    # Pooling MACROMETER
    macrometer_duple = (rowSums(select(., matches("macrometer_([2468]{1}|\\d[02468]$)"))) > 0) |
      ifelse(macrometer_other != ".", as.numeric(macrometer_other) %% 2 == 0, FALSE),
    macrometer_triple = (rowSums(select(., matches("macrometer_([369]{1}|1[258]$)"))) > 0) |
      ifelse(macrometer_other != ".", as.numeric(macrometer_other) %% 3 == 0, FALSE),
    # Pooling MELODIC VARIATION
    variation_melodic = repeat_vary %in% c('Melodic variation', 'Rhythmic and melodic variation'),
    # Pooling RHYTHMIC VARIATION
    variation_rhythmic = repeat_vary %in% c('Rhythmic variation', 'Rhythmic and melodic variation'),
    # DYNAMICS
    dynamics = dynamics %in% c('Gets louder', 'Multiple dynamics', 'Quiets down'),
    # TENSION/RELEASE
    tension = rowSums(select(.,tension_melody, tension_harmony, tension_rhythm, tension_motif, tension_accent, tension_dynamic)),
    # TEMPO VARIATION
    ritard_accel = ritard %in% c('Slows down', 'Speeds up', 'Speeds up and slows down'),
    # SCALE QUALITY (MINOR)
    scale_quality_minor = ifelse(scale_quality == 'Unknown', NA, scale_quality == 'Minor')
  ) %>% 
  select(song, features.expert) %>% 
  group_by(song) %>% 
  summarise(across(everything(), mean, na.rm = TRUE))

# Expert transcriptions ---------------------------------------------------

# selected transcription features
features.transcription <- c(
  'mean_interval',
  'distance_btwn_modal_intervals',
  'common_intervals_count',
  'stepwise_motion',
  'melodic_thirds',
  'duration_of_melodic_arcs',
  'size_of_melodic_arcs',
  'rel_strength_top_pitchcls',
  'interval_btwn_strongest_pitchcls',
  'pitch_class_variety',
  'range',
  'note_density',
  'average_note_duration',
  'modal_interval_prevalence',
  'rel_strength_modal_intervals',
  'amount_of_arpeggiation',
  'direction_of_motion',
  'modal_pitchcls_prev',
  'initial_tempo',
  'quality'
)

# automatically extracted features from raw audio
disco.transcription <- read_csv(here('data', 'NHSDiscography_TranscriptionFeatures.csv')) %>% 
  # select chosen features
  select(song, all_of(features.transcription))

# Metadata ----------------------------------------------------------------

disco.meta <- read_csv(here('data', 'NHSDiscography_Metadata.csv')) %>% 
  mutate(song = abs(parse_number(song))) %>% 
  select(song, type, 5:10, location_modern) %>% 
  group_by(song) %>% 
  # extracting country information
  mutate(country = tail(unlist(str_split(location_modern, ", ")), n=1))

# Songwise aggregated stats from KFC and FC -------------------------------

songwise <- list()

# songwise info for KFC and FC
for (data in c("KFC", "FC")) {
  
  # GUESSING PROPORTIONS (PER SONGTYPE)
  songwise$proportions[[{{data}}]] <- eval(as.name(paste0(data, "_clean"))) %>%
    count(song, response) %>%
    pivot_wider(names_from = "response", values_from = "n") %>% 
    mutate(
      across(everything(), ~replace_na(.x, 0)), # ensure no NAs
      total = DANCE+HEALING+LULLABY,
      "{data}_dance" := DANCE/total,
      "{data}_healing" := HEALING/total,
      "{data}_lullaby" := LULLABY/total
    ) %>%
    select(song, contains(data))
  
  # GUESSING ACCURACY
  songwise$accuracy[[{{data}}]] <- eval(as.name(paste0(data, "_clean"))) %>%
    group_by(song) %>%
    summarise("{data}_accuracy" := mean(correct))
  
  # # LIKING
  # songwise$likes[[{{data}}]] <- eval(as.name(paste0(data, "_clean"))) %>% 
  #   select(song, type, likert) %>% 
  #   drop_na(likert) %>% 
  #   group_by(song) %>% 
  #   summarise("{data}_like" := mean(likert))
  
}

# Combine -----------------------------------------------------------------

# tibble containing songwise info + trial summaries
songs <- join_all(list(disco.expert,
                       disco.transcription,
                       disco.meta,
                       songwise$accuracy$KFC,
                       songwise$proportions$KFC,
                       # songwise$likes$KFC,
                       songwise$accuracy$FC,
                       songwise$proportions$FC),
                       # songwise$likes$FC),
                  by = "song", type = "inner")

guesses <- list()

# separate tibble containing just guessing proportions for KFC and FC by type
guesses$by_type <- songs %>% 
  select(song, type, contains(c("dance","healing", "lullaby"))) %>% 
  pivot_longer(cols = -c(song, type), names_to = c("exp","guess"), values_to = c("proportion"), names_sep = "_") %>% 
  pivot_wider(names_from = exp, values_from = proportion)

# proportions per song KFC across age
guesses$by_type_age <- KFC_clean %>%
  group_by(song, age) %>%
  mutate(total_n = n()) %>%
  group_by(song, response, age) %>%
  # note mean(total_n) below is just getting the mean of vector of identical values... 
  summarise(KFC = n() / mean(total_n), response = str_to_lower(response)) %>% 
  left_join(., 
            select(guesses$by_type, song, guess, FC),
            by = c("song", "response" = "guess")) %>% 
  distinct()

# Save as .csv ----------------------------------------------------------

write_csv(songs, here("results", "song_data.csv"))

#^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^#
#^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^#
# Part 4: Save RData file containing all relevant vars --------------------
#^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^#
#^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^#

save(KFC_clean, KFC_weird_ages, FC_clean, songs, exclusions, guesses, file = here("results", "preprocessed_data.RData"))
