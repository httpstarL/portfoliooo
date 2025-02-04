from flask import Flask, render_template, request, flash, redirect, url_for
from flask_mail import Mail, Message
from datetime import datetime
import os
import re

app = Flask(__name__)

# Email configuration
app.config.update(
    MAIL_SERVER='smtp.gmail.com',
    MAIL_PORT=587,
    MAIL_USE_TLS=True,
    MAIL_USERNAME='chaitanyamithil222@gmail.com',
    MAIL_PASSWORD='lgzq igfe mdmv nzet',
    MAIL_DEFAULT_SENDER='chaitanyamithil222@gmail.com',
    MAIL_MAX_EMAILS=None,
    MAIL_SUPPRESS_SEND=False,
    MAIL_DEBUG=True
)
app.secret_key = 'manvitha'

mail = Mail(app)

def is_valid_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def send_email(subject, sender, recipients, body, html=None):
    """Helper function to send emails with error handling"""
    try:
        msg = Message(
            subject=subject,
            sender=sender,
            recipients=recipients,
            body=body,
            html=html
        )
        mail.send(msg)
        return True, None
    except Exception as e:
        print(f"Email Error: {str(e)}")
        return False, str(e)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/thanks')
def thanks():
    return render_template('thanks.html')

@app.route('/contact', methods=['POST'])
def contact():
    try:
        # Get and validate form data
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip()
        message = request.form.get('message', '').strip()
        
        print(f"Received contact form - Name: {name}, Email: {email}")

        # Validate inputs
        if not all([name, email, message]):
            flash('All fields are required', 'error')
            return redirect(url_for('index'))
        
        if not is_valid_email(email):
            flash('Please enter a valid email address', 'error')
            return redirect(url_for('index'))

        # Send notification email to admin
        success, error = send_email(
            subject='🔔 New Contact Form Message',
            sender=app.config['MAIL_USERNAME'],
            recipients=[app.config['MAIL_USERNAME']],
            body=f'''
📬 New message from your website:

👤 Name: {name}
📧 Email: {email}
💭 Message:
{message}

Received on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
            '''
        )

        if not success:
            print(f"Failed to send notification email: {error}")
            flash('Error sending message. Please try again.', 'error')
            return redirect(url_for('index'))

        # Send auto-reply to user
        html_content = f'''
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }}
        .header {{
            background-color: #6f1d1b;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }}
        .content {{
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 0 0 8px 8px;
            border: 1px solid #ddd;
        }}
        .signature {{
            margin-top: 20px;
            padding-top: 20px;
            border-top: 2px solid #6f1d1b;
            font-style: italic;
        }}
        .highlight {{
            color: #6f1d1b;
            font-weight: bold;
        }}
    </style>
</head>
<body>
    <div class="header">
        <h2>🌟 Thank You for Reaching Out!</h2>
    </div>
    <div class="content">
        <p>Dear <span class="highlight">{name}</span>,</p>
        
        <p>Thank you for contacting me! 🙏 I've received your message and will get back to you as soon as possible.</p>
        
        <p>Here's what you sent:</p>
        <blockquote style="background: #f0f0f0; padding: 15px; border-left: 4px solid #6f1d1b;">
            {message}
        </blockquote>
        
        <p>I typically respond within 24-48 hours. 🕒</p>
        
        <div class="signature">
            <p>Best regards,<br>
            <strong>Chaitanya Kshatriya</strong> 👨‍💻</p>
            
            <p style="font-size: 0.9em; color: #666;">
            💼 Data Science & Web Development<br>
            🔗 Connect with me: <a href="https://www.linkedin.com/in/chaitanya-mithil-0110b22b2" style="color: #6f1d1b;">LinkedIn Profile</a>
            </p>
        </div>
    </div>
</body>
</html>
'''

        plain_text = f'''
Dear {name},

Thank you for contacting me! I've received your message and will get back to you as soon as possible.

Your message:
{message}

I typically respond within 24-48 hours.

Best regards,
Chaitanya Kshatriya
Connect with me on LinkedIn: https://www.linkedin.com/in/chaitanya-mithil-0110b22b2
'''

        success, error = send_email(
            subject='👋 Thank you for contacting Chaitanya',
            sender=app.config['MAIL_USERNAME'],
            recipients=[email],
            body=plain_text,
            html=html_content
        )

        if not success:
            print(f"Failed to send auto-reply: {error}")
            flash('Message received, but auto-reply failed.', 'warning')
            return redirect(url_for('thanks'))

        flash('Message sent successfully!', 'success')
        return redirect(url_for('thanks'))

    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        flash('An unexpected error occurred. Please try again.', 'error')
        return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)