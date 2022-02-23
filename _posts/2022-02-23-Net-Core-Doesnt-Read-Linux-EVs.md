---
layout: post
author: David
tags: linux dotnet
title: .NET Core App on Linux Server Does Not Read Environment Variables
---
If you're reading this you might've already tried setting your Environment Variables in `/etc/profile` or `/etc/environment` or possibly `~/.bashrc` and it's still not being picked up in c# by `Environment.GetEnvironmentVariable("API_KEY")` (for example).

If you are running a .Net Core Web Api on Linux under a systemctl daemon service, you have to store the Environment Variable on the service settings you set up:

~~~ps
cd /etc/systemd/system
sudo nano my-app-name.service
~~~

Notice the last few lines in the config:

~~~ps
[Service]
WorkingDirectory=/var/www/my-app-site
ExecStart=/usr/bin/dotnet /var/www/my-app-site/my-app.dll
Restart=always
RestartSec=10
SyslogIdentifier=my-app
User=www-data
Environment=ASPNETCORE_ENVIRONMENT=Production
Environment=DOTNET_PRINT_TELEMETRY_MESSAGE=false
Environment=API_KEY=my-key-val
~~~

Followed by:

~~~ps
systemctl daemon-reload
sudo systemctl restart my-app-name.service
~~~

`Environment.GetEnvironmentVariable("API_KEY")` should now be returning `my-key-val`