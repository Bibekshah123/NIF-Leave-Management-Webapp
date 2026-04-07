from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from rest_framework import serializers

class EmailBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        User = get_user_model()
        if username is None:
            username = kwargs.get(User.EMAIL_FIELD)
        
        if username is None or password is None:
            return None
            
        try:
            user = User.objects.get(email=username)
        except User.DoesNotExist:
            return None
            
        if user.check_password(password):
            return user
        return None
