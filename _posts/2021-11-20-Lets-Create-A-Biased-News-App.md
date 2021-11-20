---
layout: post
author: David
tags: code
---

This post is going to cover some of the challenges I faced when making my biased news aggregator [Breaking News Bot](https://www.breakingnewsbot.com).  I will probably make a follow up post about how it was coded.

### Conception
The idea stemmed from the Covid-19 vaccine misinformation problem plaguing the country. Specifically it was the inflammatory and loaded headlines I was noticing on popular right wing news sources.  I thought it would be cool to have a way to see how left and right wing headlines covered certain topics.  Then I thought why not take it to an extreme, have a slider that shows the headlines all the way from extreme left and right news sources compared to more center sources.  The goal would be to make people aware of the spin their favorite news outlets are putting on topics.  This would hopefully be even more apparent with hot button topics.

The design is loosely based on the [New York Times](nytimes.com) and [The Boston Globe](https://www.bostonglobe.com/) with simple headline / images on a white background, trying to resemble print newspaper.

![Title](/assets/images/posts/breaking-news-bot-headline.png "title")

### Data Source
This app was only possible because [Media Bias / Fact Check](https://mediabiasfactcheck.com/) already put in all the hard work of analyzing sites for bias.  Although they don't make their data publicly available I only needed the most popualr news sites. I found the most common news websites for each bias category, looked them up on Media Bias / Fact Check, and saved their bias ranking. Although MB/FC has a nifty left-right arrow system to show the bias, they don't display that number, so I looked them up by hand and dropped each news site into one of my 13 categories.  I had to dive pretty deep through their reviews to find some that fell into the extremes.

MBFC is not perfect.  Consider Christianity Today, their headlines appear pretty far right to me, but their one position of being critical of Trump put's them barely right of center.Another problem I have with MBFC is they have a separate rating system for sites that fall under their Conspiracy / Pseudoscience category.  They call Greenpeace Left-Bias, but it falls under Conspiracy / Pseudoscience for their stance on GMOs and because of that I don't know where to rank them on the scale.  So I either had to rate them myself or exclude them.  To keep my own biases out of the site I decided to exclude them. On the other side, Info Wars is (obviously) categorized as Conspiracy / Pseudoscience as well, however they verbally classify it as Extreme Right so I can still go off that.

The least biased news sources are mostly local sites.  I think this also highlights the problem of local unbiased papers running out of business and the rise of extremist national sites.  Since this is more of a national news app, I didn't think there was much sense in showing the local news results from sites that focus on their communities.  Another tricky thing is knowing if local sites actually cover national news.  NYtimes covers national news, but if I didn't know that how would I know that it wasn't New York only news? Does the Oregonian cover national news? Turns out it doesn't.  Then there's the local sites that do both.  Pittsburgh Post gazette does a lot of international news but also a lot of local.  I think the math changes slightly and now it makes sense to include it.  If the Center, Center-Left and Center-Right are made up of lots of local sources that also cover national news, that may in fact be the most unpartisan way of viewing news headlines when selecting the Center.  So I attempted to include the local sites that cover national news.  But that involved a very unscientific process of visiting the site and looking at the headlines.  Sadly the https://www.kansas.com/ (Wichita Eagle) would've been a valuable Center source according to MB/FC but all their headlines were very specific to Kansas.

### Bias Categories
I elected to go with a 13 point bias system.  0 in the center, -6 at the extreme left, and +6 at the extreme right.  
![Biases](/assets/images/posts/bias-slider.png "biases"){:width="100%"}
This was probalby overkill, as MB/FC itself only has a 7 point system, but I liked the idea of having more granularity.  It did present some problems though.  Some categories had an overwhelming amount of the most common news sources, and others only had few.

### API
In the past I toyed with a tool called [NewsAPI](https://newsapi.org), a headline / news aggregator for developers that was free for open source software.  This time around they seem to have purged all references to their free open source support, and their commercial license is a brutal $450/month.  The Google News API would have worked, but they apparently shut that down years ago.  I did discover the Bing News API though, with a free 1000 api calls per month, so I opted to make this an Azure learning opportunity and set up my Microsoft Azure account with a Bing API resource.

The immediate problem... is that I burned through my 1000 free api calls just while testing.  Every time you move the bias slider it burns an API call, and the purpose of this app was to use it often to compare headlines.  There's no good solution to this, so in my mind I have a few options:
1. Cache the results in a database so I don't burn so many API calls.  This kind of breaks the live news concept and I don't like it.  It also wouldn't work well with a wildcard news search that I have.
2. Become my own news aggregator.  Use RSS feeds to save headlines to my database from the most common news sources and search my own database.  I don't really feel like doing this though to be honest.
3. If this site doesn't get a lot of traffic, just leave it on the Free Tier and use it as a portfolio project on my resume.  Let it break after 1000 calls a month.
4. If this site *does* get a lot of traffic, the $6 / 1000 calls is going to scale poorly and get expensive.  My other option is to monitize it and depending on the volume move it over to the NewsApi $450 / 250,000 api calls a month option.

### Unexpected Things
1. I had to be careful when including some news sites that are actually often aggregators. MSN.com turns out links to a wide range of other new sites, so I had to exclude them or it would break the spirit of the app.
2. I had to spend some time distinguishing news sites from article sites.  Readers Digest is considered right bias, but their articles don't appear to be news.  More like buzzfeed style, 9 ways to ruin your clothes!
3. Where did people pick their sites names from? Whoever called their news site "HumanEvents" is definitely a lizard person covering human news, you're not fooling anyone.
4. CNET and Ars Technica cover a surprising amount of politics and current events, so I felt ok to include them.  Other technical news sites did not.

### Problems
1. What to do with international news?  Who knew that the News International was only about Pakistan? I was going to exclude them all, but instead took a case by case basis if they didn't just cover their country.  FinancialTimes is a UK website but their headlines primarily covered US or global news when I checked, so they are included.  They also provide a much needed Center / Least Biases source.  Similarly, New Zealand herald is basically New Zealand headlines I wasn't familiar with so they are excluded, but Sky News UK was mostly world news, so they're included.
2. There are not equivalent news sites at every bias category.  If you dont talk about politics at all it's easier to stay center, but then the Center bias category ends up with just product reviews and iPhone launches.
3. The Bing News API itself categorizes what is news and what isn't.  It (rightfully in my opinion) unranks extremist fake news.  While this is undoubtably the right thing to do it makes my app idea difficult. I wasn't getting many, if any, resutls at the extremist ends.  You can confirm this on Bing's News homepage as well, filtering the "news" section by Breitbart shows nothing.  Bing doesn't even pretend like that's news: <https://www.bing.com/news/search?q=site%3abreitbart.com>.  My hacky workaround for this was to do a Bing Image search for news in sites like Breitbart.  This gives me an image and a headline, but not a description, which you'll notice in the Far Right section of the bias slider.
4. It's also unclear to me how Bing News ranks results anyway.  Given a list of sites that meet my bias criteria, it may only include results in 2-3 of them.  This is a problem I haven't spent too much time on yet.
5. It would be better to categorize headlines rather than entire news outlets into a bias category.  It feels weird to place news sources with a broad range of political opinion in a single category, but that's the best I could do.

### Conclusion
Overall, this was a fun programming excercise because I thought it was an original idea. While analyzing my sources I did spend a lot of time reading news headlines and articles from pretty obscure and extremest news sites, which was not particularly good for my mental health.  The news out there is psychotic. 

Under normal circumstances I think this app is less effective than I thought it would be.  News sources are just publishing their daily news, and either the spin is in the content of the article or their editorial policy which isn't reflected well in the app. However, with hot button topics I think this app really shines. This was published around the time of the Kyle Rittenhouse verdict, and it's pretty easy to use the app and see the blatant spin and emotional headlines on hot button topics like that one.