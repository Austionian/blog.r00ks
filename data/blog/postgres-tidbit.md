---
title: Postgres Tidbit
date: '2022-01-25'
tags: ['postgresql', 'sql', 'heroku']
draft: false
layout: PostSimple
summary: "You should never update an app's directly with a SQL statement. (It's an easy way to forget a WHERE clause and update an entire table). But sometimes there's exceptions and sometimes there's neat behavior I've never seen before."
---

A request came in to update an object in an Flask web app I created and maintain. The user wanted the status (which is used to control the state of the object, in this case a position request, for the end user) to be rolled back from **filled** to **posted**. (There was an job offer to a candidate that got rescinded.)

I'm in the process now of making sure this case is handled programatically from the app going forward, but in the short-term I wanted to give the user what she was asking for, so I opened up the Heroku postgresql client:

```bash
heroku pg:psql
```

After making sure I was looking at the correct position request, the update statement was quite simple:
```sql
UPDATE position_requests SET status = "posted" WHERE id = ****;
```

And that was that. Or so I thought.

I opened the position request in the app and where the status is displayed, there was a timestamp. **What the heck?**

I thought about it for a little bit and realized that there is a ```posted``` field in a position request--the datetime that HR marked the position request as posted. The statement above didn't set the ```status``` to **posted**, it set the ```status``` to ```posted```, the timestamp. That's really freaking cool. But not want I wanted. I remembered then too that Postgres expects strings with **'** not **"**.

So here's the correct way to write that previous statement:
```sql
UPDATE position_requests SET status = 'posted' WHERE id = ****;
```

All this reminds me of one fo the first lessons I learned in working on products, you should **never** use SQL directly to modify an app's data. Save that for the app itself. I know the app inside out at this point, so I thought I was safe to make an exception, but I still corrupted the data, albeit for about 1 minute.