---
title: Projects
permalink: "/projects/"
layout: page
description: Coding is the ultimate addictive game!
---

{% assign projects = site.projects | reverse %}  
{% for project in projects %}

<hr>
<div class="row">
<h4><a href="{{ project.url | prepend: site.baseurl | prepend: site.url }}">{{project.title}}</a></h4>
<h5>{{project.description}}</h5>
<img class="col one" src="{{ project.img | prepend: site.baseurl | prepend: site.url }}" alt="">
<p>{{project.abstract}}</p>
</div>

{% endfor %}
