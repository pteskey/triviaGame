# <div align=center>Trivia Challenge</div>

Hello and welcome to the repository for my first project at InceptionU.

## Install Instructions

npm install instructions to be added...

## Process

I decided to make a trivia game in order to challenge myself in a few different aspects. My first challenge was to implement the question-and-answer data via API using async functions to fetch data from a public trivia API.

My next challenge was to generate the questions dynamically using JavaScript template literals. From there I needed to figure out the logic to check the selected answers against the fetched data and provide a visual representation whether the answer was correct or not. My initial implementation tackled SOME of the problems but it did not lock out the answering process. I initially tried several solutions from searching and ended up querying Chat GPT for a solution. This was my first-time using Chat GPT for coding solutions and I was impressed by the speed and ease I was able to find a solution.

Database is now set up to store some simple data each time a question is answered. For every answered question it logs whether it was correct or not, the difficulty and the category of the question.

Next step is to take this data and plot it with Chart.JS
