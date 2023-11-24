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

# app-spa
# cd $CWD
# APP=./packages/noka-app-spa
# echo ------------------------------------------------------
# echo PROJECT: $APP
# echo ------------------------------------------------------
# cd $APP
# nk dev