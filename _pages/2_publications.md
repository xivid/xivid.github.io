---
title: publications
permalink: "/publications/"
layout: page
description: 'I''m still looking forward to my first publication... Below are just
  some placeholders :grin:'
years:
- 1956
- 1950
- 1935
- 1905
---

{% for y in page.years %}
  <h3 class="year">{{y}}</h3>
  {% bibliography -f papers -q @*[year={{y}}]* %}
{% endfor %}
