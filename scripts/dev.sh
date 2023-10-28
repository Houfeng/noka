set -e

CWD=$PWD;

# app
cd $CWD
APP=./packages/noka-app
echo ------------------------------------------------------
echo PROJECT: $APP
echo ------------------------------------------------------
cd $APP
nk dev