from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response

from django.conf import settings

from utils import MethodNameMixin, pretty_print
from ..serializers import UserDetailSerializer, UserSerializer
from ..models import User
from ..core import IsAdminOrSelf, IsActiveUser

from typing import List

DEBUG = settings.DEBUG


class UserManagementViewSet(viewsets.ModelViewSet, MethodNameMixin):
    """
    ViewSet for basic user CRUD operations
    Some actions require admin privileges
    """

    serializer_class = UserSerializer
    queryset = User.objects.all()

    def get_serializer_class(self):
        if self.action == "retrieve":
            return UserDetailSerializer
        return UserSerializer

    @action(detail=False, methods=["GET"])
    def me(self, request):
        """Get current user's profile"""
        # NOTE: /users/me/ endpoint authentication middleware

        if DEBUG:
            pretty_print(
                f"Received Request from {self._get_method_name()}: {request}", "DEBUG"
            )

        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    def get_permissions(self) -> List:
        """
        Override to set custom permissions per action:

            - List/Retrieve: Authenticated users
            - Create: Anyone
            - Update/Delete: Admin only
        """
        if self.action in ["create"]:
            permission_classes = [AllowAny]
        elif self.action in ["update", "partial_update", "destroy"]:
            permission_classes = [IsAdminUser, IsAdminOrSelf]
        elif self.action == "me":
            permission_classes = [IsAuthenticated, IsActiveUser]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
