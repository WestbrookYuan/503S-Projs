from django.urls import path
from . import views

app_name = "blog"

urlpatterns = [
    path('', views.index, name='index'),
    path('category/<int:category_id>/', views.posts_of_category, name='posts_of_category'),
    path('post/<int:post_id>/', views.post_details, name='post_details'),
    path('search', views.search, name='search'),
    path('archives/<int:year>/<int:month>', views.archives, name='archives'),
    path('edit_blog/<int:post_id>/', views.edit_blog, name='edit_blog'),
    path('create_blog/', views.create_blog, name='create_blog'),
    path('create_comment/<int:post_id>', views.create_comment, name='create_comment')
]