// Copyright (c) 2024 UltraSoundUS All Rights Reserved.

// ベイズの定理の実装

// 事前確率のハイパーパラメータに関する定数

/**
 * 事前推論分布の平均は最大コンボ数の何倍になるか。
 * 判定は良、可、不可の3つの値を取るので、1/3を基準にする。
 *
 * @type {number}
 */
// 事前推論分布の平均は最大コンボ数の何倍になるか。
const TARGET_PRIOR_MEAN = 1 / 3;

/**
 * 事前推論分布の標準偏差は最大コンボ数の何倍になるか。
 * 平均の半分程度にする。
 *
 * @type {number}
 */
const TARGET_PRIOR_STD = TARGET_PRIOR_MEAN / 2;

/**
 * 事前推論分布の分散は最大コンボ数の何倍になるか。
 *
 * @type {number}
 */
const TARGET_PRIOR_VAR = Math.pow(TARGET_PRIOR_STD, 2);

// 関数の実装

/**
 * コンボ数から事前分布のパラメータを計算する。
 *
 * @param {number} max_combos 最大コンボ数。
 * @return {[number]} 事前分布のパラメータ。
 */
const calc_prior_params = (max_combos) => {
  const mean = max_combos * TARGET_PRIOR_MEAN;
  const std = max_combos * TARGET_PRIOR_STD;
  const var_ = Math.pow(std, 2);
  const a_prior = Math.pow(mean, 2) / (var_ - mean);
  const b_prior = mean / (var_ - mean);
  return [a_prior, b_prior];
};

/**
 * 事前分布のパラメータと観測データから事後分布のパラメータを計算する。
 *
 * @param {[number]} prior_params 事前分布のパラメータ。
 * @param {[number]} data 観測データ。
 * @return {[number]} 事後分布のパラメータ。
 */
const calc_posterior_params = (prior_params, data) => {
  const [a_prior, b_prior] = prior_params;
  const a_post = a_prior + data.reduce((acc, x) => acc + x, 0);
  const b_post = b_prior + data.length;
  return [a_post, b_post];
};

/**
 * 事前分布のパラメータから負の二項分布のパラメータに変換する。
 *
 * @param {[number]} prior_params 事前分布のパラメータ。
 * @return {[number]} 負の二項分布のパラメータ。
 */
const convert_prior_to_negbinom = (prior_params) => {
  const [a_prior, b_prior] = prior_params;
  const r = a_prior;
  const p = 1 / (1 + b_prior);
  return [r, p];
};

/**
 * 負の二項分布のパラメータから平均と分散を計算する。
 *
 * @param {[number]} negbinom_params 負の二項分布のパラメータ。
 * @return {[number]} 平均と分散。
 */
const calc_negbinom_mean_var = (negbinom_params) => {
  const [r, p] = negbinom_params;
  const mean = r * p / (1 - p);
  const var_ = r * p / Math.pow(1 - p, 2);
  return [mean, var_];
};

/**
 * 平均と分散のペアを複数個受け取り、確率変数の和の平均と分散を計算する。
 *
 * @param {...[number]} mean_var_pairs 平均と分散のペア。
 * @return {[number]} 確率変数の総和を取った確率変数の平均と分散。
 */
const calc_sum_mean_var = (...mean_var_pairs) => {
  return mean_var_pairs.reduce(([m0, v0], [m, v]) => [m0 + m, v0 + v], [0, 0]);
};

/**
 * 分布の平均と分散から、信頼区間を計算する。
 * 95% 信頼区間を計算するため、alpha は 0.05 に決め打ちする。
 *
 * @param {number} mean 平均。
 * @param {number} var_ 分散。
 * @return {[number]} 信頼区間。
 */
const calc_confidence_interval = (mean, var_) => {
  const alpha = 0.05;
  const z = jStat.normal.inv(1 - alpha / 2, 0, 1);
  const lower = mean - z * Math.sqrt(var_);
  const upper = mean + z * Math.sqrt(var_);
  return [lower, upper];
};

/**
 * 平均と分散から、指定個数未満になる確率を計算する。
 *
 * @param {number} mean 平均。
 * @param {number} var_ 分散。
 * @param {number} threshold 指定個数。
 * @return {number} 指定個数未満になる確率。
 */
const calc_prob_less_than = (mean, var_, threshold) => {
  return jStat.normal.cdf(threshold, mean, Math.sqrt(var_));
};
