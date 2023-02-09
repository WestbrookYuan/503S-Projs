from django.db import models
from django.contrib.auth.models import User
from django.utils.functional import cached_property
from django.template.loader import render_to_string
from ckeditor_uploader.fields import RichTextUploadingField
# Create your models here.

# a model for classify blogs into different categories
class Category(models.Model):
    name = models.CharField(max_length=32, verbose_name='name')
    desc = models.TextField(max_length=200, blank=True, default='', verbose_name='description')
    add_date = models.DateTimeField(auto_now_add=True, verbose_name='add_time') # publication time
    pub_date = models.DateTimeField(auto_now=True, verbose_name='modifiy_time') # modification time

    class Meta:
        verbose_name = 'Blog Category'
        verbose_name_plural = 'Blog Categories'

    def __str__(self):
        return self.name

# tags that a passage belongs to
class Tag(models.Model):
    name = models.CharField(max_length=32, verbose_name='name')
    add_date = models.DateTimeField(auto_now_add=True, verbose_name='add_time')
    pub_date = models.DateTimeField(auto_now=True, verbose_name='modifiy_time')

    class Meta:
        verbose_name = 'Post Tag'
        verbose_name_plural = 'Post Tags'

    def __str__(self):
        return self.name

# the passages that users published
class Post(models.Model):
    title = models.CharField(max_length=61, verbose_name='title')
    owner = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='author')
    abstract = models.TextField(max_length=200, default='', blank=True, verbose_name='abstract')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, verbose_name='category')
    content = RichTextUploadingField(verbose_name='content')
    tags = models.ForeignKey(Tag, blank=True, null=True, on_delete=models.CASCADE, verbose_name='tags')
    add_date = models.DateTimeField(auto_now_add=True, verbose_name='add_time')
    pub_date = models.DateTimeField(auto_now=True, verbose_name='modifiy_time')
    view_counts =models.IntegerField(default=0,verbose_name="view_counts")
    class Meta:
        verbose_name = 'Post'
        verbose_name_plural = 'Posts'

    def __str__(self):
        return self.title
class Comment(models.Model):
    post = models.ForeignKey(Post, 
        on_delete=models.CASCADE,
        verbose_name='comment_blog'
    )
    user = models.ForeignKey(User, 
        on_delete=models.CASCADE,
        verbose_name='comment_user'
    )
    content = models.TextField(verbose_name='comment_content')
    add_time = models.DateTimeField(auto_now_add=True, verbose_name='add_time')
    class Meta:
        verbose_name = 'Comment'
        verbose_name_plural = 'Comments'
    def __str__(self):
        return self.content
class Sidebar(models.Model):
    STATUS = (
        (1, 'Hide'),
        (2, 'Show')
    )
    DISPLAY_TYPE = (
        (1, 'search'),
        (2, 'newest'),
        (3, 'hotest'),
        (4, 'recent comment'),
        (5, 'archive blog'),
        (6, 'HTML')
    )
    title = models.CharField(max_length=50, verbose_name="title")
    display_type = models.PositiveIntegerField(default=1, choices=DISPLAY_TYPE, verbose_name="displayType")
    content = models.CharField(max_length=500, blank=True, default='', verbose_name="content",
                               help_text="can be null if not HTML")
    sort = models.PositiveIntegerField(default=1,  verbose_name="sort", help_text='sortbyid')
    status = models.PositiveIntegerField(default=2, choices=STATUS, verbose_name="status")
    add_date = models.DateTimeField(auto_now_add=True, verbose_name="publishTime")

    class Meta:
        verbose_name = "Sidebar"
        verbose_name_plural = verbose_name
        ordering = ['-sort']

    def __str__(self):
        return self.title

    @classmethod
    def get_sidebar(cls):
        return cls.objects.filter(status=2)

    @property
    def get_content(self):
        if self.display_type == 1:
            context = {

            }
            return render_to_string('blog/sidebar/search.html', context=context)
        elif self.display_type == 2:
            context = {

            }
            return render_to_string('blog/sidebar/newest_post.html', context=context)
        elif self.display_type == 3:
            context = {

            }
            return render_to_string('blog/sidebar/hotest_post.html', context=context)
        elif self.display_type == 4:
            context = {

            }
            return render_to_string('blog/sidebar/comment.html', context=context)
        elif self.display_type == 5:
            context = {

            }
            return render_to_string('blog/sidebar/archives.html', context=context)
        elif self.display_type == 6:
            
            return self.content