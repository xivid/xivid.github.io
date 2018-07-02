---
title: activities
permalink: "/activities/"
layout: page
description: Auld Lang Syne
---

{% assign activities = site.activities | reverse %}  
{% for activity in activities %}

<hr>
<div class="row">
<h4><a href="{{ activity.url | prepend: site.baseurl | prepend: site.url }}">{{activity.title}}</a></h4>
<h5>{{activity.description}}</h5>
<img class="col one" src="{{ activity.img | prepend: site.baseurl | prepend: site.url }}" alt="">
<p>{{activity.abstract}}</p>
</div>

{% endfor %}
