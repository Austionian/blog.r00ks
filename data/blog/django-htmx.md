---
title: A Solo Engineer's Dream MVC - Django, htmx, Alpinejs
date: '2022-02-22'
tags: ['python', 'django', 'htmx']
draft: false
summary: "A match made in heaven for applications created by a single developer, taking full advantage of Django's templating and organization."
---

/// **This article was my submitted description to my capstone project for CS50's Web Programming with Python and JavaScript**

## Critical Incidents

For my capstone project I created an application called Critical Incidents. At the social services non-profit where I currently work, we have a InfoPath form with a SharePoint 2013 workflow that is currently facilitating the recording and notification of critical incidents. A critical incident is anytime an emergency service is called, be that by the client or staff. In the workflow's current implementation a case manager has to fill out an extensive form, which then triggers a notification to their supervisor, and then distributes the incident up the organization's tree ending up in the COO's and general counsel's inbox. As I was the one to create that form and workflow it put me in a good place to create a new version with Django.

Going into this capstone I reflected back on my CS50 capstone project (an employee management application, which is still up and running successfully(!) and I'll talk about more later as well) and immediately identified some requirements that this Critical Incident app would need in order to succeed:

- **Use a front end framework rather than vanilla JavaScript** -- My CS50 capstone was built with Flask and dealt with a lot of dynamic forms and ajax requests to fill those forms. It's been a minor headache maintaining all the JavaScript needed to make those things happen. I refactored a lot of it as I've gone along to be more re-usable across forms and concepts, but there are still plenty of places that deal with specific data and need specific code, i.e. those ajax requests that use JSON to dynamically populate the form. I've found there's only so much generalizing I can do and the rest is just organization which is difficult to extend.

- **Take Advantage of Bootstrap Utility Classes** -- Since I'm already going for a minimal JS theme, I wanted to minize my CSS footprint as well.

- **Integrate with Active Directory** -- Again thinking back on the CS50 capstone, one of the first questions that came up from end users was whether the app integrated with Active Directory. It didn't and while it's a minor inconveince for my users to have to create an account, it's more so a vulnerability, because now I have another application to manage access to when users leave and should no longer have access to the application. I have a workaround inplemented in that application, but it's not as foolproof as entirely leaving the authenticating to a centralized service like AD.

- **Write More Tests** -- For every commit I push, I committed myself to having unit tests that cover any new code and update any existing tests so that they're passing.

Requirements that I identified where there could be great UI/UX improvements from the SharePoint instance:

- **Simplify the form and process** -- The SharePoint version of critical incidents is a long form with multiple steps (submission -> reivew by supervisor -> review by program manager for follow up -> notify the relevant parties). The long form puts a burden on case managers and most of the data hasn't been used.

- **Allow the data to be easily filtered and searched** -- SharePoint comes with the ability to search a list and sort columns, but it's limited and slow. List views are not something that the average user knows about.

- **Performance** -- SharePoint on-prem isn't terribly slow, but a SharePoint list (where the data is currently stored) isn't a database and as an agency we have on average 2-3 incidents/ day, so doing any sort of data analysis on the data can be a slog. Not to mention, we recently crossed the list view threshold, which while manageable, goes to further show the limitations of SharePoint and any low code/no code Microsoft solutions.

## What Critical Incidents Does

Critical Incidents at basic level is a way for agency staff to submit a critical incident.

There are four main pages:

1. the index that displays recent incidents
2. the search results page
3. a simple dashboard
4. the incident form itself

A case manager navigates to the website and is authenticated with Active Directy through a third party package I'll explain below. The user can view incidents they've already created (only admins have access to all incidents), or create a new incident. They can search for specific incident or view a simple graph of all incidents on the dashboard.

## Distinctiveness and Complexity

### Hosting and CI/CD

The application itself is currently hosted on Heroku at a subdomain of the capstone I submitted for CS50.

I created a simple CI/CD pipeline with Github actions, which works seamlessly with Heroku. Everytime I push to main, my tests run. If the tests pass, Heroku will automatically start a new build. If the tests fail, Heroku won't start a build. At this time I have 96% code coverage (which was determined by the [coverage](https://pypi.org/project/coverage/) Python package). I haven't been following a TDD process, but I have been making unit tests a priority before pushing commits.

### Frameworks and Packages

### [django-microsoft-auth](https://pypi.org/project/django-microsoft-auth/)

I used this package for the app's authentication to meet one of my self imposed requirements above. It was difficult to set up mostly because its documentation wasn't very verbose and I hadn't implemented anything like it before. All of its setting are in the Django project's `settings.py` and the package itself requires the use of Django's ['sites' framework](https://docs.djangoproject.com/en/4.0/ref/contrib/sites/#enabling-the-sites-framework). If a user tries to access my site, they'll need to authenticate with my company's AD. If successfull, this package then automatically creates a user object in Django's standard User model if the user didn't already have an account in my app.

### [htmx](https://htmx.org/)

Using htmx allowed me to take full advantage of Django's templating power. I was able to create a single page application with minimal JavaScript. It allowed me to write something like `hx-get="{% url 'new' %}"` in a button or link to create an ajax request to the specified URL and then take the fetch's result (an HTML fragment) and swap it in in place of an existing element.

A difficulty in using htmx was making the SPA experience user friendly. By default the URL isn't updated as the user moves about the app. Anytime they use the back button, they're thrown back to a previous webpage rather than a previous 'page' in my app. Htmx gives half the solution with `hx-push-url`, which appends the route that the hx get or post got to the URL and thus the browser's history, but in general those routes only return an HTML fragment, rather than a full page. I was able to finish the other half of that issue by creating a helper function in `helpers.py` called `get_template` that looks at whether the request is from an htmx call or direct. Depending on that condition I either return the location of the HTML fragment, or I return the location of a different template that extends my `layout.html` and `{% includes ... %}` the HTML fragment.

### [Alpine.js](https://alpinejs.dev/)

Alpine is the cousin of htmx in a JS-minimal desgin. This framework allowed me to create the interactive parts of the app that are wholly contained client-side. For example, the quick filters I have on the index. Expanding or contracting that "drawer" is all handled by a boolean in alpine's `x-data`, clicking the filter toggles the boolean, and an `x-bind` on the "drawer's" class toggles its state. Using vanilla JavaScript to write that same functionality would have entailed writing a lot of boilerplate code selecting DOM elements and adding eventlisteners.

### The UX

Part of my motivation in bringing this app to Django, is creating those _magic_ experiences that isn't as easily done in an off-the-shelf Mircosoft tool, like InfoPath or Powerapps. One such _magic_ moment is the login. There is none. If the user already has an authenticated Mircosoft cookie in their browser, which will mostly be the case. The user will see a redirect, but then shortly thereafter see the index of Critical Incidents.

Another _magic_ experience is when creating a new incident. When the form is opened, after a short delay the current user's supevisor's information is inserted into the Your Supervisor and Your Supervisor's Email fields. Using Alpine and an API endpoint from my previous CS50 capstone, which houses all agency staff and the agency's current org relationships, I fetch that endpoint with the current user's email address as a query parameter. The API returns the supervisor's name and email in the form. Not only is this a magic moment, it also ensures any emails I send from the app will be valid.

## Drawbacks and Future Concerns

It's been really exciting working with htmx and alpine, but I can see how something like this wouldn't scale very well. Working as an independent developer it's awesome to have a front end framework that doesn't need it's own build. But on a team, a front-end so tightly coupled to the back-end wouldn't scale. Unless individual developers are working within different Django apps, there'll be too much overlapping work.

Similar to the trade-off between size and efficency in algorithms, it seems like this Django-htmx tech stack's saving's on complexity and overhead is negated by its ability to scale. But since I'm not in the business of scaling, that doesn't apply to this application and I find it to be a sweet spot for use.

Longer-term I am a little worried about maintaining this codebase. Because there's so much logic in the templates themselves, I think it would be pretty easy to miss a 'setting.' For example, I often show or hide the subnav, depending on what's being displayed on the page, e.g. it's not need when creating a new incident. This is achieved with an alpine attribute `x-data`. Within `x-data` is a boolean key called `showNav`. Everytime someone's clicks a button to a page that shouldn't show the subnav, like a new incident page, I added the following attribute to the button `@click="showNav = false"`. That updates the `x-data` and the subnav is no longer displayed because it has the alpine attribute `x-show="showNav"`. It only shows when `showNav` is true. To handle those sorts of cases I plan to add end to end tests with Selenium.
