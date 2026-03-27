from django.contrib import admin
from .models import House,Location, Pictures
# Register your models here.
admin.site.register(House)
admin.site.register(Location)
@admin.register(Pictures)
class PicturesAdmin(admin.ModelAdmin):
      
      list_display = ('get_post', 'house', 'picture', 'time_stamp')
      @admin.display(description='Related Post')
      def get_post(self, obj):

        if obj.house and hasattr(obj.house, 'post'):
            return obj.house.post.title
        return "house not posted yet"