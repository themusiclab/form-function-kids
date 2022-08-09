# 1.  Setup ---------------------------------------------------------------


library(pacman)
p_load(
  lmerTest,
  broom,
  broom.mixed,
  sf,
  colorspace,
  Rmisc,
  ggtext,
  ggpubr,
  kableExtra,
  Hmisc,
  gridExtra,
  scales,
  psycho,
  patchwork,
  png,
  here,
  sjmisc,
  tidyverse,
  scales,
  glue, 
  rsq,
  ggpubr
)

# all data referenced in manuscript will be in one of these lists
kids <- list() # info of kid participants
adults <- list() # info of adult participants
mods <- list() # statistical models
plots <- list() # plots


# 2.  Load data -----------------------------------------------------------


# checks if preprocessed data exists, if not: runs builder
# (!!you should also re-run script if you have updated the data)
if (!file.exists(here("results", "preprocessed_data.RData"))) { 
  source(here("analysis", "builder.R"))
}

# load all preprocessed data from builder
load(here("results", "preprocessed_data.RData"))

# z-scoring all variables
songs <- songs %>% mutate(across(c(2:37), scale))

if (!file.exists(here("results", "selected_features.RData"))) { 
  source(here("analysis", "feature_selection.R"))
}

# results from LASSO analyses: acoustic feature selection + objective acoustics modelling
load(here("results", "lasso_analyses.RData"))


# 3. Basic kid stats ----------------------------------------------------------------


# 1 row = 1 kid
kid_participants <- KFC_clean %>%
  group_by(user_id) %>%
  summarise(
    across(c(gender,country,language,age,singOften,playMusicOften), unique),
    gender = if_else(is.na(gender), "not_reported", gender),
    accuracy = mean(correct),
    med_rt = median(rt)
  ) %>% 
  mutate(country = case_when(
    country == "Aotearoa/New Zealand" ~ "New Zealand",
    country == "Kingdom of the Netherlands" ~ "Netherlands",
    country == "Russia" ~ "Russian Federation",
    country == "South Korea" ~ "Republic of Korea",
    TRUE ~ as.character(country)))

# general participant characteristics
kids$n$total <- nrow(kid_participants)
kids$n$countries <- length(unique(kid_participants$country))
kids$n$languages <- length(unique(kid_participants$language))

# compute sample size of adults for Male, Female, Other, and Not reported
for (gend in unique(kid_participants$gender)) {
  kids$n$gender[[{{gend}}]] <- nrow(filter(kid_participants, gender == {{gend}}))
}

# info about which were excluded and why
kids$excl$complete <- exclusions$before_exclusions - exclusions$non_complete
kids$excl$complete_age <- kids$excl$comlete - exclusions$age

# task performance (at participant level)
kids$correct <- map(c("dance", "lullaby", "healing") %>% set_names, ~
                      KFC_clean %>% filter(type == str_to_upper(.x)) %>% summarise(acc = mean(correct)) %>% pull(acc))
kids$correct$avg <- mean(kid_participants$accuracy)
kids$correct$sd <- sd(kid_participants$accuracy)

kids$heal$guesses <- KFC_clean %>% 
  filter(type == "HEALING") %>% 
  count(response, sort = TRUE) %>% 
  mutate(pcnt = (n / sum(n)) %>% percent()) %>% 
  select(response, pcnt) %>% 
  pivot_wider(names_from = response, values_from = pcnt)

kids$all$heal_guesses <- KFC_clean %>% 
  filter(response == "HEALING") %>% 
  count(type, sort = TRUE) %>% 
  mutate(pcnt = (n / sum(n)) %>% percent()) %>% 
  select(type, pcnt) %>% 
  pivot_wider(names_from = type, values_from = pcnt)

# proportion of guesses per song type
kids$proportions <- guesses$by_type %>%
  select(-FC) %>%
  group_by(guess) %>%
  summarise(avg = percent(mean(KFC), accuracy = 0.1)) %>%
  split(.$guess)

# accuracy on training trials
kids$training_acc <- KFC_clean %>% summarise(pct = mean(prac_correct, na.rm = T)) %>% pull(pct)
# percentage of parents indicating child understands task
kids$understand <- KFC_clean %>% summarise(pct = mean(as.numeric(understand), na.rm = T)) %>% mutate(pct = 1 - pct) %>% pull(pct)


# 4. Basic adult stats ---------------------------------------------------


# 1 row = 1 adult
adult_participants <- FC_clean %>%
  group_by(user_id) %>%
  summarise(gender = if_else(is.na(unique(gender)), "not_reported", unique(gender)),
            age = unique(age))
# 1 row = 1 adult. This is for supplementary tables 1b and 2b. "adult_participants" does not contain country or language data

