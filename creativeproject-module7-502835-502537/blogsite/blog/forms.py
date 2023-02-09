from django import forms
from .models import Post, Comment
from ckeditor_uploader.widgets import CKEditorUploadingWidget

class PostForm(forms.ModelForm):
    title = forms.CharField(max_length=61, widget=forms.TextInput(attrs={
        'class': 'input',
    }))

    abstract = forms.CharField(max_length=200, widget=forms.Textarea(attrs={
        'class': 'input',
        'style':'resize:none;height:90px;'
    }))

    content = forms.CharField(widget=CKEditorUploadingWidget())

    class Media:
        js = [
            'ckeditor5/ckeditor.js',
            'ckeditor5/config.js'
        ]

    class Meta:
        model = Post
        fields = ('title', 'owner', 'abstract', 'category',  'content', 'tags')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['owner'].disabled = True

class CommentForm(forms.ModelForm):
    content = forms.CharField(min_length=6, max_length=200, widget=forms.TextInput(attrs={
        'class': 'input',
        'placeholder': 'please enter your comment',
    }))

    class Meta:
        model = Comment
        fields = ('post', 'user', 'content')
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['user'].disabled = True
        self.fields['post'].disabled = True