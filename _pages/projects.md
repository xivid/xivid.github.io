---
layout: page
title: projects
permalink: /projects/
description: Coding is the ultimate addictive game!
---

{% assign projects = site.projects | reverse %}  
{% for project in projects %}

<hr>
<div class="row">
<h3><a href="{{ project.url | prepend: site.baseurl | prepend: site.url }}">{{project.title}}</a></h3>
<h4>{{project.description}}</h4>
<img class="col one" src="{{ project.img | prepend: site.baseurl | prepend: site.url }}" alt="">
<p>{{project.abstract}}</p>
</div>

{% endfor %}