# total sample size of adults
adults$n$total <- nrow(adult_participants)

# compute sample size of adults for Male, Female, Other, and Not reported
for (gend in unique(adult_participants$gender)) {
  adults$n$gender[[{{gend}}]] <- nrow(filter(adult_participants, gender == {{gend}}))
}

# mean age
adults$age$avg <- mean(as.numeric(adult_participants$age), na.rm = TRUE)
adults$age$sd <- sd(as.numeric(adult_participants$age), na.rm = TRUE)
adults$age$min <- min(as.numeric(adult_participants$age), na.rm = TRUE)
adults$age$max <- max(as.numeric(adult_participants$age), na.rm = TRUE)


# 5.  Kids regressions ----------------------------------------------------


# compute simple linear regression predicting accuracy by "age", "singOften", "playMusicOften"
for (covariate in c("age", "singOften", "playMusicOften")) {
  mods$accuracy[[covariate]] <- lm(accuracy ~ as.numeric(kid_participants[[covariate]]), data = kid_participants) %>% glance()
}

# median RT predicted by age
mods$rt$age <- lm(med_rt ~ age, data = kid_participants) %>% glance()


# 6.  Comparing kids to adults --------------------------------------------


# compute simple linear regression over song types
for (type in guesses$by_type$guess) {
  mods$kfc_fc[[{{type}}]] <- lm(FC ~ KFC, data = filter(guesses$by_type, guess == {{type}})) %>% glance()
}

# Using Kendall's tau
ranked_guesses <- guesses$by_type %>%
  group_by(guess) %>%
  mutate(diff = KFC - FC,
         KFC_rank = as.integer(rank(desc(KFC))),
         FC_rank = as.integer(rank(desc(FC))))

# compute tau correlations over song types
for (type in unique(guesses$by_type$guess)) {
  mods$tau[[{{type}}]] <- cor.test(filter(ranked_guesses, guess == {{type}}) %>% pull(KFC_rank),
                                   filter(ranked_guesses, guess == {{type}}) %>% pull(FC_rank),
                                   method = "kendall") %>% tidy()
}


# 7. Calculating d-prime ----------------------------------------------------


KFC_clean_complete <- KFC_clean %>% 
  group_by(user_id) %>% 
  filter(
    # only keeping participants without any missing trials (e.g., due to exclusions)
    n() == 6,
    ) %>% 
  ungroup()

pooled_dprime <- function(data, type_var, age = FALSE, lang = "all languages") {
  dprime <- data %>%
    group_by(type, response, user_id, age) %>%
    count() %>%
    ungroup()
  
  if (age == TRUE) {
    dprime <- dprime %>% group_by(age)
  }
  
  dprime <- dprime %>% 
    mutate(type = if_else(type == type_var, type_var, 'OTHER'),
           response = if_else(response == type_var, type_var, 'OTHER')) %>% 
    pivot_wider(names_from = c(type, response), values_from = n, names_sep = "_", values_fn = sum) %>%
    summarise(
      hit = eval(as.name(paste(type_var, type_var, sep = "_"))),
      false_alarm = eval(as.name(paste("OTHER", type_var, sep = "_"))),
      miss = eval(as.name(paste(type_var, "OTHER", sep = "_"))),
      correct_reject = eval(as.name(paste("OTHER", "OTHER", sep = "_")))
    ) %>% 
    replace_na(list(hit = 0, false_alarm = 0, miss = 0, correct_reject = 0)) %>% 
    mutate(
      # computing rate metrics
      hr = hit / (hit + miss),
      far = false_alarm / (false_alarm + correct_reject)
    ) %>% 
    drop_na() %>% 
    summarise(across(everything(), ~ mean(.x)),
              n = n()) %>% 
    mutate(
      phi_hr = 1/sqrt(2*pi)*exp((-1/2)*qnorm(hr)^2),
      phi_far = 1/sqrt(2*pi)*exp((-1/2)*qnorm(far)^2),
      d_prime = qnorm(hr) - qnorm(far),
      c = -(qnorm(hr) + qnorm(far))/2
    )
  
  confints <- dprime %>% 
    summarise(
      # compute  variance of d' estimate (c.f., Macmillan & Kaplan, 1985 Appendix A)
      hr_variance = (sum( (hr*(1 - hr)) / ((hit + miss) * hr) )) / (n*2 * dprime$phi_hr),
      far_variance = (sum( (far*(1 - far)) / ((false_alarm + correct_reject) * far) )) / (n*2 * dprime$phi_far),
      n = n
    ) %>% 
    summarise(
      d_se = sqrt(hr_variance + far_variance),
      d_sd = d_se * sqrt(n),
      conf.low = dprime$d_prime - (d_se * qt(0.975, n - 1)),
      conf.high = dprime$d_prime + (d_se * qt(0.975, n - 1)),
      d_prime = dprime$d_prime,
      c = dprime$c,
      cohen_d = d_prime / d_sd,
      type = str_to_lower(type_var)
    )
  
  if (age == TRUE) {
    confints <- confints %>% 
      bind_cols(., age = 4:16)
  }
  
  return(confints %>% 
           mutate(language = lang))
}

