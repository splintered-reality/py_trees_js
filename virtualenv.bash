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

install_package virtualenvwrapper || return

# To use the installed python3
VERSION="--python=/usr/bin/python3"
# To use a specific version
# VERSION="--python=python3.6"

if [ "${VIRTUAL_ENV}" == "" ]; then
  workon ${NAME}
  result=$?
  if [ $result -eq 1 ]; then
    mkvirtualenv ${VERSION} ${NAME}
  fi
  if [ $result -eq 127 ]; then
    pretty_error "Failed to find virtualenvwrapper aliases: 1) re-log or 2) source virtualenvwrapper.sh in your shell's .rc"
    return 1
  fi
fi

# Use the external pyqt5 rather than having to compile it in the virtual env
#   Currently broken -> https://github.com/stuaxo/vext/issues/58
#
# install_package pyqt5-dev || return
# install_package python3-pyqt5 || return
# install_package python3-pyqt5.qtsvg || return
# install_package python3-sip-dev || return
# install_package pyqt5-dev-tools || return
# install_package qttools5-dev-tools || return
# install_package python3-pyqt5.qtwebengine || return
# pip install vext.pyqt5

# Alternatively, fetch the wheels
#  Crashes on exit, https://github.com/splintered-reality/py_trees_js/issues/100
pip install PyQt5
pip install PyQtWebEngine
pip install twine

python setup.py develop

echo ""
echo "Leave the virtual environment with 'deactivate'"
echo ""
echo "I'm grooty, you should be too."
echo ""
