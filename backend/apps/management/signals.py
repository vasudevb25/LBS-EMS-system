from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from management.models import Centre
from users.models import User
from django.contrib.auth.hashers import make_password
import uuid


@receiver(post_save, sender=Centre)
def create_centre_user(sender, instance, created, **kwargs):
    """
    When a new Centre is created, automatically create a linked User account.
    """
    if created:
        # Avoid duplicate users if this signal is accidentally triggered twice
        if not User.objects.filter(centre=instance).exists():
            username = instance.centre_name.lower().replace(" ", "_")
            email = f"{username}@centre.local"
            
            # Generate a random 8-character password
            raw_password = uuid.uuid4().hex[:8]
            hashed_password = make_password(raw_password)

            try:
                User.objects.create(
                    username=username,
                    password=hashed_password,
                    email=email,
                    user_role="Centre",
                    centre=instance,
                )
                print(f"✅ User created for centre: {instance.centre_name}")
                print(f"   Username: {username}")
                print(f"   Password (plain): {raw_password}")
            except Exception as e:
                print(f"❌ Failed to create user for {instance.centre_name}: {e}")


@receiver(post_delete, sender=Centre)
def delete_users_for_centre(sender, instance, **kwargs):
    """
    Automatically delete associated user(s) when a centre is deleted.
    """
    User.objects.filter(centre=instance).delete()