# d' across all ages (4-16)
kids$d$group <- map(c('dance', 'lullaby', 'healing') %>% set_names, ~ pooled_dprime(KFC_clean_complete, str_to_upper(.x)))
kids$d$group_avg <- bind_rows(kids$d$group) %>% pull(d_prime) %>% mean()

# d' for each age bin
kids$d$ages <- map(c('dance', 'lullaby', 'healing') %>% set_names, ~ pooled_dprime(KFC_clean_complete, str_to_upper(.x), TRUE))
kids$d$avg <- map(c('dance', 'lullaby', 'healing') %>% set_names, ~ kids$d$ages[[.x]] %>% 
                    summarise(
                      avg_d = mean(d_prime),
                      avg_c = mean(c),
                      sd_d = sd(d_prime),
                      se_d = sd_d / sqrt(n()),
                      cohen_d = avg_d / sd_d,
                      conf.low = avg_d - se_d * qt(0.975, n() - 1),
                      conf.high = avg_d + se_d * qt(0.975, n() - 1),
                      type = .x
                    ))

# d' across ages for only English speaking participants
kids$d$english_ages <- map(c('dance', 'lullaby', 'healing') %>% set_names, ~ pooled_dprime(KFC_clean_complete %>% filter(language == "English"), str_to_upper(.x), TRUE, "english"))

# d' for adults
FC_love_data <- read_csv(here("results", "preprocessed_FC_wLove.csv")) %>% 
  group_by(user_id) %>% 
  filter(
    # only keeping participants without any missing trials (e.g., due to exclusions)
    n() == 8,
  ) %>% 
  ungroup()
adults$d$group <- map(c('dance', 'lullaby', 'healing', 'love') %>% set_names, ~ pooled_dprime(FC_love_data, str_to_upper(.x)))


# 8.  d-prime regressions -------------------------------------------------


# t.tests + simple linear models
for (type_x in c("dance", "healing", "lullaby")) {
  mods$d$t.test[[{{type_x}}]] <- t.test(kids$d$ages[[{{type_x}}]]$d_prime, mu = 0, alternative = "two.sided")
  mods$d$lm[[{{type_x}}]] <- lm(d_prime ~ age, data = kids$d$ages[[{{type_x}}]]) %>% tidy()
}

# # linear model across all ages for all song types
mods$d$lm$age <- bind_rows(kids$d$ages) %>%
  ungroup() %>%
  mutate(age = center(age)) %>%
  lm(d_prime ~ 0+ type*age, data = .) %>% tidy() %>% split(.$term)

mods$c$lm$age <- bind_rows(kids$d$ages) %>%
  ungroup() %>%
  mutate(age = center(age)) %>%
  lm(c ~ 0 + type*age, data = .) %>% tidy() %>% mutate(term = str_remove(term, ":")) %>% split(.$term)

# linear regression on accuracy by parent singing to child + playing recorded music
mods$d$parentSing <- lm(accuracy ~ as.numeric(singOften), data = kid_participants) %>% glance()
mods$d$playMusic <- lm(accuracy ~ as.numeric(playMusicOften), data = kid_participants) %>% glance()

# regression for only Engish speaking participants
mods$d$lm$english_age <- lm(d_prime ~ 0 + type*age, bind_rows(kids$d$english_ages)) %>% tidy %>% split(.$term)


# 9.  Correlations between KFC + FC ---------------------------------------


# compute correlations between KFC and FC over ages
kids$corr$wFC <- guesses$by_type_age %>%
  group_by(age, response) %>%
  summarise(KFC_FC_correlation = cor(FC, KFC))

# linear regression on R^2 of child-adult guessing correlations by child age
mods$kfc_fc$corr$age <- lm(KFC_FC_correlation ~ age + 0 + response, data = kids$corr$wFC) %>% tidy %>% filter(term == "age")

