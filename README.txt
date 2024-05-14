1. I used Python and React JS  to implement a few pages of a Video streaming service that allows users to search movies and TV shows. 
2. Here is the directory structure: -
	videos-
		|-videosprj	
			|-vidosprj
				|-setting.py
				|-urls.py
			|-videosapp
				|-admin.py
				|-apps.py
				|-models.py
				|-views.py
				|-urls.py
			|-db
		|-videosui
			|-node_modules
			|-public
			   -img1.jpg
			   -img2.jpg 		
			|-src
			   |-App.js
			   |-index.js
			   |-	interceptors
					|-axios.js
			   |-component	
					|-apiClient.js
					|-like.js
					|-login.js
					|-logout.js
					|-mylistentry.js
					|-navigation.js
					|-userRegistration.js
					|-useVideos.js
					|-Video.js
					|-videoitem.js
					|-videos.js	
					
			
Description: -
1. videosprj is the Django backend project.

 The following Python packages are used: 
 - The Django REST framework (DRF) package is used to create the API.
 - The Django REST framework simple JWT gives the ability to generate the JWT Token.
 - The Django CORS headers package is used to avoid CORS related issues.

2. videosprj/setting.py
  - Registered application name videosapp, DRF, DRF simple JWT and CORS in INSTALLED_APPS	
  - Set the CORS_ORIGIN_ALLOW_ALL = True
  - Added corsheaders.middleware.CorsMiddleware in MIDDLEWARE to avoid the CORS related issue.
  - Added the authentication JWT Class in REST_FRAMEWORK
  - Added the SIMPLE_JWT token configurations to implement access/refresh logic.

3. videosprj/urls.py
  - 	create the URL for access token and refresh token in videosprj/urls.py file
	path('token/', 
          jwt_views.TokenObtainPairView.as_view(), 
          name ='token_obtain_pair'),
    	path('token/refresh/', 
          jwt_views.TokenRefreshView.as_view(), 
          name ='token_refresh')

4. videosapp/admin.py
  -	Register my models here: User, Video, Mylist, Like
5. videosapp/apps.py
  - 	register app name 'videosapp'
6. videosapp/models.py
  - Create my models: 
	- User: stores users (Users can have either a VIEWER Role or VIDEO_ADMIN role).
	- Video: stores videos data (title, description, cast, director, image, release date, timestamp, modified timestamp, saved By, genre choice[Action, Animation, Comedy, Drama, Romance, SciFi, UnSpecified ], media choice[Movie, TV show])
		- There is a Unique constraint on the video title.
	- Mylist: A User can add/ remove movies to/ from his/ her list for later viewing. 
	- Like: A user can Like or Unlike a Video.
7. videosapp/views.py
	- Created my views: -
		- User Registration
		- Logout
		- Fetch Videos 
			- All Videos, 
			- Videos from My List, 
			- Search title, description, cast, director, and genre fields to match the text.
			- Use Django pagination to return results.
			- Sort by titles or release dates in ascending or descending order.
		- Create Video: Only Authenticated Admin User can create a new video.
		- Edit Video: Only Authenticated Admin User can edit an existing video. 
		- Add to MyList: When browsing movies, signed-in users should be able to click a button to add/ remove the movie to/ from User’s watch list.
		- Like: Signed-in Users should be able to click a button on any video to toggle whether they “like” that video. 

8.  videosapp/urls.py
	- Created urls for the views. Register videosapp/urls.py in videosprj/urls.py.

9. videosprj/db.sqlite3
	- Used sqlite3 for this project.

10. videosui is the React JS frontend project.

11. videosui/node_modules folder stores React dependency libraries.

12. videosui/public folder: I added two images img1.jpg and img2.jpg, to use as images for videos.

13. videousui/src/component/navigations.js: Write the code for the navigation bar.

14. videosui/src/app.js: Define application routes.

15. videosui/src/component/login.js: Write the code for login functionality. We have written the axios post method to fetch the access token and refresh token, store these tokens in local storage and navigate to the home page.

16. videosui/src/component/userRegistration.js: Write the code for user registration functionality using Django backend API thru axios.

17. videosui/src/component/videos.js: Write the code to display videos. I used useState, useRef, and useCallback hooks to implement infinite scrolling and used useLocation hook to read query parameters for search text and sorting order.
We used our custom hook useVideos to fetch videos.

18. videosui/src/component/useVideos.js: Create a custom hook to fetch data from Django backend REST API. It will handle loading and error state.

19. videosui/src/component/apiClient.js: Use axios to fetch videos from Django backend REST API.

20. videosui/src/component/video.js: Renders a row for each video item with the Like and Add/ Remove to/ From My List buttons. 

21. videosui/src/component/videoitem.js: Renders video attributes as Readonly for unAuthenticated users. Authenticated Admin users are presented with an editable form to Edit information or add new videos to the catalog.

18. videosui/src/component/like.js: Asynchronously let the server know to update the like count (using axios) and then update the video like count displayed on the page without requiring a reload of the entire page.

19. videosui/src/component/mylistentry.js: Asynchronously let the server know to add/remove the video to the users' watch list (using axios) and then update the status displayed on the page without requiring a reload of the entire page.

20. videosui/src/interceptors/axios.js: Inside our views, we have written an if-else condition to check whether the access token is present or not. If the access token is null in localStorage, we will redirect to the login page otherwise, if we have a token, we will allow the user to access protected pages. After a short time, when our access token expires, we will receive 401 unauthorized error when accessing API. We will use the refresh token API, which will generate the new access token and refresh token. we use the interceptors in react js, which are methods triggered before or after the main method. We use a Response interceptor to execute some code before the response reaches the calling end. We write this code in our axios.js file. Every time a request is made with the axios instance, if we encounter error code 401, we will create the POST request and get the new access token and refresh token and reinitialize the token in localStorage, and send the original request.

21. videosui/src/index.js: Add the interceptor location in our index.js file.

22. videosui/src/component/logout.js: I used the useEffect hook. Whenever we click the logout button, it calls the backend logout API, removes all the tokens from local storage, and navigates to the home page.



		
