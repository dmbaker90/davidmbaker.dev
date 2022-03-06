---
layout: post
author: David
tags: jekyll code
title: "Jekyll: Uncaught SyntaxError: unexpected token: identifier"
description: "How to fix Jekyll unexpected token: identifyer"
---

If you encounter this in Jekyll where a blog post seemingly is not working when clicking on it, it might be because you have an apostraphe in the file name, like this:

~~~ python
_posts
    ...
    2021-12-11-Books-I've-Read-In-2021.md
    ...
~~~

Change it to something like this:

~~~ python
_posts
    ...
    2021-12-11-Books-Ive-Read-In-2021.md
    ...
~~~

Then in your actual Post, use override the title in the front matter:

~~~ python
---
layout: post
author: David
tags: books
title: "Books I've Read in 2021"
---
~~~
