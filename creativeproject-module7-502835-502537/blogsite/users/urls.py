from django.urls import path
from . import views

app_name = 'users'

urlpatterns = [
    path('login', views.login_view, name='login'),
    path('register', views.register_view, name='register'),
    path('active/<activate_code>', views.activate_user, name='activate'),
    path('forget_pwd', views.forget_pwd_view, name='forget_pwd'),
    path('forget_pwd_url/<activate_code>', views.forget_pwd_url, name='forget_pwd_url'),
    path('user_profile', views.user_profile_view, name='user_profile'),
    path('logout', views.logout_view, name='logout'),
    path("editor_users", views.editor_users, name='editor_users')
]