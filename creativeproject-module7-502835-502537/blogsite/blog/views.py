from django.shortcuts import render, HttpResponse, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.db.models import Q, F
from .models import Category, Post, Comment
from django.core.paginator import Paginator
from .forms import PostForm, CommentForm

# Create your views here.

def index(request):
    post_list = Post.objects.all()

    #  split into pages
    paginator = Paginator(post_list, 5) # each page display 5 items
    page_number = request.GET.get('page') # url + ?page=1,2,3,4,...
    page_obj = paginator.get_page(page_number) # posts of current page
    context = {
        # 'post_list': post_list,
        'page_obj': page_obj,
    }
    return render(request, "blog/index.html", context)

def posts_of_category(request, category_id):
    category = get_object_or_404(Category, id=category_id)

    # fetch all the posts belonging to this category
    posts = category.post_set.all()
    #  split into pages
    paginator = Paginator(posts, 5) # each page display 5 items
    page_number = request.GET.get('page') # url + ?page=1,2,3,4,...
    page_obj = paginator.get_page(page_number) # posts of current page
    context = {
        'category': category,
        # 'post_list': posts,
        'page_obj': page_obj,
    }
    return render(request, 'blog/list.html', context)

def post_details(request, post_id):
    # detail of the post
    post = get_object_or_404(Post, id=post_id)
    prev_post = Post.objects.filter(id__lt=post_id).last()
    next_post = Post.objects.filter(id__gt=post_id).first()
    cur_view_counts = post.view_counts
    cur_view_counts += 1
    post.view_counts = cur_view_counts
    post.save()
    comments = Comment.objects.filter(post_id=post_id)
    context = {
        'post': post, 
        'prev_post' : prev_post,
        'next_post' : next_post,
        'comments' : comments
    }
    return render(request, 'blog/detail.html', context)

def search(request):

    keyword = request.GET.get('keyword')
    if not keyword:
        post_list = Post.objects.all()
    else:
        post_list = Post.objects.filter(Q(title__icontains=keyword) | Q(abstract__icontains=keyword) | Q(content__icontains=keyword) )

    #  split into pages
    paginator = Paginator(post_list, 5) # each page display 5 items
    page_number = request.GET.get('page') # url + ?page=1,2,3,4,...
    page_obj = paginator.get_page(page_number) # posts of current page
    context = {
        # 'post_list' : post_list,
        'page_obj': page_obj,
    }
    return render(request, 'blog/index.html', context)


def archives(request, year, month):
    post_list = Post.objects.filter(add_date__year=year, add_date__month=month)
    
    #  split into pages
    paginator = Paginator(post_list, 5) # each page display 5 items
    page_number = request.GET.get('page') # url + ?page=1,2,3,4,...
    page_obj = paginator.get_page(page_number) # posts of current page
    print(page_obj)
    context = {
        'post_list': post_list, 
        'page_obj': page_obj,
        'year': year, 
        'month': month
    }
    return render(request, 'blog/archives_list.html', context )

@login_required(login_url='users:login')
def edit_blog(request, post_id):
    userID = request.user.id
    post = Post.objects.get(id=post_id)
    
    if userID != post.owner.id:
        return redirect("blog:post_details", post_id)
    
    if request.method == 'POST':
        try:
            # save button clicked, save the data
            post_form = PostForm(request.POST, instance=post)
            if post_form.is_valid():
                post_form.save()
            else:
                print(post_form.errors)
            return redirect("blog:post_details", post_id)

        except PostForm.DoesNotExist:
            post_form = PostForm(request.POST, request.FILES)
            if post_form.is_valid():
                post_form = post_form.save(commit=False)
                post_form.save()
            return redirect("blog:post_details", post_id)
    else:
        try:
            post_form = PostForm(instance=post)
        except Post.DoesNotExist:
            post_form = PostForm()  
    
    return render(request, 'blog/edit_blog.html', locals())

@login_required(login_url='users:login')
def create_blog(request):
    post = Post()
    post.owner = request.user
    post_form = PostForm(instance=post) 
    
    if request.method == 'POST':
        try:
            # publish button clicked, save the data
            post_form = PostForm(request.POST, instance=post)
            if post_form.is_valid():
                post_form.save()
            else:
                print(post_form.errors)
            return redirect("/")

        except PostForm.DoesNotExist:
            post_form = PostForm(request.POST, request.FILES)
            if post_form.is_valid():
                post_form = post_form.save(commit=False)
                post_form.save()
            return redirect("/")
    else:
        try:
            post_form = PostForm(instance=post)
        except Post.DoesNotExist:
            post_form = PostForm()  
    
    return render(request, 'blog/create_blog.html', locals())

@login_required(login_url='users:login')
def create_comment(request, post_id):
    comment = Comment()
    comment.user = request.user
    post = Post.objects.get(id=post_id)
    comment.post = post
    comment_form = CommentForm(instance=comment)
    if request.method == 'POST':
        try:
            print(1)
            comment_form = CommentForm(request.POST, instance=comment)
            print(comment_form)
            if comment_form.is_valid():
                # comment.content = request.POST.content
                new_comment_form = comment_form.save(commit=False)
                new_comment_form.user = request.user
                new_comment_form.post = post
                new_comment_form.save()
            else:
                print(comment_form.errors)
            return redirect("blog:post_details", post_id)
        except CommentForm.DoesNotExist:
            print(2)
            comment_form = CommentForm(request.POST, request.FILES)
            if comment_form.is_valid():
                comment_form = comment_form.save(commit=False)
                comment_form.save()
            return redirect("blog:post_details", post_id)
    
    else:
        try:
            comment_form = CommentForm(instance=comment)
        except CommentForm.DoesNotExist:
            comment_form = CommentForm()

    context = {
    }
    return render(request, 'blog/comment.html', locals())