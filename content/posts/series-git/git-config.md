---
title: "Git Config"
date: 2018-01-04T11:49:19Z
draft: false
summary: "Configuring your Git installation"
categories: ["Software"]
tags: ["Git"]

---
`git config` lets you view and set configuration variables that control all aspects of 
how Git looks and operates. These variables can be stored in three different places:

1.	`/etc/gitconfig` file: Contains values applied to every user on the system and all 
    their repositories. If you pass the option `--system` to git config, it reads and 
    writes from this file specifically. (Because this is a system configuration file, you 
    would need administrative or superuser privilege to make changes to it.)
2.	`~/.gitconfig` or `~/.config/git/config` file: Values specific personally to 
  you, the user. You can make Git read and write to this file specifically by passing the `--global` option.
3.	`config` file in the Git directory (that is, `.git/config`) of whatever 
  repository you're currently using and is specific to that single repository.

Each level overrides values in the previous level, so values in `.git/config` 
trump those in `/etc/gitconfig`.

If you want to check your configuration settings, you can use the `git config --list` command 
to list all the settings Git can find at that point. For example,

{{<highlight bash>}}
git config --list
user.name=Martin Pickering
user.email=martin.pickering@maginus.com
color.status=auto
color.branch=auto
color.interactive=auto
color.diff=auto
...
{{</highlight>}}
  

