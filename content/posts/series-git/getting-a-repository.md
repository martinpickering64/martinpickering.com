---
title: "Getting a Git Repository"
date: 2018-01-04T13:49:19Z
summary: "Intialising and cloning..."
draft: false
categories: "Software"
tags: ["Git", "Git Basics"]

---
*This Post is part of a series about Git, Git concepts, commands and usage patterns 
to remind me and to help me learn. The first post of the series is [Git - A New Years Resolution](../introduction).*

You typically obtain a Git repository in one of two ways:

1.	You can take a local directory that is currently not under version control, and 
  turn it into a Git repository, or
2.	You can clone an existing Git repository from elsewhere.

In either case, you end up with a Git repository on your local machine, ready for work.

## Initializing a Repository in an Existing Directory

If you have a project directory that is currently not under version control and you want 
to start controlling it with Git, you first need to go to that project's directory and 
then invoke the `git init` command:

{{<highlight bash>}}
$ git init
{{</highlight>}}
 
This creates a new subdirectory named .git that contains all of your necessary repository 
files; known as a Git repository skeleton. At this point, nothing in your project is tracked yet. 

If you want to start version-controlling any existing files, you should probably begin 
tracking those files and do an initial commit. You can accomplish that with a few `git 
add` commands that specify the files you want to track, followed by a `git commit`:

{{<highlight bash>}}
$ git add *.cs
$ git add readme.md
$ git commit -m 'initial project version'
{{</highlight>}}
 
At this point, you have a Git repository with tracked files and an initial commit.

## Cloning an Existing Repository

If you want to get a copy of an existing Git repository (for example, a project you'd 
like to contribute to), the command you need is `git clone`. 

Note: Unlike TFS or Subversion, the command is "clone" and not "checkout". This is 
an important distinction. Instead of getting just a working copy, Git receives a full 
copy of all data that the server has. Every version of every file for the history of the 
project is pulled down by default when you run git clone. In fact, if your server disk 
gets corrupted, you can often use any of the clones on any client to set the server back 
to the state it was in when it was cloned (you may lose some server-side hooks and configuration, 
but all the versioned data would be there).

You clone a repository with `git clone <url>`. For example, if you want to clone the Git 
linkable library called someLibrary, you can do so like this:
 
{{<highlight bash>}}
$ git clone https://github.com/someLibrary/someLibrary
{{</highlight>}}

The above command creates a directory named `someLibrary`, initializes a `.git` directory 
inside it, pulls down all the data for that repository, and checks out a working copy 
of the latest version. If you go into the new `someLibrary` directory that was just created, 
you'll see the project files in there, ready to be worked on or used.
