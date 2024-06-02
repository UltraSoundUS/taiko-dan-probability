// Copyright (c) 2024 UltraSoundUS All Rights Reserved.

// HTML 要素の取得と更新

/**
 * 指定された ID の textarea を読み取る。
 * 数字以外の文字は無視され、改行か空白、カンマで区切られた数字の配列が返される。
 *
 * @param {string} id ID。
 * @return {[number]} 数字の配列。
 */
const get_data_from_textdata = (id) => {
  // テキストエリアを取得する。
  const textarea = document.getElementById(id);
  const text = textarea.value;
  // 区切り文字で分割する。
  const seqs = text.split(/[\n\s,]+/);
  // 数字以外を取り除いたあと、数値に変換する。
  return seqs.filter(x => x.match(/^\d+$/)).map(x => Number(x));
};

/**
 * 指定した ID の要素のテキストを更新する。
 *
 * @param {string} id ID。
 * @param {string} text テキスト。
 */
const update_text = (id, text) => {
  const element = document.getElementById(id);
  element.textContent = text;
};

/**
 * 入力されたデータを取得し、事後分布の平均と分散を求める。
 *
 * @param {[number]} data 入力データ。
 * @param {number} max_combos 最大コンボ数。
 * @return {[number]} 事後分布の平均と分散。
 */
const calc_posterior_stats = (data, max_combos) => {
  const prior_params = calc_prior_params(max_combos);
  const posterior_params = calc_posterior_params(prior_params, data);
  const negbinom_params = convert_prior_to_negbinom(posterior_params);
  return calc_negbinom_mean_var(negbinom_params);
};

// データの入力元と出力先の ID を定義する。

/**
 * データの入力元と出力先の ID。
 *
 * @type {[[string]]}
 */
const id_pairs = [
  [
    ["1st-good-data", "1st-max-combos", "req-good"], ["1st-good-mean", "1st-good-lower", "1st-good-upper"],
  ],
  [
    ["1st-bad-data", "1st-max-combos", "req-bad"], ["1st-bad-mean", "1st-bad-lower", "1st-bad-upper"],
  ],
  [
    ["2nd-good-data", "2nd-max-combos", "req-good"], ["2nd-good-mean", "2nd-good-lower", "2nd-good-upper"],
  ],
  [
    ["2nd-bad-data", "2nd-max-combos", "req-bad"], ["2nd-bad-mean", "2nd-bad-lower", "2nd-bad-upper"],
  ],
  [
    ["3rd-good-data", "3rd-max-combos", "req-good"], ["3rd-good-mean", "3rd-good-lower", "3rd-good-upper"],
  ],
  [
    ["3rd-bad-data", "3rd-max-combos", "req-bad"], ["3rd-bad-mean", "3rd-bad-lower", "3rd-bad-upper"],
  ],
];

/**
 * 最終結果の入力元と出力先の ID。
 *
 * @type {[string]}
 */
const id_pair_total = [
  // 入力元は、id_pairs の出力先すべてを結合したもの。
  id_pairs.map(([_, output_ids]) => output_ids).flat(),
  ["total-good-prob", "total-bad-prob"],
];

/**
 * データの入力元が更新されたタイミングとページが読み込まれたタイミングで、出力先を表示できるように、イベントを設定する。
 */
const set_event = () => {
  id_pairs.forEach(([input_ids, output_ids]) => {
    const [data_id, max_combos_id, _] = input_ids;
    const [mean_id, lower_id, upper_id] = output_ids;
    const update_output = () => {
      const data = get_data_from_textdata(data_id);
      const max_combos = Number(document.getElementById(max_combos_id).value);
      const [mean, var_] = calc_posterior_stats(data, max_combos);
      update_text(mean_id, mean.toFixed(2));
      // 0 以上 かつ 最大コンボ数以下の値にする。
      const [lower, upper] = calc_confidence_interval(mean, var_).map(x => Math.max(0, Math.min(max_combos, x)));
      update_text(lower_id, Math.floor(lower));
      update_text(upper_id, Math.ceil(upper));
      // 最終結果の更新も行う。
      update_total_output();
    };
    document.getElementById(data_id).addEventListener("input", update_output);
    document.getElementById(max_combos_id).addEventListener("input", update_output);
    // ページ読み込み時にも実行する。
    update_output();
  });
};

/**
 * 最終結果を更新する。
 */
const update_total_output = () => {
  // 可の入力だけを取り出す。
  const inputs_good = id_pairs.filter((_, index) => index % 2 === 0).map(([input_ids, _]) => input_ids);
  const results_good = inputs_good.map((input_ids) => {
    const [data_id, max_combos_id] = input_ids;
    const data = get_data_from_textdata(data_id);
    const max_combos = Number(document.getElementById(max_combos_id).value);
    return calc_posterior_stats(data, max_combos);
  });
  // 不可の入力だけを取り出す。
  const inputs_bad = id_pairs.filter((_, index) => index % 2 === 1).map(([input_ids, _]) => input_ids);
  const results_bad = inputs_bad.map((input_ids) => {
    const [data_id, max_combos_id] = input_ids;
    const data = get_data_from_textdata(data_id);
    const max_combos = Number(document.getElementById(max_combos_id).value);
    return calc_posterior_stats(data, max_combos);
  });
  // 結果を合計する。
  const [mean_good, var_good] = calc_sum_mean_var(...results_good);
  const [mean_bad, var_bad] = calc_sum_mean_var(...results_bad);

  // 確率を計算する。
  const prob_good = 100 * calc_prob_less_than(mean_good, var_good, document.getElementById("req-good").value);
  const prob_bad = 100 * calc_prob_less_than(mean_bad, var_bad, document.getElementById("req-bad").value);
  update_text("total-good-prob", prob_good.toFixed(2));
  update_text("total-bad-prob", prob_bad.toFixed(2));
};


// ページの読み込み完了時にイベントを設定する。
window.addEventListener("load", set_event);
