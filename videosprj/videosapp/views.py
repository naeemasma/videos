from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import JsonResponse
from django.shortcuts import HttpResponse, HttpResponseRedirect, render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator
from .models import User
from .models import Video
from .models import Like
from .models import Mylist
# Create your views here.

class CreateVideo(APIView):   
   permission_classes = (IsAuthenticated, )

   # Authenticated Admin users can add new video to the catalog using Post method.
   def post(self, request):
   
    if(request.user.role != User.VIDEO_ADMIN):
        return JsonResponse({"error": "Save Video Operation is Not \
                             Permitted"}, status=200)
    
    # Check request parameters
    data = json.loads(request.body)
        
    # Get contents of video
    title = data.get("title", "")
    desc = data.get("desc", "")
    cast = data.get("cast", "")
    director = data.get("director", "") 
    imag = data.get("imag", "") 
    release_dt = data.get("releaseDt", "") 
    media_typ = data.get("mediaTyp", "") 
    genre = data.get("genre", "")         

    # Create video
    video = Video(        
        title=title,
        desc = desc,
        cast = cast,
        director = director,
        imag = imag,
        media_typ = media_typ,
        genre = genre,
        release_dt = release_dt,
        saved_by=request.user
    )
    
    # Attempt to Save video
    try:
        video.save()               
    except IntegrityError:
        return JsonResponse({
        "error": "Title '" + video.title + "' already exists"
        }, status=200)
    except:
        return JsonResponse({
        "error": "Error saving Video"
        }, status=200)    
    return JsonResponse({"message": "Video successfully saved"}, status=201) 


class FetchVideos(APIView):
   
   # Fetch Videos     
   def get(self, request):

    # Request parameters
    # page number and size for pagination 
    pg = request.GET["p"]
    pg_size = request.GET["s"]

    # current user 
    cur_usr = None
    if(request.GET.get('c') and len(request.GET.get('c'))>0):
        cur_usr = User.objects.get(username=request.GET.get('c'))

    # Filter criteria if any 
    filter = None
    if(request.GET.get('f') and len(request.GET.get('f'))>0 
       and request.GET.get('f') != 'null' and request.GET.get('f') != 'undefined'):
        filter = request.GET.get('f')

    # Sort Order choices
    sort = ["-release_dt", "release_dt", "title", "-title"]
    sort_mylist = ["-video__release_dt", "video__release_dt", 
                   "video__title", "-video__title"]
    
    # Return videos in reverse chronologial order of release date by default 
    sort_i = 0
    if(request.GET.get('o') and len(request.GET.get('o'))>0 and request.GET.get('o') != 'null'):
        sort_i=int(request.GET.get('o'))  
          
    if(filter):
        # Filter - Displays current user MyList videos
        if(filter == 'mylist'):
            mylist = Mylist.objects.filter(viewer=cur_usr, 
                active=True).order_by(sort_mylist[sort_i])
            videos = []
            if(mylist):
                for myliste in mylist: 
                    videos.append(myliste.video)

        # Display all the videos where the title, description, cast, 
        # director, or genre match the criteria.            
        else:
            videos = (Video.objects.filter(title__icontains=filter)
                      | Video.objects.filter(desc__icontains=filter)
                      | Video.objects.filter(cast__icontains=filter)
                      | Video.objects.filter(director__icontains=filter)
                      | Video.objects.filter(genre__icontains=filter)
                      ).order_by(sort[sort_i])
    else: 
        # All videos 
        videos = Video.objects.all().order_by(sort[sort_i])

    videolist = []
    # pagination    
    
    if(videos):
        p = Paginator(videos, pg_size)
        if(int(pg) <= p.num_pages):

            # Each video's Likes count, Like of current user, 
            # and MyList entry of current user
            for video in p.page(pg).object_list:
                video.media_desc = video.get_media_typ_display()
                video.genre_desc = video.get_genre_display()
                video.likes = Like.objects.filter(video=video, like=True).count()
                if(cur_usr):
                    video.cur_usr_like = Like.objects.filter(video=video, 
                                        reaction_by=cur_usr, like=True).count()
                    video.cur_usr_lst_e = Mylist.objects.filter(video=video, 
                                        viewer=cur_usr, active=True).count()
                else:
                    video.cur_usr_like = 0
                    video.cur_usr_lst_e = 0     
                videolist.append(serializeVideo(video))
    print(videolist)
    return JsonResponse(videolist, safe=False)


class ProcessVideo(APIView):   
   permission_classes = (IsAuthenticated, )

   def get(self, request, video_id):
   # Query for requested video

    try:
        video = Video.objects.get(pk=video_id)
    except Video.DoesNotExist:
        return JsonResponse({"error": "Video not found."}, status=404)    
    return JsonResponse(video.serialize(), safe=False)


   def put(self, request, video_id): 
    # Authenticated Admin users can edit video information via PUT method

    if(request.user.role != User.VIDEO_ADMIN):
        return JsonResponse({"error": "Save Video Operation is Not " \
                             "Permitted"}, status=200)
    
    try:        
        video = Video.objects.get(pk=video_id)
    except Video.DoesNotExist:
        return JsonResponse({"error": "Video not found."}, status=404)
     
    # Attempt to update video    
    try:
        data = json.loads(request.body)
        if data.get("title") is not None:
            video.title = data["title"]
        if data.get("desc") is not None:
            video.description = data["desc"]
        if data.get("cast") is not None:
            video.cast = data["cast"]
        if data.get("director") is not None:
            video.director = data["director"]
        if data.get("imag") is not None:
            video.imag = data["imag"]
        if data.get("genre") is not None:
            video.genre = data["genre"]
        if data.get("mediaTyp") is not None:
            video.media_typ = data["mediaTyp"]
        if data.get("releaseDt") is not None:
            video.release_dt = data["releaseDt"]    
        video.save()               
    except IntegrityError:
        return JsonResponse({
        "error": "Title '" + video.title + "' already exists"
        }, status=200)
    except:
        return JsonResponse({
        "error": "Error saving Video"
        }, status=200)    
    return JsonResponse({"message": "Video successfully saved"}, status=204) 


