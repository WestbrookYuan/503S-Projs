from users.models import EmailVerifyRecord
from django.core.mail import send_mail
import random
import string

def random_str(length=8):

    chars = string.ascii_letters + string.digits
    strcode = ''.join(random.sample(chars, length))
    return strcode

def send_register_email(email, send_type='register'):
    email_record = EmailVerifyRecord()
    code = random_str()
    email_record.code = code
    email_record.email = email
    email_record.send_type = send_type
    email_record.save()

    if send_type == 'register':
        email_title = "WUSTL Blog activate link"
        # email_body = "please click link to activate, ec2-18-119-98-104.us-east-2.compute.amazonaws.com:3456/users/active/{0}".format(code)
        email_body = "please click link to activate, ec2-18-119-98-104.us-east-2.compute.amazonaws.com:3456/users/active/{0}".format(code)
        send_status = send_mail(email_title, email_body, 'yuan308389197@gmail.com', [email])
        if send_status:
            pass
    elif send_type == 'forget':
        email_title = "WUSTL Blog password forgot"
        # email_body = "please link to reset, ec2-18-119-98-104.us-east-2.compute.amazonaws.com:3456/users/forget_pwd_url/{0}".format(code)
        email_body = "please click link to reset, ec2-18-119-98-104.us-east-2.compute.amazonaws.com:3456/users/forget_pwd_url/{0}".format(code)
        send_status = send_mail(email_title, email_body, 'yuan308389197@gmail.com', [email])
        if send_status:
            pass