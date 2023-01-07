---
categories: "Software"
date: 2022-01-04T00:00:00Z
description: "What stuff is involved in creating and maintaining this website?"
images: []
summary: "What is this website made up of?"
tags: ["Website"]
title: "What makes up this website"

---
This website is, _what I believe is known as_, a static website. In that it has no active content generated on demand by some back-end service.

I have made use of [HUGO](https://gohugo.io/) to assist in the creation and management of the websites content. [HUGO](https://gohugo.io/about/what-is-hugo/) is a popular open-source static site generator and uses a combination of its own CLI, Markdown and GO to achieve its objective. 

I have also made use of an MIT Licensed Theme for HUGO called [hugo-theme-diary](https://github.com/AmazingRise/hugo-theme-diary/). I am very grateful to [AmazingRise](https://github.com/AmazingRise), the publisher of this theme.

The site's resources are version controlled via a [GitHub Repository](https://github.com/). I can edit any of the site's resources or create new resources directly using the simplest of text editors etc and the [GIT CLI](https://git-scm.com/book/en/v2/Getting-Started-The-Command-Line). Or (_as I more normally do_), I can use the HUGO-aware CMS from [forestry.io](https://forestry.io/). It provides me with a [WCMS](https://en.wikipedia.org/wiki/Web_content_management_system) style experience whilst I am maintaining my website's content. [forestry.io's GIT-backed CMS](https://forestry.io/docs/welcome/) is a great tool and supports the HUGO, Jekyll and Gatsby frameworks.

[CircleCI's continuous integration/continuous deployment services]() are press-ganged to build, test and deploy the website whenever the GIT Repository's default branch is updated.

[Google Cloud Firebase](https://firebase.google.com/) is the current host environment along with a [CloudFlare](https://www.cloudflare.com/) frontage.