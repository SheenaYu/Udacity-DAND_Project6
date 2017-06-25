# Make Effective Data Visualization (D3.js)

by Shui(Sheena) Yu, in fulfillment of Udacity Data Analyst Nanodegree

* * *

### Summary
This is an interactive visualization displaying terrorist attacks in US from 1970 to 2015. It contains two tabs. The first tab 
includes a map that shows the geographic locations and detailed information of terrorist attacks across United States 
from 1970 to 2015. The second tab includes a time series line chart which tells audience about the trend of terrorist 
attacks by state.

**Main findings:** 

1. Terrorist attacks were concentrated in coastal states, especially in California and New York.

2. Terrorist attacks decreased drastically after 1970s. However, the most severe attacks happened in New York on Sep. 11th, 2001.

Please click this [link](http://cdn.rawgit.com/SheenaYu/Udacity-DAND_Project6/06370465/index.html) to view the visualization.
 
### Design

##### Exploratory Data Analysis (R)

I downloaded the data from [Kaggle - Global Terrorism Database](https://www.kaggle.com/START-UMD/gtd). 

`terrorism_usa.csv`: I cleaned the whole dataset and filtered for only US data. The features I selected include Date, State, City, Attack Type, Weapon, Group, Number of 
Killings and Injuries, Longitude, Latitude and the Summary of the attack. 

`time_series_by_state.csv`: I summarized the first dataset and calculated the number of terrorist attacks per state and per year.

##### Visualization (D3.js)

At first, I created an interactive animated US map with circles on it. Each circle represents an terrorist attack event, the larger
 the circle, the more casualities the attack caused. As you noticed, there are some circles colored as orange and some colored as 
 blue. The orange circles represent the terrorist attacks that resulted in at least one fatality, while the blue circles are 
 attacks that only resulted in injuries. Audience can click the play button next to the slider to view the animation, which vividly shows the 
 geographical locations of terrorist attacks across the US. 
 
After collecting feedback from Udacity forum, I added a time series line chart to tell a data story: the number of terrorist 
attacks decreased dramatically since 1970. California and New York have the most terrorist attacks in total. Audience can select 
the states they are interested in and compare number of attacks in different states from 1970 to 2015. When audience hover 
over the line chart, a detailed number will be shown next to each state legend.

### Feedback

I gathered feedback from 3 different people by asking them a few relevant questions, the following are the feedback I get:

##### Interview #1

> This is a very cool viz. The animation on a map guarantees additional work. A potential improvement opportunity is 
to make it easier to generate insights from the viz. Since we have large geographical area, also a long timeframe, 
it's kind of hard to remember things when the animation goes through, as a result, the reader may not be able to get 
the idea you want to communicate. However, if it's purely a visualization for exploration, then this may not be big concern. 
One way to improve is to provide an option to select a city and show the relevant info about that city on the side, for example, make a time series plot of terrorist attacks.

##### Interview #2

> Very nice visualization. One thing I can notice is that you don't create a story. I mean, there isn't a way to answer those 4 questions. 
I would suggest to edit it or add another plot on the side that would help to create a story. For example a cumulative sum 
of the attacks (or victims). Maybe even better per State, West/South or another geographic entity. 
This way you will create a story out of your data. Nice work.

##### Interview #3

> The animated map is so cool! I can notice some trends by viewing the animation. There are more terrorist attacks along the eastern 
and western coast. After 2001, there is a big decrease in terrorist attacks in US, probably due to the US government taking actions 
to fight terrorism. The time series chart aggregates the data by state. The new insights I get is that California and New York 
are big targets of terrorism, but in recent years there is fewer terrorist activities in the US. 

##### Interview #4

> A few suggestions on how to make it more explanatory: Summarize the story in one or more sentences. That can be done in the title, for example, or in a short introduction that gives the reader some context to what she/he should be looking for in the visualization. Highlight or draw attention to the parts of the visualization that reinforce the story.
Use the initial animation you've already coded to lead the user to the main point you want to convey, a structure known as a martini glass structure visualization.


##### Post-feedback Design

I redesigned the visualization and combined the animated map and time series line chart in two different tabs. Audience can 
toggle between two graphs by clicking different tabs. 

I also summarized the findings in the titles of charts, and added tooltips to better guide viewers through the visualization.

### Resources

[Kaggle - Global Terrorism Database](https://www.kaggle.com/START-UMD/gtd)

[Terrorist Attacks in United States by Abigail](https://www.kaggle.com/abigaillarion/terrorist-attacks-in-united-states)

[d3.js Multi-series line chart interactive](http://bl.ocks.org/DStruths/9c042e3a6b66048b5bd4)

[Load graphs in different tabs](http://bl.ocks.org/widged/4561185)

[DashingD3.js Lessons](https://www.dashingd3js.com/lessons/)

[Category Color Generator](http://jnnnnn.github.io/category-colors-constrained.html)

[Chroniton Slider by Kshitij Aranke](https://github.com/arankek/chroniton)







