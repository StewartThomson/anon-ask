#!/bin/bash

cd /var/www && npm install

envContent=$(aws ssm get-parameters --names anon-ask-env --query Parameters[0].Value)

echo $envContent > .env