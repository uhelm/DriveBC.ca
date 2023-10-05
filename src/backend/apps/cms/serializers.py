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


class CMSSerializer(serializers.ModelSerializer):
    description = serializers.SerializerMethodField()

    def get_host(self):
        request = self.context.get("request")
        prefix = "https://" if request.is_secure() else "http://"
        return prefix + request.get_host()

    # get rendered html elements for description and access static media foder
    def get_description(self, obj):
        res = wagtailcore_tags.richtext(obj.description)
        res = res.replace(
            'href="/drivebc-cms',
            'href="' + self.get_host() + '/drivebc-cms'
        )
        res = res.replace(
            'src="/media',
            'src="' + self.get_host() + '/media'
        )
        return res


class AdvisorySerializer(CMSSerializer):
    class Meta:
        model = Advisory
        fields = "__all__"


class BulletinSerializer(CMSSerializer):
    class Meta:
        model = Bulletin
        fields = "__all__"
