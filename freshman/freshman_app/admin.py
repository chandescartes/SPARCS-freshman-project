from django.contrib import admin
from .models import FlagScores, MapScores

# Register your models here.
admin.site.register(FlagScores)
admin.site.register(MapScores)