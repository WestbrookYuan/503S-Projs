# Generated by Django 3.2.16 on 2022-12-01 23:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_rename_nike_name_userprofile_nick_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='nick_name',
            field=models.CharField(default='', max_length=23, verbose_name='nick_name'),
        ),
    ]