def serializeVideo(video):
#serialize video with likes count

    return {
        "id": video.id,
        "title": video.title,
        "desc": video.desc,
        "cast": video.cast,
        "director": video.director,
        "imag":video.imag,            
        "media_typ":video.media_typ,
        "genre":video.genre,         
        "media_desc":video.media_desc,
        "genre_desc":video.genre_desc,
        "release_dt": video.release_dt.strftime("%Y-%m-%d"),
        "timestamp": video.timestamp.strftime("%b %d %Y, %I:%M %p"),
        "modified_ts": video.modified_ts.strftime("%b %d %Y, %I:%M %p"),            
        "saved_by": video.saved_by.username,
        "likes": video.likes,
        "cur_usr_like": video.cur_usr_like,
        "cur_usr_lst_e": video.cur_usr_lst_e
    }



class SaveLike(APIView):   
   permission_classes = (IsAuthenticated, )

   # Save a Like via POST
   def post(self, request):
   
    # Check contents of request
    data = json.loads(request.body)
        
    # Get video id
    video_id = data.get("videoId", "")

    try: 
        # Read video and toggle like attribute       
        video = Video.objects.get(pk=video_id)
        like = Like.objects.get(video=video, reaction_by=request.user) 
        like.like = not like.like 
    except Like.DoesNotExist:
        # Create a Like if not exists
        like = Like(
            reaction_by=request.user,
            video=video,
            like=True
            )
    except Video.DoesNotExist:
        return JsonResponse({"error": "Video not found for Like."}, status=404)
    like.save()
    # Likes Count
    like_count = Like.objects.filter(video=video, like=True).count()
    # Current User Like
    cur_usr_like = 0
    if like.like:
        cur_usr_like = like.id
    return JsonResponse({"cur_usr_like": cur_usr_like, "count": like_count} , status=201) 


class SaveMyListEntry(APIView):   
   permission_classes = (IsAuthenticated, )

   # Save a My List Entry via POST
   def post(self, request):
   
    # Check contents of request
    data = json.loads(request.body)
        
    # Get video id
    video_id = data.get("videoId", "")

    try: 
        # Read video and toggle MyList Entry        
        video = Video.objects.get(pk=video_id)
        my_lst_e = Mylist.objects.get(video=video, viewer=request.user) 
        my_lst_e.active = not my_lst_e.active 
    except Mylist.DoesNotExist:
        # Create a Mylist entry if not exists
        my_lst_e = Mylist(
            viewer=request.user,
            video=video,
            active=True
            )
    except Video.DoesNotExist:
        return JsonResponse({"error": "Video not found for My List entry."}, status=404)
    my_lst_e.save()
    
    # Current User Mylist entry
    cur_usr_lst_e = 0
    if my_lst_e.active:
        cur_usr_lst_e = my_lst_e.id
    return JsonResponse({"cur_usr_lst_e": cur_usr_lst_e} , status=201) 


class IsAdminUser(APIView):
   def get(self, request):
       isAdmin = False
       try:
            # Request parameter username 
            username = request.GET["u"]
            user = User.objects.get(username=username)
            isAdmin = user.role == User.VIDEO_ADMIN
       except User.DoesNotExist:
            pass        
       return JsonResponse({'isAdmin': isAdmin}, status=200) 


class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)
    def post(self, request):
        #Logout  
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)   
        

class UserRegistration(APIView):   
   def post(self, request):
       # Check request parameters
       data = json.loads(request.body)
        
       # Get contents of user registration form
       username = data.get("username", "")
       email = data.get("useremail", "")       

       # Ensure password matches confirmation
       password = data.get("password", "")
       confirmation = data.get("confirmation", "")
       if password != confirmation:
            return JsonResponse({
                "error": "Passwords must match."
            }, status=200)

       # Check Admin User's Validation Token
       # For the purpose of this demo, we will ensure that the 
       # Admin User's Validation Token matches the Username
       is_admin_user = data.get("isAdmin", "false")
       admin_token = data.get("adminToken", "")
       if is_admin_user and admin_token.lower() != username.lower():
            return JsonResponse({
                "error": "Invalid Admin User Token."
            }, status=200)

       # Attempt to create new user
       try:
           user = User.objects.create_user(username, email, password)           
           if(is_admin_user):
               user.role = User.VIDEO_ADMIN
           user.save()               
       except IntegrityError:
         return JsonResponse({
            "error": "Username already taken."
         }, status=200)
       except:
         return JsonResponse({
            "error": "User registration error"
         }, status=200)
       return JsonResponse({"message": "Registration successful."}, status=201) 