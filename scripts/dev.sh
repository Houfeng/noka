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

# app-react
# cd $CWD
# APP=./packages/noka-app-rect
# echo ------------------------------------------------------
# echo PROJECT: $APP
# echo ------------------------------------------------------
# cd $APP
# nk dev