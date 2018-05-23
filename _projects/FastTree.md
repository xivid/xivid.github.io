---
layout: page
title: "FastTree: Efficient Distributed Gradient Boosting Tree Framework"
description: Final Year Project @ Systems Research Group, Microsoft Research Asia
date: 2017-03-23 08:00:00+0800
img: /assets/img/tree.png
abstract: >-
  A distributed machine learning framework based on <a href="https://en.wikipedia.org/wiki/Gradient_boosting#Gradient_tree_boosting" target="_blank">Gradient Boosting Decision Tree</a> (GBDT, GBRT, GBM or MART). The current version is built on top of <i>ChaNa</i>, the RDMA-optimized distributed computing engine developed by MSRA Systems Group. With both system-level and algorithm-level optimizations, memory usage and communication cost are reduced, and the performance is better than popular similar tools (e.g. XGBoost).
---

I have developed the framework on <i>ChaNa</i>. It's worth mentioning that, the techniques we proposed are general, and have been implemented in Microsoft's other opensource GBDT frameworks: <a href="https://github.com/Microsoft/LightGBM" target="_blank">LightGBM</a> <b>(received 2000+ stars on GitHub)</b>, <a href="https://github.com/cloudml/SparkTree" target="_blank">SparkTree</a> (Spark version of FastTree). Our framework on ChaNa is seamlessly integrated into the AllReduce-based application module of ChaNa, enjoying the NUMA-aware architectural design and RDMA networking optimizations of ChaNa, while introducing almost no system overhead thanks to ChaNa's very low-level abstractions. My undergraduate thesis is based on this project.