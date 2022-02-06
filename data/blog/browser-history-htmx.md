---
title: Browser History with Htmx
date: '2022-02-06'
tags: ['python', 'django', 'htmx']
draft: false
summary: 'Managing Browser History in a Single Page Application Built with Django and htmx.'
---

## Htmx

<sub>(This whole journey for me was inspired by this article: [Django, HTMX and Alpine.js: Modern websites, JavaScript optional](https://www.saaspegasus.com/guides/modern-javascript-for-django-developers/htmx-alpine/))</sub>

One of the big draws of htmx for me has been the ability to take full advantage of Django's templates. This easily allows me to create a single page application (SPA), that relies on HTML fragments dynamically created by the server rahter than JS in the browser. That means less conceptual overhead when thinking through the UX and data. 

There's only one issue...

I have a lot of users who probably wouldn't really appreciate the experience of a basic SPA. Habit will have them hit the back button and they'll be thrown back to a previous website! Or they'll bookmark a page and find it on future visits to only be a basic HTML page lacking context. (Imagine Gmail if the browser's back button didn't work.) Both of those instances would severly dampen any trust in an application. 

But the speed and the minimal JS needed to create a single page application with htmx are worth the effort I'd need to put in to accomodate those users. In previous applications I had tried using just vanilla JS. But that seriously becomes difficult to maintain and expand on as the app grows. On the flip side, using a fullblown JS framework like React adds overhead and is another application in and of itself. 

Finding htmx, I saw a new way forward.

## Fixing History

My Django application has a single app with a simple ```urls.py```:
```python urls.py
urlpatterns = [
    path("", views.index, name="index"),
    # HTMX paths
    path("index_contents", views.index_contents, name="index_contents"),
    path("new", views.new_incident, name="new"),
    path("view/<int:incident_id>", views.view_incident, name="view"),
    path("quick_filter/<int:location_id>", views.quick_filter, name="quick_filter"),
    path("search", views.search, name="search"),
]
```

As you can see, there's really only one path that's going to return a full ```<html>``` document. Everything else is going to be a fragment.

That's fine if I assume everyone is going to navigate to the index first and then only use the in app navigation and not the browser's. But I can't and shouldn't assume that.

So for the first part, appending to the browser's history so that someone could use the browser's back button and not go back to a previous website.

Htmx comes with a simple way to append to the browser's history with ```hx-push-url="true"```. That exposes my htmx url to the address line and adds it to the browser's history. But those htmx URLs only return HTML fragments. Htmx warns of this themselves right there in the documentation:

>NOTE: If you push a URL into the history, you must be able to navigate to that URL and get a full page back! A user could copy and paste the URL into an email, or new tab. Additionally, htmx will need the entire page when restoring history if the page is not in the history cache.

That fixes the use case for someone navigating within the app itself, but not if someone copies a URL and expects to share it. As htmx warns, these URLs need to return a full page!

## Htmx's Meta Header

Every request that comes from htmx (i.e. something like ```hx-get```) has a ```HTTP_HX_REQUEST``` value in the request. That gives a way into the figuring out what template I should be serving for every request. If it's htmx requesting, the fragment is all that's needed. If not we'll need to include the layout, too.

With that in mind I created a helper function that a view could use to determine which template to serve this request. It takes the request and template name, and gives the string to the correct template.

```python
def get_template(request, template: str) -> str:
    """Given the request and the template name, returns the template
    depending on if the request came from an htmx call or directly from
    the browser.
    """
    if request.META.get("HTTP_HX_REQUEST") != "true":
        # Edge case for index.
        if template == "index_contents":
            return "incidents/index.html"
        return f"incidents/{template}_full.html"
    return f"incidents/htmx/{template}.html"
```

In my templates everything's organized like this:

```
$APP_ROOT
└── templates
    └── incidents
        ├── htmx
        |   └── # html fragments for htmx requests
        └── # top level templates, like layout.html
```

That helps me think what's going to produce what. And the real beauty lies in how easy it is to create the `_full.html` templates for the fragments.

For example, I have a ```layout.html``` that is the base for all other pages. All of the full templates just ```extends``` that and then I just need to ```include``` my htmx fragment and viola I have a full page:

```html
{% extends 'incidents/layout.html' %}

{% block main %}
{% include "incidents/htmx/incident.html" %}
{% endblock %}
```

```Get_template``` then essentially extends my layout when I need to, otherwise just gives em the fragment.

So whether a user wants to navigate my app through the browser's history or travel directly to a page, I can handle it with these simple additions.

In a future post I'll write about how I'm also using Alpine.js, htmx's sibling by natural.
