from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm

class UserCreateForm (UserCreationForm):
	name = forms.CharField(max_length = 32, )

	class Meta:
		model = User
		fields = ("username", "name", "password1", "password2")

	def save(self, commit=True):
		user = super(UserCreateForm, self).save(commit=False)
		user.name = self.cleaned_data["name"]
		if commit:
			user.save()
		return user