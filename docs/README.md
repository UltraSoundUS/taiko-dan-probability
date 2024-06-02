# ベイズの定理で推論する

ベイスの定理は以下のように表される。

$$\begin{aligned}
p(\theta | \mathcal{D}) & = \frac{p(\mathcal{D} | \theta) p(\theta)}{p(\mathcal{D})} \\
&= \frac{p(\mathcal{D} | \theta) p(\theta)}{\int p(\mathcal{D} | \theta) p(\theta) \, \mathrm{d}\theta}
\end{aligned}$$

このとき、$p(\theta | \mathcal{D})$ は事後分布、$p(\mathcal{D} | \theta)$ は尤度、$p(\theta)$ は事前分布、$p(\mathcal{D})$ は周辺尤度である。

尤度をポアソン分布と仮定した場合、事前分布は以下のように表される。

$$\begin{aligned}
p(\theta) = p(\lambda | a, b) = \text{Gam}(\lambda | a, b)
\end{aligned}$$

このとき、事後分布は以下のように表される。

$$\begin{aligned}
p(\lambda | \mathcal{D}) &= \text{Gam}(\lambda | \hat{a}, \hat{b})
\end{aligned}$$

このとき、$\hat{a}, \hat{b}$ は以下のように表される。

$$\begin{aligned}
\hat{a} &= a + \sum_{n=1}^N x_n = a + N \bar{x} \\
\hat{b} &= b + N
\end{aligned}$$

推論結果 $x_*$ の確率分布は負の二項分布に従い、以下のように表される。

$$\begin{aligned}
p(x_* | \mathcal{D}) &= \text{NB}(x_* | r, p) \\
&= \binom{x_* + r - 1}{x_*} p^r (1 - p)^{x_*}
\end{aligned}$$

このとき、$r, p$ は以下のように表される。

$$\begin{aligned}
r &= \hat{a} \\
p &= \frac{1}{1 + \hat{b}}
\end{aligned}$$

この分布の平均と分散はそれぞれ以下のように表される。

$$\begin{aligned}
\mathbb{E}[x_* | \mathcal{D}] &= \frac{p r}{1 - p} \\
\text{Var}[x_* | \mathcal{D}] &= \frac{p r}{(1 - p)^2}
\end{aligned}$$

データが十分大きい場合、分散は不偏分散に近づいて行く。

## 参考文献

- ベイズ推論による機械学習入門

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
