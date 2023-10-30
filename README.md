# Sheepish

## Instructions
Corral the sheep by saying the word attached to the sheep using the correct emotion. Try not to let them get past you!

## To Run
1. To install packages: `npm i`
2. Add `env.json` into the public/ folder
3. Inside, put `{ "REACT_APP_API_KEY": "INSERT API KEY HERE" }` for your Hume API key
4. To run: `npm run dev`

## What we used
* Hume AI's Streaming API
* [Figma](https://www.figma.com/file/asSSTwPf4GYvF0mRqExL8Q/Untitled?type=design&node-id=1%3A3&mode=design&t=6BNs0l9W3MSOvZyq-1)

* ## Inspiration
“In [voice-over acting], you can’t avoid having to spend money to make money," says [name] from Chicago Magazine, an aspiring voice actor who took many courses, made a demo, and auditioned, only to be rejected because “they thought I needed to take more classes.” [(Chicago Mag)](https://www.chicagomag.com/chicago-magazine/september-2023/everyone-tells-me-i-have-a-great-voice/) Voice acting is a profession that requires years of practice, training, and money. We conducted our own UX research to determine the largest barriers of entry for voice actors. Unsurprisingly, cost is the main reason why amateurs are unable to advance their careers. One participant explained: "When I did research ~2 years ago, someone was charging $50 an hour for one-on-one lessons, and I heard that was a cheap rate." Another participant revealed they have also invested for their career by paying thousands for private lessons to get started. With years of training to hone their skills, voice actors have to spend high amounts of money just to get started. 

## What it does
![in-game](https://media.discordapp.net/attachments/1163910236801863993/1168265851611394064/image.png?ex=6551235c&is=653eae5c&hm=e8e49bc3fd53d621e2f160dadf08916d3680a6820b031c92c63bccac445f0e97&=&width=983&height=662)
Sheepish is a web-based game to help voice actors gamify practicing reading lines. The player is a shepherd who needs to herd all of their colorful sheep. The colors of the sheep correspond to different emotions; white for happy, blue for sad, and red for angry. By listening to the player’s emotions in their speech (also known as speech prosody), sheep are successfully corralled when the user says the phrase with the correct emotion. 

## How we built it
![Sheepish logo iterations](https://media.discordapp.net/attachments/1163910236801863993/1168245306719215666/Group_33.png?ex=6551103a&is=653e9b3a&hm=475a60c5406d98d4c070bfd094911536f262ffdb1be85b2b62bba48d00198ede&=&width=1073&height=662)
We solidified our understanding of Hume AI’s models to predict the player’s emotions in their voice. Once we set up Hume’s Streaming API in Typescript, Sheepish was able to “hear” our speech prosody. After, we set up a speech recognition web API to create a transcription of the player’s words. At the same time, we were creating React components with our assets to visually make the game. Our code checks if the sheep’s emotion matches with the player’s emotions as well as if the sheep’s prompt matches with the words said by the player. Finally, we tied these pieces all together in Typescript and CSS, and Sheepish was finally born!

## Challenges we ran into
As we looked further into Hume’s APIs, we found that our game could be written with either the Batch or Streaming API. After some initial confusion, and asking one of Hume’s engineers, we decided to solely use the Streaming API. Although this option had less documentation to go off of, we were able to output speech prosodies for various phrases that were spoken with different emotions. While using Hume’s API, we were also confused on the separation between language and speech prosody. 

## Accomplishments that we're proud of
This was our team’s first ever game in React. There was a high learning curve but creating a working application with our main features was a huge milestone for us. We were also able to make something really cool that works with AI voice recognition and prosody recognition, fields none of us have touched upon before. When we were able to finally fetch the list of emotions coming back from our soundbite and showing in our website, there was a sense of excitement that we had created something new. 

## What we learned
The majority of our team had little prior knowledge of Typescript and React, but we were able to learn as we went! It was a great learning experience: not only as 2 of our members’ first ever hackathon but also being able to learn new languages and frameworks in such a short time. It was also fun to develop our app with an API we hadn’t used before and see the results of voice emotion processing in action. 

## What's next for Sheepish
We hope to expand Sheepish in 3 main ways: add a database, create more levels, and add more animations on the front-end side. By adding a database we can allow for storage between gameplay. We would want this to display a user’s all-time high scores and progress. More levels would allow for more variety and complexity in emotion. Our first level currently allows for happy, sad, and angry intonations, but we plan to add ones such as envy and boredom. Lastly, adding more styling for some of our components would give our game a cleaner look, tying everything together to match our UI/UX design.
