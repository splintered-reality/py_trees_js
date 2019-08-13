#!/bin/bash

# Script for setting up the development environment.
#source /usr/share/virtualenvwrapper/virtualenvwrapper.sh

NAME=py_trees_js

##############################################################################
# Colours
##############################################################################

BOLD="\e[1m"

CYAN="\e[36m"
GREEN="\e[32m"
RED="\e[31m"
YELLOW="\e[33m"

RESET="\e[0m"

padded_message ()
{
  line="........................................"
  printf "%s %s${2}\n" ${1} "${line:${#1}}"
}

pretty_header ()
{
  echo -e "${BOLD}${1}${RESET}"
}

pretty_print ()
{
  echo -e "${GREEN}${1}${RESET}"
}

pretty_warning ()
{
  echo -e "${YELLOW}${1}${RESET}"
}

pretty_error ()
{
  echo -e "${RED}${1}${RESET}"
}

##############################################################################
# Methods
##############################################################################

install_package ()
{
  PACKAGE_NAME=$1
  dpkg -s ${PACKAGE_NAME} > /dev/null
  if [ $? -ne 0 ]; then
    sudo apt-get -q -y install ${PACKAGE_NAME} > /dev/null
  else
    pretty_print "  $(padded_message ${PACKAGE_NAME} "found")"
    return 0
  fi
  if [ $? -ne 0 ]; then
    pretty_error "  $(padded_message ${PACKAGE_NAME} "failed")"
    return 1
  fi
  pretty_warning "  $(padded_message ${PACKAGE_NAME} "installed")"
  return 0
}

##############################################################################

echo ""
pretty_header "Using pipenv to facilitate the virtual environment"
echo ""

install_package python3-pip || return

PACKAGE_NAME=pipenv
which ${PACKAGE_NAME} > /dev/null
if [ $? -ne 0 ]; then
  pip3 install --user pipenv
else
  pretty_print "  $(padded_message ${PACKAGE_NAME} "found")"
fi
if [ $? -ne 0 ]; then
  pretty_print "  $(padded_message ${PACKAGE_NAME} "failed")"
  return
fi

echo ""
echo "Once entered, leave the virtual env with 'exit'"
echo ""
echo "I'm grooty, you should be too."
echo ""

pipenv shell
