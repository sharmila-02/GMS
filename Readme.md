A GMS web application was also developed which receives the information about the level
of the garbage from different bins and then displays the Fill, weight and Bin ID as a marker
on the map in a graphical manner.

![GMS Web app Admin login](/images/gms.png)

![GMS web app showing the shortest garbage collection route](/images/gms2.png)

On the map, the red markers represent bins with fill level 80% or more, the orange markers represent
bins with fill level between 60% and 80% and the blue markers represent bins with fill level below
40%. The green markers indicate the base garbage collection center and dumping points.

The different features and facilities provided by GMS web app are:
1. Shortest route: This feature provides the GMS admin a shortest real-time path on the map
that a garbage collection vehicle can take to collect the most filled bins (here above 80%)
as shown in Fig. 5.7. Leaflet routing machine is internally used to get this path. The
routing function internally used Dijkstra algorithm to calculate the shortest path. The
algorithm actually takes into account, factors like traffic, truck route etc.

2. Add bin: The admin can add new dustbins on the map without going to the database and
changing the structure of it. This feature actually opens a form upon clicking that can be
used to fill in Bin ID, latitude, longitude and also approx. Fill, approx. weight (which can
be changed later). This way a new dynamic marker can be added to the map to display
garbage level and weight conveniently.

3. Admin login: To have a safe access to online network system. Also assists the admin
operator in assigning tasks to workers.

![Add bin form on GMS web app](/images/gms2.png)

The GMS Web app was hosted on ‘Netlify’ and can be accessed by the link below:

[https://gms-app-nitc.netlify.app](https://gms-app-nitc.netlify.app)

Upon clicking the link above the ‘index.html’ file loads and we see an admin login page. Then
after login page we see a map interface which internally is ‘gms.html’ file. Then for different
features of the GMS web app, ‘interface.js’ is used for backend logic execution. Leaflet JavaScript
library provides inbuilt functions which are used in different feature execution codes.
