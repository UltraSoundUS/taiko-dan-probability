# ベイズの定理で推論する

ベイスの定理は以下のように表される。

$$\begin{aligned}
p(\theta | \mathcal{D}) & = \frac{p(\mathcal{D} | \theta) p(\theta)}{p(\mathcal{D})} \\
&= \frac{p(\mathcal{D} | \theta) p(\theta)}{\int p(\mathcal{D} | \theta) p(\theta) \, \mathrm{d}\theta}
\end{aligned}$$

このとき、$p(\theta | \mathcal{D})$ は事後分布、$p(\mathcal{D} | \theta)$ は尤度、$p(\theta)$ は事前分布、$p(\mathcal{D})$ は周辺尤度である。

尤度を正規分布と仮定した場合、事前分布は以下のように表される。

$$\begin{aligned}
p(\theta) = p(\mu, \lambda)
&= N (\mu | \mu_0, (\beta \lambda)^{-1}) \, \text{Gam}(\lambda | a, b)
\end{aligned}$$

このとき、事後分布は以下のように表される。

$$\begin{aligned}
p(\mu, \lambda | \mathcal{D}) &= N (\mu | \hat{\mu}, (\hat{\beta} \lambda)^{-1}) \, \text{Gam}(\lambda | \hat{a}, \hat{b})
\end{aligned}$$

このとき、$\hat{\mu}, \hat{\beta}, \hat{a}, \hat{b}$ は以下のように表される。

$$\begin{aligned}
\hat{\mu} &= \frac{\beta \mu_0 + N \bar{x}}{\hat{\beta}} \\
\hat{\beta} &= \beta + N \\
\hat{a} &= a + \frac{N}{2} \\
\hat{b}
&= b + \frac{1}{2} \left[ \sum_{n=1}^N (x_n - \bar{x})^2 + \frac{\beta N}{\hat{\beta}} (\bar{x} - \mu_0)^2 \right] \\
&= b + \frac{1}{2} \left[ \sum_{n=1}^N (x_n)^2 + \beta (\mu_0)^2 - \hat{\beta} \hat{\mu}^2 \right]
\end{aligned}$$

なお、$\bar{x}$ はデータの平均、$N$ はデータ数である。
$b$ の最後の等式が成立してるかどうかは未確認。

データ数が十分大きい場合、$\hat{\mu}, \hat{\beta}, \hat{a}, \hat{b}$ は以下のように近似される。

$$\begin{aligned}
\hat{\mu} &\approx \bar{x} \\
\hat{\beta} &\approx N \\
\hat{a} &\approx \frac{N}{2} \\
\hat{b} &\approx \frac{1}{2} \sum_{n=1}^N (x_n - \bar{x})^2
\end{aligned}$$

推論結果 $x_*$ の確率分布は以下のように表される。

$$\begin{aligned}
p(x_* | \mathcal{D}) &= t\left(x_* | \hat{\mu}, \frac{\hat{\beta} \hat{a}}{(1 + \hat{\beta}) \hat{b}}, 2 \hat{a}\right)\\
\end{aligned}$$

このとき、$t$ は Student の t 分布である。

この分布の平均と分散はそれぞれ以下のように表される。

$$\begin{aligned}
\mathbb{E}[x_* | \mathcal{D}] &= \hat{\mu} \\
\text{Var}[x_* | \mathcal{D}] &= \frac{(1 + \hat{\beta}) \hat{b}}{\hat{\beta} \hat{a}} \frac{\hat{a}}{\hat{a} - 1} \\
&= \left(1 + \frac{1}{\hat{\beta}}\right) \frac{1}{\hat{a} - 1} \hat{b} \\
&\approx \frac{1}{N - 1} \sum_{n=1}^N (x_n - \bar{x})^2
\end{aligned}$$

データが十分大きい場合、分散は不偏分散に近づいて行く。

## 参考文献

- ベイズ推論による機械学習入門
- PRML
- [Student's t-distribution - Wikipedia](https://en.wikipedia.org/wiki/Student%27s_t-distribution)

# 正規分布の再生性

確率変数 $x_1, \dots, x_N$ が正規分布 $N(x | \mu, \sigma^2)$ に従うとき、その線形結合も正規分布に従う。

$$\begin{aligned}
\sum_{n=1}^N a_n x_n &\sim N \left( \sum_{n=1}^N a_n \mu_n, \sum_{n=1}^N a_n^2 \sigma_n^2 \right)
\end{aligned}$$

特に、$a_n = 1$ のとき、以下のように表される。

$$\begin{aligned}
\sum_{n=1}^N x_n &\sim N \left( \sum_{n=1}^N \mu_n, \sum_{n=1}^N \sigma_n^2 \right)
\end{aligned}$$

## 参考文献

- [正規分布 - Wikipedia](https://ja.wikipedia.org/wiki/%E6%AD%A3%E8%A6%8F%E5%88%86%E5%B8%83)
