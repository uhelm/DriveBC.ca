from datetime import datetime
from apps.event.enums import EVENT_DIRECTION_DISPLAY
from apps.event.models import Event
from rest_framework import serializers


class ScheduleSerializer(serializers.Serializer):
    intervals = serializers.ListField(child=serializers.CharField())

class EventSerializer(serializers.ModelSerializer):
    direction_display = serializers.SerializerMethodField()
    route_display = serializers.SerializerMethodField()
    schedule = ScheduleSerializer()

    class Meta:
        model = Event
        exclude = (
            "created_at",
            "modified_at",
        )

    def to_representation(self, instance):
        representation = super(EventSerializer, self).to_representation(instance)
        schedule = instance.schedule.get('intervals', [])
        if schedule and isinstance(schedule, list):
            start, end = schedule[0].split('/')
            representation['start'] = start
            representation['end'] = end
        return representation
    
    def get_direction_display(self, obj):
        return EVENT_DIRECTION_DISPLAY[obj.direction]

    def get_route_display(self, obj):
        res = obj.route_from[3:] if obj.route_from[:3] == "at " else obj.route_from

        if obj.route_to:
            res += " to " + obj.route_to

        return res
