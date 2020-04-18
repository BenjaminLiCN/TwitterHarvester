#!/bin/bash

. ./unimelb-comp90024-2020-grp-18-openrc.sh; ansible-playbook -i hosts -u ubuntu --key-file=benjaminnectar.pem couchdb.yaml