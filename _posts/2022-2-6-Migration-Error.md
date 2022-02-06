---
layout: post
author: David
tags: dotnet
title: "Unable to resolve service for type 'Microsoft.EntityFrameworkCore.Storage.TypeMappingSourceDependencies'"
---
~~~c#
Unable to resolve service for type 'Microsoft.EntityFrameworkCore.Storage.TypeMappingSourceDependencies' while attempting to activate 'MySql.EntityFrameworkCore.Storage.Internal.MySQLTypeMappingSource'
~~~

I just had the rare experience of googling a programming error and only getting 1 result, which also happened to be in a foreign language:

![Google](/assets/images/posts/Google1.png "Google"){:width="100%"}

It's especially weird because I'm doing something super basic. I'm creating a new EntityFramework app in .NET 6 and trying to create my first migrations with `dotnet ef migrations add InitialCreate`.

Since it appears to be something related to `MySql.Data.EntityFrameworkCore` I new I had the option of using a different MySQL EF provider with `Pomelo.EntityFrameworkCore.MySql`.  I gave it a shot and it worked.  So if you get this error, try switching to Pomelo.


~~~ python
dotnet remove package MySql.EntityFrameworkCore
dotnet add package Pomelo.EntityFrameworkCore.MySql
~~~

Don't forget to [update your Startup.cs](https://github.com/PomeloFoundation/Pomelo.EntityFrameworkCore.MySql#2-services-configuration).  Then: 


~~~ python
dotnet ef migrations add InitialCreate
~~~

Working!