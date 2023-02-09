from django.contrib import admin
from django.contrib.auth.models import User
from .models import UserProfile, EmailVerifyRecord

# Register your models here.
from django.contrib.auth.admin import UserAdmin

admin.site.unregister(User)

# define style: StackedInline or TabularInline
class UserProfileInline(admin.StackedInline):
    model = UserProfile

# inline the UserProfile
class UserProfileAdmin(UserAdmin):
    inlines = [UserProfileInline]

admin.site.register(User, UserProfileAdmin)

@admin.register(EmailVerifyRecord)
class Admin(admin.ModelAdmin):
    list_display = ('code',)