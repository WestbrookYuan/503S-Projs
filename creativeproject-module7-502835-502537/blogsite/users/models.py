from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class UserProfile(models.Model):
    USER_GENDER_TYPE = (
        ('male', 'male'),
        ('female', 'female'),
        ('unknown', 'unknown')
    )

    owner = models.OneToOneField(User, on_delete=models.CASCADE, verbose_name='user')
    nick_name = models.CharField('nick_name', max_length=23, null=False, blank=False, default='')
    birthday = models.DateField('birthday', null=True, blank=True)
    gender = models.CharField('gender', max_length=8, choices=USER_GENDER_TYPE, default='unknown')
    avatar = models.ImageField(upload_to='images/avatar/%Y/%m', default='images/avatar/default.png', max_length=100, verbose_name='user_avatar')
    desc = models.TextField('personal_description', max_length=200, blank=True, default='this gue is lazy. He leaves nothing here.')
    motto = models.CharField('personal_motto', max_length=50, blank=True, null=True, default='not set yet')

    class Meta:
        verbose_name = 'User Information'
        verbose_name_plural = verbose_name

    def __str__(self):
        return self.owner.username

class EmailVerifyRecord(models.Model):
    SEND_TYPE_CHOICES = (
        ("register", 'reg'),
        ("forget", 'for')
    )
    code = models.CharField('captcha', max_length=20)
    email = models.EmailField('email', max_length=35)
    send_type = models.CharField(choices=SEND_TYPE_CHOICES, default='register', max_length=20)
    class Meta:
        verbose_name = 'email captha'
        verbose_name_plural = verbose_name
    
    def __str__(self):
        return self.code