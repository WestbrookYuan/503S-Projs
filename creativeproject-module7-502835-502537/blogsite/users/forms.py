from django import forms
from django.contrib.auth.models import User
from .models import UserProfile
class LoginForm(forms.Form):
    username = forms.CharField(label='Username', max_length=32, widget=forms.TextInput(attrs={
        'class': 'input',
        'placeholder': 'please enter username'
    }))
    password = forms.CharField(label='Password', min_length=6, widget=forms.PasswordInput(attrs={
        'class': 'input',
        'placeholder': 'please enter password'
    }))

    def clean_password(self):
        username = self.cleaned_data.get('username')
        password = self.cleaned_data.get('password')

        if username == password:
            raise forms.ValidationError('Password cannot be the same as username!')
        return password

class RegisterForm(forms.ModelForm):
    email = forms.EmailField(label='Email', min_length=6, widget=forms.EmailInput(attrs={
            'class': 'input',
            'placeholder': 'please enter Email'
        }))
    password = forms.CharField(label='Password', min_length=6, widget=forms.PasswordInput(attrs={
            'class': 'input',
            'placeholder': 'please enter password'
        }))
    confirm = forms.CharField(label='confirm', min_length=6, widget=forms.PasswordInput(attrs={
            'class': 'input',
            'placeholder': 'please reenter password'
        }))        


    class Meta:
        model = User
        fields = ('email', 'password')
    def clean_email(self):
        email = self.cleaned_data.get('email')
        isExist = User.objects.filter(email=email).exists()
        if isExist:
            raise forms.ValidationError('User has existed!')
        
        return email
    def clean_confirm(self):
        if self.cleaned_data['password'] != self.cleaned_data['confirm']:
            raise forms.ValidationError('Reentered password is not the same!')
        return self.cleaned_data['confirm']



class ForgetPwdForm(forms.Form):
    email = forms.EmailField(label='EmailRegister', min_length=6, widget=forms.EmailInput(attrs={
            'class': 'input',
            'placeholder': 'please enter Email when you signed up'
        }))

class ModifyPwdForm(forms.Form):
	password = forms.CharField(label='InputNewPassword', min_length=6, widget=forms.PasswordInput(attrs={
            'class':'input', 
            'placeholder':'Please input new password'
        }))

class UserForm(forms.ModelForm):
    email = forms.EmailField(label='Email Address', widget=forms.EmailInput(attrs={
            'class': 'input',
        }))
    class Meta:
        model = User
        fields = ('email',)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['email'].disabled= True

class UserProfileForm(forms.ModelForm):
    birthday = forms.DateField(label="Birthday", widget=forms.DateInput(attrs={
            'class':'input',
            'type':'date',
            'style':'width:18%' 
        }))

    nick_name = forms.CharField(widget=forms.TextInput(attrs={
            'class':'input',
        }))

    USER_GENDER_TYPE = (
        ('male', 'male'),
        ('female', 'female'),
        ('unknown', 'unknown')
    )

    gender = forms.CharField(label="Gender", widget=forms.Select(choices=USER_GENDER_TYPE, attrs={
            'class':'input',
        }))

    desc = forms.CharField(label="Description", widget=forms.Textarea(attrs={
            'class':'input',
            'style': 'height:200px;resize:none;'
        }))

    motto = forms.CharField(label="Motto", widget=forms.TextInput(attrs={
            'class':'input',
        }))
    class Meta:
        model = UserProfile
        fields = ('nick_name','birthday', 'gender', 'avatar', 'motto',  'desc')