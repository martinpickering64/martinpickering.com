---
title: "A quickie introduction to Git"
date: 2018-01-04T10:49:19Z
draft: false
summary: "Git's terminology and the like"
categories: "Software"
tags: ["Git", "Git Basics"]

---
*This Post is part of a series about Git, Git concepts, commands and usage patterns 
to remind me and to help me learn. The first post of the series is [Git - A New Years Resolution](../introduction).*

Even though Git's user interface appears fairly similar to other VCSs, Git 
stores and thinks about information in a very different way, and understanding 
these differences will help you avoid becoming confused while using it.

## Snapshots, Not Differences

The major difference between Git and any other VCS is the way Git thinks about 
its data. Conceptually, most other systems store information as a list of file-based 
changes. These other systems think of the information they store as a set of files 
and the changes made to each file over time; commonly described as delta-based version control.

Git doesn't think of or store its data this way. Instead, Git thinks of its data 
more like a series of snapshots of a miniature file system. With Git, every time 
you commit (save the state of your project), Git takes a picture of what all your 
files look like at that moment and stores a reference to that snapshot. To be efficient, 
if files have not changed, Git doesn't store the file again, just a link to the previous 
identical file it has already stored. Git thinks about its data as a stream of snapshots.

## Nearly Every Operation Is Local

Most operations in Git need only local files and resources to operate; generally 
no information is needed from another computer on your network. Because you have 
the entire history of the project right there on your local disk, most operations 
seem almost instantaneous.

For example, to browse the history of the project, Git doesn't need to go out to 
the server to get the history and display it for you; it simply reads it directly 
from your local database. This means you see the project history almost instantly. 
If you want to see the changes introduced between the current version of a file and 
the file a month ago, Git can look up the file a month ago and do a local difference 
calculation, instead of having to either ask a remote server to do it or pull an older 
version of the file from the remote server to do it locally.

This also means that there is very little you can't do if you're offline. If you get 
on an airplane or a train and want to do a little work, you can commit happily 
(to your local copy) until you get to a network connection to upload. This may not 
seem like a huge deal, but you may be surprised what a big difference it can make.

## Git Generally Only Adds Data

When you do actions in Git, nearly all of them simply add data to the Git database. It 
is hard to get Git to do anything that is not undoable or to make it erase data in 
any way. As with any VCS, you can lose or mess up changes you haven't committed yet, 
but after you commit a snapshot into Git, it is very difficult to lose, especially if 
you regularly push your database to another repository.

## The Three State Hegemony

_Here is the main thing to remember about Git..._

Git has three main states that your files can reside in: 

1.	Committed: data is safely stored in your local database
2.	Modified: you have changed a file but you have yet to commit to your database
3.	Staged: you have marked a modified file in its current version to go into your next commit snapshot

This leads us to the three main sections of a Git project: the Git directory, the 
Working Tree, and the Staging Area.

The Git directory is where Git stores the metadata and object database for your 
project. This is the most important part of Git, and it is all that is copied when 
you clone a repository from another computer.

The Working Tree is a single checkout of one version of the project. These files 
are pulled out of the compressed database in the Git directory and placed on disk 
for you to use or modify.

The Staging Area is a file (generally contained in your Git directory) that stores 
information about what will go into your next commit. Its technical name in Git 
parlance is the "_index_", but the phrase "_staging area_" is also commonly used.

The basic Git workflow goes something like this:

1.	You modify files in your Working Tree
2.	You selectively stage just those changes you want to be part of your next commit, 
    which adds only those changes to the Staging Area
3.	You do a commit, which takes the files as they are in the Staging Area and 
    stores that snapshot permanently to your Git directory.

If a particular version of a file is in the Git directory, it's considered as 
being committed. If it has been modified and was added to the Staging Area, it 
is staged. If it was changed since it was checked out (a working copy retrieved 
from the Git directory) but has not been staged, then it is modified.

## The Command Line

Git is and was originally a Command Line Tool. All of Git's many operations are 
accomplished using the Command Line Tool.

There are many and various alternate Git Tools and in particular GUI-based Git 
Tools. Many of the GUI's are very good and help considerably to use and 
visualise Git operations. However, it is only the Command Line Tool that can 
accomplish all operations as all alternate tools possess only partial support of Git.

If you know how to run and use the command-line version, you can probably also 
figure out how to use a GUI version, while the opposite is not necessarily true. 
Also, while your choice of graphical client can be a matter of personal taste, 
all users will have the command-line tools installed and available. Additionally, 
the command line tool is the same regardless of the host operating system.
