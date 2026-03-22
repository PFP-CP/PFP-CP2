import urllib.request
"""instance is either an account or a house model/object"""
"""field name is the name of the picture field"""
"""upload_picture is the picture instance"""
"""everything else should be self explanatory"""

"""method to check if the file is a picture of not ,please add any picture extension you feel appropriate """
def is_image(uploaded_file):
    allowed_types = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"]
    return uploaded_file.content_type in allowed_types

def upload_picture(instance, field_name: str, uploaded_picture):
    if not is_image(uploaded_picture):
        raise ValueError("file is not an image")
    field = getattr(instance, field_name)
    field.save(uploaded_picture.name, uploaded_picture, save=True)
    return getattr(instance, field_name).url


def delete_picture(instance, field_name: str):
    field = getattr(instance, field_name)
    if field:
        field.delete(save=True)

def get_picture_name(instance , field_name :str):
    field = getattr(instance , field_name)
    return field.name

def get_picture_url(instance, field_name: str):
    field = getattr(instance, field_name)
    return field.url if field else None


def replace_picture(instance, field_name: str, uploaded_picture):
    if not is_image(uploaded_picture):
        raise ValueError("file is not an image")
    delete_picture(instance, field_name)
    return upload_picture(instance, field_name, uploaded_picture)


def picture_exists(instance, field_name: str):
    return bool(getattr(instance, field_name))


def upload_picture_from_url(instance, field_name, url, save_name=None):
    name = save_name or url.split("/")[-1]
    with urllib.request.urlopen(url) as response:
        from django.core.files.uploadedfile import SimpleUploadedFile
        file = SimpleUploadedFile(name, response.read(), content_type=response.headers.get("Content-Type", "image/jpeg"))
        return upload_picture(instance, field_name, file)