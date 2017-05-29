from django.shortcuts import render
from django.shortcuts import render, redirect
from django.contrib.auth import logout, authenticate, login
from .forms import UserCreateForm
from .models import FlagScores, MapScores
from django.http import HttpResponse

# Create your views here.

def signup_view(request):    
	if request.session.get('name'):
		return redirect('home')

	else:
		if request.method == 'POST':
			form = UserCreateForm(request.POST)

			if form.is_valid():
				form.save()

				username = form.cleaned_data.get('username')
				name = form.cleaned_data.get('name')
				password = form.cleaned_data.get('password1')				

				user = authenticate(username=username, password=password)
				login(request, user)

				return redirect('home')

			else:
				for key in form.errors.as_data():
					error = form.errors.as_data()[key][0]
					break
				print(form.errors.as_data())
				return render(request, 'signup.html', {'errors': error})
				
		else:
			form = UserCreateForm()
		
		return render(request, 'signup.html', {'form': form})

def home_view(request):
	datas = {}
	name = request.user.username
	if (name):
		datas['name'] = name
	return render(request, 'home.html', datas)

def login_view(request):
	if request.method == 'POST':
		username = request.POST['username']
		password = request.POST['password']
		user = authenticate(request, username=username, password=password)
		if user is not None:
			login(request, user)
			return redirect('home')
		else:
			return render(request, 'login.html', {'errors':'Invalid Username or Password'})

	return render(request, 'login.html')

def flag_view(request):
	datas = {}
	name = request.user.username
	if (name):
		datas['name'] = name
	return render(request, 'flag.html', datas)

def map_view(request):
	datas = {}
	name = request.user.username
	if (name):
		datas['name'] = name
	return render(request, 'map.html', datas)

def high_view(request):
	datas = {}
	name = request.user.username
	if (name):
		datas['name'] = name

		flag_entries = list(FlagScores.objects.all().filter(username=name).order_by('-score'))
		flag_length = min(len(flag_entries), 10)

		flag_scores = []
		for i in range(flag_length):
			flag_scores.append([i+1, flag_entries[i].score])
		datas['flag_scores'] = flag_scores

		map_entries = list(MapScores.objects.all().filter(username=name).order_by('-score'))
		map_length = min(len(map_entries), 10)

		map_scores = []
		for i in range(map_length):
			map_scores.append([i+1, map_entries[i].score])
		datas['map_scores'] = map_scores

	return render(request, 'high.html', datas)

def leader_view(request):
	datas = {}
	name = request.user.username
	if (name):
		datas['name'] = name
		flag_entries = list(FlagScores.objects.all().order_by('-score'))
		flag_length = min(len(flag_entries), 10)

		flag_scores = []
		for i in range(flag_length):
			flag_scores.append([i+1, flag_entries[i].username, flag_entries[i].score])
		datas['flag_scores'] = flag_scores

		map_entries = list(MapScores.objects.all().order_by('-score'))
		map_length = min(len(map_entries), 10)

		map_scores = []
		for i in range(map_length):
			map_scores.append([i+1, map_entries[i].username, map_entries[i].score])
		datas['map_scores'] = map_scores

	return render(request, 'leader.html', datas)


def add_flag_view(request):
	if request.user:
		if request.method == 'POST':
			score = request.POST.get('score')
			post = FlagScores(username=request.user.username, score=score)
			post.save()
			return HttpResponse({})
	return HttpResponse({})

def add_map_view(request):
	if request.user:
		if request.method == 'POST':
			score = request.POST.get('score')
			post = MapScores(username=request.user.username, score=score)
			post.save()
			return HttpResponse({})
	print("ASDF")
	return HttpResponse({})

def logout_view(request):
	logout(request)
	return redirect('home')