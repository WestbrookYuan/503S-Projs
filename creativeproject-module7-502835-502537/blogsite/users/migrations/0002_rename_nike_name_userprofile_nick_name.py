# Generated by Django 3.2.16 on 2022-12-01 23:09

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='userprofile',
            old_name='nike_name',
            new_name='nick_name',
        ),
    ]
