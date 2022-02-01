---
layout: post
author: David
tags: DigitalOcean Linux
title: "Locked out of Digital Ocean SSH Firewall?"
---

If you're like me you might've locked yourself out of your DigitalOcean linux droplet by enabling your firewall using `sudo ufw enable` without allowing SSH first.  This means that after you exit the terminal you will no longer be able to SSH into the droplet from either your own terminal or the DigitalOcean console.

You have 2 options now, but first you have to use the DigitalOcean recovery console to turn off the firewall first.  The recovery console works with VNC instead of SSH which is why we can use it while the firewall blocks ssh.

![DigitalOcean](/assets/images/posts/DO.png "DigitalOcean")

And run:

~~~ python
sudo ufw disable
~~~

Now, your 2 options are:
1. Enable SSH on ufw, and re-enable ufw:
~~~ python
sudo ufw allow ssh
sudo ufw enable
~~~
2. Stop using the UFW and start using the DigitalOcean network firewall instead.  This has a few advantages:
    1. Share your firewall settings across multiple droplets.
    2. Misconfigured settings wont lock you out, because you can still edit them in DigitalOcean.
    3. DigitalOcean networks handle the firewall before the traffic even hits your server.  Not sure how much of a difference that really makes but it seems like an advantage anyway.

Hopefully this helps someone.  Obviously this doesn't apply to me since I would never, ever, make this mistake, multiple times.