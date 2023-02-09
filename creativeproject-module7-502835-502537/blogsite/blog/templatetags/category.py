# this file is to define tag templates
# part of code is from https://docs.djangoproject.com/en/4.1/howto/custom-template-tags/
from django import template
from blog.models import Category, Sidebar, Post, Comment
from django.db.models.functions import TruncMonth
from django.db.models import Count


register = template.Library()

@register.simple_tag
def get_category_list():
    return Category.objects.all()


@register.simple_tag
def get_sidebar_list():
    return Sidebar.get_sidebar()

@register.simple_tag
def get_newest_post():
    return Post.objects.order_by('-add_date')[:5]


@register.simple_tag
def get_hotest_post():
    return Post.objects.order_by('-view_counts')[:5]

@register.simple_tag
def get_archives_post():
    return Post.objects.annotate(month=TruncMonth('add_date')).values('month').annotate(c=Count('id')).values('month', 'c')

@register.simple_tag
def get_comments():
    length = len(Comment.objects.all())
    if length - 5 >= 0:
        return Comment.objects.all()[length-5:length-1]
    else:
        return Comment.objects.all()