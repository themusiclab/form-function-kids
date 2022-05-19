# New LASSO analysis
# by Courtney Hilton, April, 2022


# libraries ---------------------------------------------------------------


library(pacman)
p_load(
  here,
  vip,
  pROC,
  scales,
  tidymodels,
  ggtext,
  tidyverse
)

source(here("analysis", "lasso_functions.R"))


# load data ---------------------------------------------------------------


# load naive listener data (both children and adults)
load(here("results", "preprocessed_data.RData"))
# load musical feature data
disco.nocontext.mat <- as.matrix(read_csv(here("data", "KFC_disco_nocontextMat.csv")))


# run multinomial LASSO classifier ----------------------------------------


# cross-validated across NHS-regions, with pre-validated fits extracted
multi_LASSO <- as_tibble(disco.nocontext.mat) %>% 
  bind_cols(., type = songs$type, nhs_region = songs$nhs_region) %>% 
  run_lasso(., mod_type = "multinomial")


# run prediction model ----------------------------------------------------


# number of cross-validation repeats to do in each model
cv_repeats <- 10

selected_features <- map(c("dance", "healing", "lullaby") %>% set_names, ~ {
  output <- list()
  # run child model
  output$kid <- songs %>% 
    select(matches(str_c("KFC_", .x))) %>% 
    rename(pct = 1) %>% 
    bind_cols(., as_tibble(disco.nocontext.mat)) %>% 
    run_lasso2(., cv_repeats)
  
  # run adult model
  output$adult <- songs %>% 
    select(matches(str_c("^FC_", .x))) %>% 
    rename(pct = 1) %>% 
    bind_cols(., as_tibble(disco.nocontext.mat)) %>% 
    run_lasso2(., cv_repeats)
  
  output$feats <- union(output$kid$coefs$term, output$adult$coefs$term)
  
  return(output)
})


# saving ------------------------------------------------------------------


save(multi_LASSO, selected_features, cv_repeats, file = here("results", "lasso_analyses.RData"))

