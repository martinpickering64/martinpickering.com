---
title: "Viewing the commit history"
date: 2018-01-06T16:49:19Z
summary: "What has happened here then?"
draft: false
categories: "Software"
tags: ["Git", "Git Basics"]

---
*This Post is part of a series about Git, Git concepts, commands and usage patterns 
to remind me and to help me learn. The first post of the series is [Git - A New Years Resolution](../introduction).*

After you have created several commits, or if you have cloned a repository with an 
existing commit history, you'll probably want to look back to see what has happened. 
The most basic and powerful tool to do this is the `git log` command.

When you run `git log` in your project, you should get output that looks something like this:
 
{{<highlight bash>}}
$ git log
commit ca82a6dff817ec66f44342007202690a93763949
Author: Martin Pickering <martin.pickering@maginus.com>
Date:   Mon Mar 17 21:52:11 2008 -0700

    changed the version number

commit 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
Author: Martin Pickering <martin.pickering@maginus.com>
Date:   Sat Mar 15 16:40:33 2008 -0700

    removed unnecessary test

commit a11bef06a3f659402fe7563abf99ad00de2209e6
Author: Martin Pickering <martin.pickering@maginus.com>
Date:   Sat Mar 15 10:31:28 2008 -0700

    first commit
{{</highlight>}}

By default (i.e. with no arguments), `git log` lists the commits made in that repository in 
reverse chronological order. There are huge number and variety of options to the `git log` 
command available to show you exactly what you're looking for.
