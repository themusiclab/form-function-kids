
# function does LASSO with cross-validation using multinomial log-loss as evaluation metric to tune model
# data_x: data to use
# mod_type: 'binomial' or 'multinomial'
# cv_variable: what to do cross-validation over (e.g., fieldsites)
# 
# function returns:
# 1. lasso_grid: cross-validation data
# 2. model_perf_plot: plots of model tuning of lambda
# 3. var_import_data: variable importance of final fitted model
# 4. var_import_plot: diagnostic plot of variable importance
# 5. selected_features: selected features
# 6. lasso_predictions: post-validated model predictions
# 7. mod_auc: AUC scores for each fieldsite + average overall
# 8. mod_acc: accuracy scores for each fieldsite + average overall
run_lasso <- function(data_x, mod_type) {
  # initializing output list
  output <- list()
  
  # Preprocessing recipe
  feature_recipe <- recipe(type ~ ., data = data_x) %>%
    update_role(c("nhs_region"), new_role = "ID") %>% 
    step_string2factor(type, skip = TRUE) %>% 
    step_zv(all_numeric(), -all_outcomes()) %>% 
    step_normalize(all_numeric(), -all_outcomes())
  
  # Add to workflow
  wf <- workflow() %>% 
    add_recipe(feature_recipe)
  
  # Specify LASSO model
  if (mod_type == "multinomial") {
    lasso_spec <- multinom_reg(mode = "classification", penalty = tune(), mixture = 1) %>%
      set_engine("glmnet", grouped = FALSE)
  } else {
    lasso_spec <- logistic_reg(mode = "classification", penalty = tune(), mixture = 1) %>%
      set_engine("glmnet", grouped = FALSE)
  }
  
  doParallel::registerDoParallel()
  
  lasso_grid <- tune_grid(
    wf %>% add_model(lasso_spec),
    # Leave-one out CV over id_sites
    resamples = group_vfold_cv(data_x, "nhs_region"),
    grid = grid_regular(penalty(range = c(-10, -0.5)), levels = 60),
    metrics = metric_set(accuracy, mn_log_loss),
    control = control_resamples(save_pred = TRUE)
  )
  
  output$lasso_grid <- lasso_grid
  
  # lambda <- select_best(lasso_grid, metric = "mn_log_loss")
  lambda <- select_by_one_std_err(lasso_grid, metric = "mn_log_loss", desc(penalty))
  
  # Visualize model performance over lambda values
  output$model_perf_plot <- lasso_grid %>%
    collect_metrics() %>%
    ggplot(aes(penalty, mean, color = .metric)) +
    geom_errorbar(aes(ymin = mean - std_err, ymax = mean + std_err), alpha = 0.5) +
    geom_line(size = 1.5) +
    facet_wrap(~.metric, scales = "free", nrow = 3) +
    scale_x_log10(labels = comma) +
    geom_vline(
      xintercept = lambda %>% pull(penalty), 
      linetype = "dashed", color = "red", alpha = .7
    ) +
    theme(legend.position = "none") +
    theme_bw()

  
  # final lasso with selected lambda
  final_lasso <- finalize_workflow(
    wf %>% add_model(lasso_spec),
    # Using Mean Log-loss as metric to be consistent with the standard cv.glmnet metric
    # (Otherwise known as multinomial deviance)
    # select_best(lasso_grid, metric = "mn_log_loss")
    # opting to use the 1std rule to select optimal lambda
    lambda
  )
  
  lasso_fit <- final_lasso %>% 
    fit(data_x)
  
  # variable importance data
  output$var_import_data <- lasso_fit %>%
    pull_workflow_fit() %>%
    vi(lambda = lambda %>% pull(penalty)) %>%
    mutate(
      Importance = abs(Importance),
      Variable = fct_reorder(Variable, Importance)
    )
  
  # Coefficients (selected features)
  output$selected_features <- lasso_fit %>% 
    pull_workflow_fit() %>% 
    tidy() %>% 
    filter(estimate != 0)
  
  # Predictions
  output$validated_predictions <- lasso_fit %>%
    predict(new_data = data_x, type = "prob") 
  
  # Prevalidated predictions (i.e., performance predicting each region, not including data from that region)
  output$prevalidated_predictions <- collect_predictions(lasso_grid) %>% 
    filter(penalty == lambda %>% pull(penalty)) %>% 
    arrange(.row) %>% 
    select(.pred_Dance, .pred_Healing, .pred_Lullaby)
  
  return(output)
}


run_lasso2 <- function(data_x, cv_repeats = 2) {
  
  output <- list()
  
  # Preprocessing recipe
  feature_recipe <- recipe(pct ~ ., data = data_x) %>%
    step_zv(all_numeric(), -all_outcomes()) %>%
    step_normalize(all_numeric(), -all_outcomes())
  
  # Add to workflow
  wf <- workflow() %>% 
    add_recipe(feature_recipe)
  
  # Specify LASSO model
  lasso_spec <- linear_reg(mode = "regression", penalty = tune(), mixture = 1) %>%
    set_engine("glmnet", grouped = FALSE)
  
  doParallel::registerDoParallel()
  
  lasso_grid <- tune_grid(
    wf %>% add_model(lasso_spec),
    resamples = vfold_cv(data_x, v = 10, repeats = cv_repeats),
    grid = grid_regular(penalty(range = c(-10, -0.5)), levels = 60),
    metrics = metric_set(rmse, yardstick::rsq)
  )
  
  output$lambda <- select_by_one_std_err(lasso_grid, desc(penalty), metric = "rmse")

  # final lasso with selected lambda
  final_lasso <- finalize_workflow(
    wf %>% add_model(lasso_spec),
    output$lambda
  )
  
  lasso_fit <- final_lasso %>% 
    fit(data_x)
  
  output$coefs <- lasso_fit %>% 
    pull_workflow_fit() %>% 
    tidy() %>% 
    filter(
      # secondary regularization to err on side of fewer features
      abs(estimate) > 0.02,
      term != "(Intercept)") %>% 
    mutate(term = str_extract(term, "(?<=\\.).*")) %>%  # tidying up feature names
    arrange(desc(abs(estimate))
    )
  
  return(output)
}

