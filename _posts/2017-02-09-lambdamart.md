---
layout: post
title: a post with math
date: 2015-10-20 11:12:00-0400
description: an example of a blog post with some math
---

本文翻译自From RankNet to LambdaRank to LambdaMART: An Overview, Christopher J.C. Burges, Microsoft Research Technical Report MSR-TR-2010-82（[原文链接](https://www.microsoft.com/en-us/research/publication/from-ranknet-to-lambdarank-to-lambdamart-an-overview/)）。一些常用的，特别是已含有特别意义的英文名词，在此不做翻译。有可能引起歧义或理解困难的词语均在括号中标注了英文原文。
<!-- more -->
## 摘要
LambdaMART是“提升树（boosted tree）”版的LambdaRank，而后者基于RankNet。RankNet、LambdaRank和LambdaMART用于解决现实世界的排序问题，已经被证明是非常成功的算法，例如在2010年的Yahoo!排序学习挑战（Learning To Rank Challenge）中，一组LambdaMART排序器（rankers）的组合（ensemble）赢得了Track 1。这些算法的细节分散在若干论文和报告中，所以我们在此对它们给出一个独立的（self-contained）、详细的、完全的描述。

## 1 介绍
LambdaMART是“提升树（boosted tree）”版的LambdaRank，而后者基于RankNet。RankNet、LambdaRank和LambdaMART用于解决现实世界的排序问题，已经被证明是非常成功的算法，例如一组LambdaMART排序器（rankers）的组合（ensemble）曾经赢得了2010年的Yahoo!排序学习挑战（Learning To Rank Challenge）（Track 1）[5]。尽管在此我们将只关注排序，推广MART特别是LambdaMART以解决各种有监督学习问题（包括最大化信息检索（information retrieval）函数，比如NDCG，它不是模型分数（model score）的光滑函数）也是很容易的。
本文试图对上述算法给出一个独立的（self-contained）解释。唯一需要的数学基础是基本的向量运算；本文假设读者对排序学习问题有一定的了解。我们希望这个概述足够地独立，比如能够让一位想训练一个提升树模型（boosted tree model）来优化某个信息检索的评价指标（information retrieval measure）的读者理解怎样用这些方法实现目标。从头到尾，我们都会以网络搜索排序作为一个具体的例子来讲解。灰色部分（译者注：文中会有提示）的材料是背景材料，对于理解主题来说不是必需的。这些思想有几年的历史，出现在若干论文中；本文的目的是把这些思想整理到一起，放到好找的地方（并且在需要的地方添加背景和更多细节）。为了保持叙述的简洁，本文中没有提及实验结果，并且不与任何其他排序学习的方法（有很多）作比较；这些话题在其他地方有广泛的讨论。

## 2 RankNet
对于RankNet [2]来说，任何模型，只要模型输出是模型参数的可微函数，就可以是RankNet的底层模型（通常我们用神经网络实现，但是我们也用提升树（boosted trees）做了实现，下面会描述）。 RankNet的训练过程如下。训练数据是按照查询（query）进行分组（partitioned）的。在训练中，RankNet把一组输入特征向量$x\in\mathscr{R}^n$映射到一个数$f(x)$。对于一个给定的查询（query），选择出**每一组**具有不同标签（labels）的URL（译者注：下称“文档”）$U_i$和$U_j$，然后应用模型对这组特征向量$x_i$和$x_j$计算出分数$s_i=f(x_i)$和$s_j=f(x_j)$。令$U_i\rhd U_j$代表事件“$U_i$应排到$U_j$之上”（原因如对于这个查询，$U_i$被标为“优秀”而$U_j$被标为“差”；注意相同URL的标签在不同查询中可能是不同的）。模型的两个输出（译者注：$s_i$和$s_j$）通过一个sigmoid函数被映射到事件“$U_i$应排到$U_j$之上”的习得概率（learned probability）上，因此：$$P_{ij}\equiv P(U_i\rhd U_j) \equiv \frac{1}{1+e^{-\sigma(s_i-s_j)}}$$
其中参数$\sigma$的选择确定sigmoid的形状。使用sigmoid是神经网络训练中的一个常用手段，已被证明能够得到很好的概率估计值[1]。然后我们应用交叉熵代价函数（cross entropy cost function），它对模型输出的概率距期望概率的偏差进行惩罚：令$\bar{P}_{ij}$为已知的“训练文档$U_i$应排到训练文档$U_j$之上”的概率，那么代价是$$C=-\bar{P}_{ij}logP_{ij}-(1-\bar{P}_{ij})\log{(1-P_{ij})}$$
对于一个给定的查询，令$S_{ij}\in\{0,\pm 1\}$定义如下：若文档$i$被标注为比文档$j$更相关，$S_{ij}$等于$1$，若文档$i$被标注为比文档$j$更不相关，$S_{ij}$等于$-1$，若两个文档标签相同，$S_{ij}$等于$0$。在本文全文中，我们假设期望的排序是确切知道的，因此$\bar{P}_{ij}=\frac{1}{2}(1+S_{ij})$。（注意模型也能够处理更一般的估计概率的情况，比如$\bar{P}_{ij}$能够通过几个裁判估计出来。）将上述两个等式合在一起，有$$C=\frac{1}{2}(1-S_{ij})\sigma (s_i-s_j)+\log{(1+e^{-\sigma(s_i-s_j)})}$$
代价令人欣慰地对称（交换i和j和改变$S_{ij}$的符号都应该保持代价不变）：对于$S_{ij}=1$，$$C=\log{(1+e^{-\sigma (s_i-s_j)})}$$
而对于$S_{ij}=-1$，$$C=\log{(1+e^{-\sigma (s_j-s_i)})}$$
注意当$s_i=s_j$时，代价是$\log{2}$，因此模型包含一个边缘（也就是说，标签不同而模型打分相同的文档，在排序中依然会被互相推开）。而且，渐近地，代价趋于线性（如果分数给出错误的排序），或零（如果分数给出正确的排序）。这就得出$$\frac{\partial C}{\partial s_i} = \sigma \left( \frac{1}{2}  (1-S_{ij}) - \frac{1}{1+e^{\sigma (s_i-s_j)}} \right) = - \frac{\partial C}{\partial s_j} \tag{1} $$
这个梯度被用来更新权值$w_k\in\mathscr{R} $（即模型参数）从而通过随机梯度下降（stochastic gradient descent）来降低代价$^1$（注1：我们按照惯例，如果两个量以乘积的形式出现并且它们指数相同，就把指数相加）（译者注：原文如此，实际应为“两个相同的量”）：$$w_k \rightarrow w_k - \eta \frac {\partial C} {\partial w_k} = w_k - \eta (\frac {\partial C}{\partial s_i} \frac{\partial s_i}{\partial w_k} + \frac {\partial C}{\partial s_j} \frac{\partial s_j}{\partial w_k}) \tag{2}$$
其中$\eta$是一个正的学习率（learning rate，一个使用验证集（validation set）选择的参数；在我们的实验中往往是1e-3到1e-5）。显然：$$\delta C = \sum_{k}{\frac {\partial C}{\partial w_k}\delta w_k} = \sum_{k}{\frac {\partial C}{\partial w_k}\left( -\eta \frac {\partial C}{\partial w_k} \right)} = -\eta \sum_{k}{\left(\frac {\partial C}{\partial w_k} \right)^2} \lt 0$$
利用梯度下降法学习的思想是在本文到处出现的一个关键思想（即使当期望的代价函数不具有适定的（well-posed，译者注：见[Wikipedia](https://en.wikipedia.org/wiki/Well-posed_problem)）梯度时，和当模型（比如提升树的组合）不具有可微分的参数时）：为了更新模型，我们必须指明代价函数关于模型参数$w_k$的梯度，而为此，我们又需要代价函数关于模型分数$s_i$的梯度。提升树（如MART[8]）的梯度下降公式避开了通过直接建模$\partial C/\partial s_i$来计算$\partial C/\partial w_k$的需要。

### 2.1 RankNet因式分解：加速Ranknet训练
上述分析引出了一个因式分解，这个观察是导出LambdaRank[4]的关键：对于一组给定的URL $U_i, U_j$（依然假设重复指数可以相加），
$$\frac {\partial C}{\partial w_k} = \frac {\partial C}{\partial s_i} \frac {\partial s_i}{\partial w_k} + \frac {\partial C}{\partial s_j} \frac {\partial s_j}{\partial w_k} = \sigma \left( \frac{1}{2}(1-S_{ij})-\frac{1}{1+e^{\sigma(s_i-s_j)}} \right) \left( \frac{\partial s_i}{\partial w_k} - \frac{\partial s_j}{\partial w_k}\right) \\ 
= \lambda_{ij}\left( \frac{\partial s_i}{\partial w_k} - \frac{\partial s_j}{\partial w_k} \right )$$
其中我们已经定义
$$\lambda_{ij} \equiv \frac{\partial C(s_i-s_j)}{\partial s_i} = \sigma \left( \frac{1}{2}(1-S_{ij})-\frac{1}{1+e^{\sigma(s_i-s_j)}}  \right) \tag{3} $$ 
令$I$代表指数对$\{i,j\}$的集合，其中我们希望对$U_i$的排序结果与$U_j$不同（对于一个给定的查询）。$I$必须仅包含每个指数对一次，所以为了方便，我们沿袭惯例，即$I$包含指数对$\{i,j\}$，其中$U_i\rhd U_j$，因此$S_{ij}=1$（这大大简化了记号，从现在开始我们就假设如此）。注意因为RankNet从概率中学习并输出概率，它不要求文档被标记（labeled）；它仅仅需要集合$I$，这也可以通过聚集两两的偏好来确定（这样更具一般性，因为可能会有不一致存在，比如一个糊涂的裁判可能对于一个查询给出$U_1 \rhd U_2, U_2 \rhd U_3, U_3 \rhd U_1$的结果）。现在，把所有对权值$w_k$的更新的贡献加在一起就得到
$$\delta w_k = - \eta \sum_{ \{i,j\} \in I}{\lambda_{ij}\left( \frac{\partial s_i}{\partial w_k} - \frac{\partial s_j}{\partial w_k} \right )} \equiv -\eta \sum_{i}{\lambda_i \frac {\partial s_i}{\partial w_k}}$$
其中我们已经引入了$\lambda_i$（每个文档一个$\lambda_i$：注意一个下标的$\lambda$是两个下标的$\lambda$的总和）。为了计算（文档$U_i$的）$\lambda _i$，我们找到所有$\{i,j\} \in I$的$j$和所有$\{k,i\} \in I$的$k$。对于前者，我们给$\lambda_i$加上$\lambda_{ij}$，对于后者，我们给$\lambda_i$加上$\lambda_{ki}$。比如，如果仅有一对$U_1 \rhd U_2$，那么$I=\{ \{1,2\}\}, \lambda_1 = \lambda _{12} = - \lambda _2$。一般地，我们有：
$$\lambda_i = \sum_{j:\{i,j\}\in I}{\lambda_{ij}} - \sum_{j:\{j,i\}\in I}{\lambda_{ij}} \tag{4}$$
正如我们后面将会看到的，你可以认为$\lambda$是小箭头（或力），每个$\lambda$属于一个（排过序的）文档，其长度指明了对于一个给定文档，从所有包含那个文档的文档对中算得的$\lambda$是算了多少、在哪算的。我们一开始实现RankNet时，采用了真正的随机梯度下降：权值在每一对（具有不同标签的）文档都被检查以后才更新。而上述内容表明，我们可以累加每个文档的$\lambda$，把所有文档对（一个“文档对”包括两个具有不同标签的URL）给这个文档的贡献加起来，然后做更新。这就是小批量学习（mini-batch learning），这种方法先对一个给定查询计算所有的权值更新，然后应用更新，但加速还来自问题因式分解的方式，而不仅仅是由于使用小批量学习。这导致了RankNet训练中的一个非常明显的加速（因为更新一次权值有很大代价，比如对神经网络模型来说要做反向传播（backprop））。实际上训练时间从接近每个查询的包含的文档数的平方时间下降到了接近线性时间。它也为LambdaRank打下了基础，但是讨论那个之前，我们先来回顾一下我们要学习（learn）的信息检索评价指标。

## 3 信息检索评价指标

未完待续……