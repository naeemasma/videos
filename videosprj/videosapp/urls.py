from django.urls import path
from . import views
urlpatterns = [
     # API Routes
     path('isadmin/', views.IsAdminUser.as_view(), name ='isadmin'),
     path('logout/', views.LogoutView.as_view(), name ='logout'),
     path('registration', views.UserRegistration.as_view(), name ='registration'),
     path("videos", views.CreateVideo.as_view(), name="create"),
     path('videolist', views.FetchVideos.as_view(), name ='videolist'),
     path('videos/<str:video_id>', views.ProcessVideo.as_view(), name ='video'),
     path("like", views.SaveLike.as_view(), name="createLike"),  
     path("mylistentry", views.SaveMyListEntry.as_view(), name="addMylist"),  
]