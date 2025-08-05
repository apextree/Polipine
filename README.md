# Web Development Final Project - *Polipine*

Submitted by: **Anubhav Dhungana**

This web app: **Polipine(Politics + Opine) is a social platform where users can share and discover political opinions from around the world. Users can create "polipions" (political opinions) about politicians, vote on posts, leave comments, and engage in political discussions in a structured, user-friendly environment. Users can also sort posts by upvotes or creation time.**

Time spent: **16** hours spent in total

## Required Features

The following **required** functionality is completed:


- [x] **Web app includes a create form that allows the user to create posts**
  - Form requires users to add a post title
  - Forms should have the *option* for users to add: 
    - additional textual content
    - an image added as an external image URL
- [x] **Web app includes a home feed displaying previously created posts**
  - Web app must include home feed displaying previously created posts
  - By default, each post on the posts feed should show only the post's:
    - creation time
    - title 
    - upvotes count
  - Clicking on a post should direct the user to a new page for the selected post
- [x] **Users can view posts in different ways**
  - Users can sort posts by either:
    -  creation time
    -  upvotes count
  - Users can search for posts by title
- [x] **Users can interact with each post in different ways**
  - The app includes a separate post page for each created post when clicked, where any additional information is shown, including:
    - content
    - image
    - comments
  - Users can leave comments underneath a post on the post page
  - Each post includes an upvote button on the post page. 
    - Each click increases the post's upvotes count by one
    - Users can upvote any post any number of times

- [x] **A post that a user previously created can be edited or deleted from its post pages**
  - After a user creates a new post, they can go back and edit the post
  - A previously created post can be deleted from its post page

The following **optional** features are implemented:


- [x] Web app implements pseudo-authentication
  - Users can only edit and delete posts or delete comments if they are logged in with the same username they used to create the post. Every user must register or log-in with a unique username before using the app. 

The following **additional** features are implemented:

* [x] A switch to toggle between light and dark mode. 
* [x] Users can see all posts created by themselves. 
* [x] Users can sort their own posts by creation time, upvotes count, or number of comments. 

## Video Walkthrough

Here's a walkthrough of implemented user stories:

<img src='src/assets/Final Project Demo GIF.gif' title='Video Walkthrough' width='' alt='Video Walkthrough' />


GIF created with ...  
MacOS Screen Recording Tool.

## Notes
* Working with Supabase can get pretty confusing.
* The login system was pretty tricky. I had to use a context API to manage the user state. 


## License

    Copyright [2025] [Anubhav Dhungana]

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