# testing similarity of child and adult inferences
for (type_x in c("dance", "lullaby", "healing")) {
  # pool + wrangle data
  tmp <- songs %>% 
    pivot_longer(cols = c(glue("KFC_{type_x}"), glue("FC_{type_x}")), names_to = type_x, values_to = "probs")
  
  # run model
  m <- lm(
    # define model formula
    reformulate(
      c(selected_features[[type_x]]$feats,
        type_x, 
        map_chr(selected_features[[type_x]]$feats, ~ paste0(.x, glue(":{type_x}")))),
      response = "probs"
    ),
    data = tmp)
  
  # test using F test
  mods$equiv[[type_x]] <- anova(m) %>% tidy() %>% filter(term == type_x)
  mods$equiv[[type_x]] <- bind_cols(mods$equiv[[type_x]], res.df = anova(m) %>% tidy() %>% filter(term == "Residuals") %>% pull(df))
  mods$equiv$full[[type_x]] <- tidy(m)
}

mods$kfc_fc_age <- guesses$by_type_age %>% 
  mutate(diff = abs(KFC - FC)) %>% 
  lmer(diff ~ age + 0 + response + (1|song), .)


# multinomial vs human inference test -------------------------------------


# testing similarity of child and adult inferences
for (type_x in c("dance", "lullaby", "healing")) {
  # pool + wrangle data
  tmp <- songs %>% 
    bind_cols(., multi_LASSO$prevalidated_predictions %>% janitor::clean_names()) %>% 
    pivot_longer(cols = c(glue("KFC_{type_x}"), glue("pred_{type_x}")), names_to = type_x, values_to = "probs")
  
  # run model
  m <- lm(
    # define model formula
    reformulate(
      c(selected_features[[type_x]]$feats,
        type_x, 
        map_chr(selected_features[[type_x]]$feats, ~ paste0(.x, glue(":{type_x}")))),
      response = "probs"
    ),
    data = tmp)
  
  # test using F test
  mods$equiv2[[type_x]] <- anova(m) %>% tidy() %>% filter(term == type_x)
  mods$equiv2[[type_x]] <- bind_cols(mods$equiv2[[type_x]], res.df = anova(m) %>% tidy() %>% filter(term == "Residuals") %>% pull(df))
  mods$equiv2$full[[type_x]] <- tidy(m)
}

mods$equiv2$dance_example <- mods$equiv2$full$dance %>% filter(term == "accent:dancepred_dance")

# Correlations
mods$KFC_multiLASSO_cor <- map(c("dance", "lullaby", "healing") %>% set_names, ~ {
  cor.test(songs[[paste0("KFC_", .x)]], multi_LASSO$prevalidated_predictions[[paste0(".pred_", str_to_title(.x))]]) %>% 
    tidy
})


# 10.  LASSO regressions --------------------------------------------------


# Compute multiple regression models on LASSO selected features
for (data_x in c("KFC", "FC")) {
  for (type_x in c("dance", "lullaby", "healing")) {
    mods$feature[[data_x]][[type_x]] <- lm(
      reformulate(selected_features[[type_x]]$feats, response = paste(data_x, type_x, sep = "_")),
      data = songs)
    
    mods$feature$s[[data_x]][[type_x]] <- mods$feature[[data_x]][[type_x]] %>% glance()
  }
}


# 11. Coefficient of Variation Supplementary Analyses -------------------------

# Note: I originally constructed a model with both country + language as random effects
# but because the effects were so small, there were convergence issues, so I 
# instead do things separately here
country_mod <- lmer(correct ~ (1|country) + (1|song), KFC_clean) %>% tidy
lang_mod <- lmer(correct ~ (1|language) + (1|song), KFC_clean) %>% tidy

mods$cv$language <- lang_mod %>% filter(group == "language") %>% pull(estimate) / country_mod %>% filter(term == "(Intercept)") %>% pull(estimate)
mods$cv$country <- country_mod %>% filter(group == "country") %>% pull(estimate) / lang_mod %>% filter(term == "(Intercept)") %>% pull(estimate)
mods$cv$song <- lang_mod %>% filter(group == "song") %>% pull(estimate) / lang_mod %>% filter(term == "(Intercept)") %>% pull(estimate)


# 12.  Replicating analyses for "3 or under" participants -----------------


KFC_clean_complete <- KFC_weird_ages %>% 
  group_by(user_id) %>% 
  filter(
    # only keeping participants without any missing trials (e.g., due to exclusions)
    n() == 6
  ) %>% 
  ungroup()

kids$d$supp_3 <- map(c('dance', 'lullaby', 'healing') %>% set_names, ~ pooled_dprime(KFC_clean_complete %>% filter(age == 3), str_to_upper(.x)))
kids$d$supp_17 <- map(c('dance', 'lullaby', 'healing') %>% set_names, ~ pooled_dprime(KFC_clean_complete %>% filter(age == 17), str_to_upper(.x)))

# 12.  Saving -------------------------------------------------------------


save(kids, adults, mods, exclusions, songs, kid_participants,
    file = here("results", "analyses.RData"))

