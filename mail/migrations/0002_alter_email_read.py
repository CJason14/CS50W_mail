# Generated by Django 4.1 on 2022-10-10 23:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mail', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='email',
            name='read',
            field=models.BooleanField(default=False, null=True),
        ),
    ]
