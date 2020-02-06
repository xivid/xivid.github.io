---
title: 'Offloading Index Traversal to the Network Card'
date: 2017-03-23 00:00:00 Z
layout: page
description: Internship, Prof. Gustavo Alonso, Systems Group, ETH Zurich
img: "/assets/img/btree.png"
abstract: B+-trees are the dominating data structure for indexing in databases. B+-trees can
  answer lookup queries (single entry) and range queries (multiple entries).
  The goal of this project is to enable direct index traversal and retrieval of data
  objects from the network card. While querying the B+-tree is offloaded entirely
  to the network card, inserts can be done by the CPU or implemented in a hybrid fashion.
  To improve performance the implementation of the B+-tree takes into account
  the characteristics of the DMA and the FPGA to minimize the overhead when traversing
  the tree. In addition on-chip memory on the FPGA can be used to cache tree nodes.
  Access to the B+-tree is exposed to other machines through specific RDMA verbs
  to either query or insert tuples.
---

to be added...