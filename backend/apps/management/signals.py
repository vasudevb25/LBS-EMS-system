from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.utils.crypto import get_random_string
from management.models import Centre
from users.models import User


@receiver(post_save, sender=Centre)
def create_centre_user(sender, instance, created, **kwargs):
    """
    When a new Centre is created, automatically create a linked User account
    and email login credentials to the centre email.
    """

    if not created:
        return

    # Prevent duplicate user creation
    if User.objects.filter(centre=instance).exists():
        return

    # Generate username safely
    username = instance.centre_name.lower().replace(" ", "_")

    # Use centre's actual email
    centre_email = instance.email

    # Generate secure random password
    raw_password = get_random_string(length=10)

    try:
        # Create user properly (this auto-hashes password)
        user = User.objects.create_user(
            username=username,
            email=centre_email,
            password=raw_password,
        )

        user.user_role = "Centre"
        user.centre = instance
        user.save()

        # Send email with credentials
        subject = "Your Centre Login Credentials"
        text_content = f"""
Dear {instance.centre_name},

Your centre account has been successfully created.

Login Details:
Username: {username}
Password: {raw_password}

Please change your password after your first login.

Regards,
LBS Education Management System
"""

        html_content = f"""
<h3>Welcome to LBS Education Management System</h3>
<p>Your centre account has been created successfully.</p>
<p><strong>Username:</strong> {username}</p>
<p><strong>Password:</strong> {raw_password}</p>
<p>Please change your password after first login.</p>
<br/>
<p>Regards,<br/>LBS EMS Team</p>
"""

        email = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[centre_email],
        )
        email.attach_alternative(html_content, "text/html")
        email.send()

        print(f"✅ User + Email sent for centre: {instance.centre_name}")

    except Exception as e:
        print(f"❌ Failed to create user/email for {instance.centre_name}: {e}")


@receiver(post_delete, sender=Centre)
def delete_users_for_centre(sender, instance, **kwargs):
    """
    Automatically delete associated user(s) when a centre is deleted.
    """
    User.objects.filter(centre=instance).delete()
