#!/bin/bash

cd /var/www && npm install

envContent=$(aws ssm get-parameters --region us-east-2 --names anon-ask-env --output text --query Parameters[0].Value)

echo $envContent > /var/www/.env