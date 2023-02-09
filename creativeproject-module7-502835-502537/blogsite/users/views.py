from django.shortcuts import render, HttpResponse, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth.hashers import make_password
from django.contrib.auth.decorators import login_required
from django.db.models import Q

from .forms import LoginForm, RegisterForm, ForgetPwdForm, ModifyPwdForm, UserForm, UserProfileForm
from utils.email_send import send_register_email
from .models import EmailVerifyRecord, UserProfile

# Create your views here.
class MyBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None):
        try:
            user = User.objects.get(Q(username=username) | Q(email=username))
            if user.check_password(password):
                return user
        except Exception as e:
            return None

def activate_user(request, activate_code):
    all_records = EmailVerifyRecord.objects.filter(code=activate_code)
    if all_records:
        for record in all_records:
            email = record.email
            user = User.objects.get(email=email)
            user.is_staff = True
            user.save()
    else:
        return HttpResponse("link is wrong")   
    return redirect('users:login')        
def login_view(request):
    if request.method != 'POST': # display the login page
        form = LoginForm()
    else: # click login button
        form = LoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect('/')
            else:
                return HttpResponse('Incorrect username or password!')
        else:
            return HttpResponse('Invalid Input!')
    context = {'form': form}
    return render(request, 'users/login.html', context)

def register_view(request):
    if request.method != 'POST':
        form = RegisterForm()
    else:
        form  = RegisterForm(request.POST)
        if form.is_valid():
            newUser = form.save(commit=False)
            newUser.set_password(form.cleaned_data['password'])
            newUser.username = form.cleaned_data.get('email')
            newUser.save()
            send_register_email(form.cleaned_data.get('email'), 'register')
            return HttpResponse('Successfully registered! A verification link has been sent to your email.')
    context = {'form': form}
    return render(request, 'users/register.html', context)


def forget_pwd_view(request):
    if request.method == 'GET':
        form = ForgetPwdForm()
    elif request.method == "POST":
        form = ForgetPwdForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data.get('email')
            isExist = User.objects.filter(email=email).exists()
            if isExist:
                send_register_email(email, 'forget')
                return HttpResponse('A link for reseting the password has been sent to your email.') 
            else:
                return redirect('users:login')
    return render(request, 'users/forget_pwd.html', {'form' : form})


def forget_pwd_url(request, activate_code):
    if request.method != 'POST':
        form = ModifyPwdForm()
    else:
        form = ModifyPwdForm(request.POST)
        if form.is_valid():
            record = EmailVerifyRecord.objects.get(code=activate_code)
            email = record.email
            user = User.objects.get(email=email)
            user.username = email
            user.password = make_password(form.cleaned_data.get('password'))
            user.save()
            return redirect('users:login')
        else:
            return redirect('users:login')
    
    return render(request, 'users/reset_pwd.html', {'form' : form})

@login_required(login_url='users:login')
def user_profile_view(request):
    user = User.objects.get(username=request.user)
    return render(request, 'users/user_profile.html', {'user': user})

def logout_view(request):
    logout(request)
    return redirect('users:login')

@login_required(login_url='users:login')
def editor_users(request):
    user = User.objects.get(id=request.user.id)
    if request.method == 'POST':
        try:
            # if user profile exists
            user_profile = user.userprofile
            form = UserForm(request.POST, instance=user)
            user_profile_form = UserProfileForm(request.POST, request.FILES, instance=user_profile)
            if form.is_valid() and user_profile_form.is_valid():
                form.save()
                user_profile_form.save()

                return redirect("users:user_profile")
        except UserProfile.DoesNotExist:
            form = UserForm(request.POST, instance=user)
            user_profile_form = UserProfileForm(request.POST, request.FILES)            
            if form.is_valid() and user_profile_form.is_valid():
                form.save()
                new_user_profile = user_profile_form.save(commit=False)
                new_user_profile.owner = request.user
                new_user_profile.save()

                return redirect("users:user_profile")
    else:
        try:
            # if user profile exists
            user_profile = user.userprofile
            form = UserForm(instance=user)
            user_profile_form = UserProfileForm(instance=user_profile)
        except UserProfile.DoesNotExist:
            form = UserForm(instance=user)
            user_profile_form = UserProfileForm()            

    return render(request, 'users/editor_users.html', locals())