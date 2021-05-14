
# Libraries ---------------------------------------------------------------
library(pacman)
pacman::p_load(
  tidyverse,
  glmnet,
  here,
  broom)

# Load data ---------------------------------------------------------------

load(here("results", "preprocessed_data.RData"))
disco.nocontext.mat <- as.matrix(read_csv(here("data", "KFC_disco_nocontextMat.csv")))

responses <- songs %>% 
  select(contains("FC"), type, song) %>% 
  pivot_longer(cols = -c(type, song), names_to = "data", values_to = "percentage") %>% 
  separate(data, sep = "_", into = c("data", "response")) %>%
  filter(response %in% c("dance", "healing", "lullaby")) %>% 
  pivot_wider(names_from = "data", values_from = "percentage") %>% 
  mutate(response = str_to_title(response)) %>% 
  select(song,type,response,KFC,FC)


# LASSO on each song type for KFC and FC ----------------------------------

coefs <- list()
model_predictions <- list()
selected_features <- list()

for (type_x in c("Dance", "Healing", "Lullaby")) {
  for (data_x in c("KFC", "FC")) {
    intuition <- responses %>% 
      filter(response == type_x) %>% 
      pull(data_x)
    
    MSEs <- NULL
    SEs <- NULL
    
    # repeat 100 times to ensure robustness
    for (j in 1:100) {
      mod.nocontext <- cv.glmnet(
        x = disco.nocontext.mat,
        y = intuition,
        alpha = 1, # alpha = 1 is for LASSO, smaller amounts is some form of Elastic Net, 0 is Ridge regression
        family = 'gaussian',
        standardize = TRUE,
        keep = TRUE
      )
      MSEs <- cbind(MSEs, mod.nocontext$cvm)
      SEs <- cbind(SEs, mod.nocontext$cvsd)
    }
    
    rownames(MSEs) <- mod.nocontext$lambda
    mean_MSEs <- rowMeans(MSEs)
    min.index <- which.min(mean_MSEs)
    lambda.min <- as.numeric(names(min.index))
    min.se <- mean(SEs[min.index,])
    lambda.1se <- as.numeric(names(mean_MSEs[mean_MSEs < mean_MSEs[min.index] + min.se]))[1]
    
    coefs[[type_x]][[data_x]] <- coef(mod.nocontext, s = lambda.1se) %>% tidy() %>% 
      mutate(feature = str_extract(row, "(?<=\\.).*")) %>% 
      select(feature, value) %>% 
      filter(!is.na(feature),
             abs(value) > 0.01) %>% 
      arrange(desc(abs(value)))
    
    model_predictions[[type_x]][[data_x]] <- predict(mod.nocontext,disco.nocontext.mat, s = lambda.1se)
  }
  selected_features[[str_to_lower(type_x)]] <- union(coefs[[type_x]]$KFC$feature, coefs[[type_x]]$FC$feature)
}

# Saving ------------------------------------------------------------------

save(selected_features, model_predictions, file = here("results", "selected_features.RData"))
