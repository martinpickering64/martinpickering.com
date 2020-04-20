---
title: "Switching Branches"
date: 2018-01-11T13:49:19Z
summary: "Working on different stuff at the same time."
draft: false
categories: ["Software"]
tags: ["Git"]

---
To switch to an existing branch, you run the `git checkout` command. 
 
{{<highlight bash>}}
$ git checkout testing
Switched to branch 'testing'
{{</highlight>}}
 
This moves HEAD to point to the tip of the testing branch.
If you were to do another commit:

{{<highlight bash>}}
$ vim test.rb
$ git commit -a -m 'made a change'
{{</highlight>}}
 
The HEAD moves forward when the commit is made.

{{<figure src="../figure-2.jpg" caption="The HEAD branch moves forward when a commit is made.">}} 

Now the testing branch has moved forward, but the master branch still points to the 
commit it was on when git checkout was used to switch branches. 

If git checkout was run again to switch back to the master branch then two things would occur:

1.	The HEAD pointer is moved back to point to the master branch
2.	The files in your working directory are reverted back to the snapshot that master points to

This also means the changes you make from this point forward will diverge from an older version of 
the project. It essentially rewinds  the work you’ve done in your testing branch so you can go in a 
different direction.

Because a branch in Git is actually a simple file that contains the 40 character SHA-1 checksum of 
the commit it points to, branches are cheap to create and destroy. Creating a new branch is as quick 
and simple as writing 41 bytes to a file (40 characters and a newline).

This is in sharp contrast to the way most other VCS tools branch, which involves copying all of 
the project's files into a second directory. This can take several seconds or even minutes, depending 
on the size of the project, whereas in Git the process is always instantaneous. Also, because we're 
recording the parents when we commit, finding a proper merge base for merging is automatically done 
for us and is generally very easy to do. These features help encourage developers to create and use 
branches often.
