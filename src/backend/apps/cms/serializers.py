import environ
from apps.cms.models import Advisory, Bulletin
from rest_framework import serializers
from wagtail.templatetags import wagtailcore_tags

CMS_FIELDS = [
    "live",
    "has_unpublished_changes",
    "first_published_at",
    "last_published_at",
    "go_live_at",
    "expire_at",
    "expired",
    "latest_revision",
    "live_revision"
]


class AdvisorySerializer(serializers.ModelSerializer):
    description = serializers.SerializerMethodField()

    # get rendered html elements for description and access static media foder
    def get_description(self, obj):
        rended_description = wagtailcore_tags.richtext(
            obj.description)
        result = (
            rended_description.replace("/drivebc-cms", "http://"
                                       + environ.Env()
                                       .list("DJANGO_ALLOWED_HOSTS")[0]
                                       + ":8000/drivebc-cms")
            .replace("/media", "http://" +
                     environ.Env().list("DJANGO_ALLOWED_HOSTS")[0] +
                     ":8000/media")
        )
        return result

    class Meta:
        model = Advisory
        fields = "__all__"


class BulletinSerializer(serializers.ModelSerializer):
    description = serializers.SerializerMethodField()

    # get rendered html elements for description and access static media foder
    def get_description(self, obj):
        rended_description = wagtailcore_tags.richtext(
            obj.description)
        result = (
            rended_description.replace("/drivebc-cms", "http://"
                                       + environ.Env()
                                       .list("DJANGO_ALLOWED_HOSTS")[0]
                                       + ":8000/drivebc-cms")
            .replace("/media", "http://" +
                     environ.Env().list("DJANGO_ALLOWED_HOSTS")[0] +
                     ":8000/media")
        )
        return result

    class Meta:
        model = Bulletin
        fields = "__all__"
