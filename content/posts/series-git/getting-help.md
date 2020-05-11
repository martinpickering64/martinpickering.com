---
title: "Getting help for Git commands"
date: 2018-01-04T12:49:19Z
summary: "RTFM!"
draft: false
categories: "Software"
tags: ["Git", "Git Basics"]

---
*This Post is part of a series about Git, Git concepts, commands and usage patterns 
to remind me and to help me learn. The first post of the series is [Git - A New Years Resolution](../introduction).*

If you ever need help while using Git, there are two, equivalent ways to get the 
comprehensive manual page help for any of the Git commands:

{{<highlight bash>}}
$ git help <verb>
$ man git-<verb>
{{</highlight>}}
 
For example, you can get the manual page help for the `git config` command by running
 
{{<highlight bash>}}
$ git help config
{{</highlight>}}