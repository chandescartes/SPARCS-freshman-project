from django.db import models


# Create your models here.

class FlagScores (models.Model):
	username = models.CharField (max_length = 32, )
	score = models.IntegerField ()

class MapScores (models.Model):
	username = models.CharField (max_length = 32, )
	score = models.FloatField ()