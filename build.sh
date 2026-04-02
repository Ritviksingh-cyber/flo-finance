#!/usr/bin/env bash
set -e

pip install -r requirements.txt
export STATIC_ROOT="staticfiles"
python manage.py collectstatic --no-input
python manage.py migrate