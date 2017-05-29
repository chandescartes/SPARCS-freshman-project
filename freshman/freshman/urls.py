"""freshman URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from freshman_app import views as core_views


urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^signup/$', core_views.signup_view, name='signup'),
    url(r'^login/$', core_views.login_view, name='login'),
    url(r'^home/$', core_views.home_view, name='home'),
    url(r'^flag/$', core_views.flag_view, name='flag'),
    url(r'^map/$', core_views.map_view, name='map'),
    url(r'^logout/$', core_views.logout_view, name='logout'),
    url(r'^high/$', core_views.high_view, name='high'),
    url(r'^leader/$', core_views.leader_view, name='high'),
    url(r'^add_flag/$', core_views.add_flag_view, name='add_flag'),
    url(r'^add_map/$', core_views.add_map_view, name='add_map'),
]
