from django.contrib import admin
from .models import User
from .models import Video
from .models import Mylist
from .models import Like

# Register your models here.
admin.site.register(User)
admin.site.register(Video)
admin.site.register(Mylist)
admin.site.register(Like)


