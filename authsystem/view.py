from rest_framework.response import Response

from rest_framework.decorators import api_view, authentication_classes, permission_classes
from .models import  item
from .serializers import *
from rest_framework.authtoken.models import Token
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout

@api_view(['get'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def getData(request):
    items =  item.objects.all()    
    print(items)
    serializer = ItemSerializers(items,many=True)
    
    return Response(serializer.data)


@api_view(['post'])
def addData(request):
    
    serializer = ItemSerializers(data=request.data)
    if serializer.is_valid():
        serializer.save()
    
    return Response(serializer.data)

@api_view(['post'])
def Register(request):
    serializer = UserSerializer(data = request.data)
    if not serializer.is_valid():
        return Response({'error':serializer.errors,'message':'something went wrong'})
    serializer.save()
    user = User.objects.get(username = serializer.data['username'])
    token_obj ,_ = Token.objects.get_or_create(user=user)
    
    return Response({'status':200,'payload':serializer.data,'token':str(token_obj),"message":"your resiter successfully"})



@api_view(['post'])
@csrf_exempt
def Login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)

    if user is not None:
        login(request, user)
        token_obj, _ = Token.objects.get_or_create(user=user)
        return Response({'status': 200, 'token': str(token_obj), 'message': 'Login successful'})
    else:
        return Response({'status': 401, 'message': 'Invalid credentials'})
    
    
@api_view(['post'])
@csrf_exempt
def Logout(request):
    if request.user.is_authenticated:
        request.user.auth_token.delete()
        logout(request)
        return Response({'status': 200, 'message': 'Logout successful'})
    else:
        return Response({'status': 401, 'message': 'You are not logged in'})
