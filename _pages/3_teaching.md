---
title: teaching
permalink: "/teaching/"
layout: page
description: I have worked as TA for two programming language courses.
---

{% assign courses = site.teaching | reverse %}	
{% for course in courses %}

<hr>
<div class="row">
    <h4><a href="{{ course.url | prepend: site.baseurl | prepend: site.url }}">{{ course.title }}</a></h4>
    <h5>Role: {{ course.role }}</h5>
    <h5>Instructor: {{ course.instructor }}, {{ course.place }}, {{ course.semester }}</h5>
    <p>{{ course.abstract }}</p>
</div>

{% endfor %}