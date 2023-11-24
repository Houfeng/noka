set -e

CWD=$PWD;

# utility
cd $CWD
CORE=./packages/noka-utility
echo ------------------------------------------------------
echo PROJECT: $CORE
echo ------------------------------------------------------
rm -rf $CORE/dist/
rm -rf $CORE/types/
tsc -p $CORE/tsconfig.json


# core
cd $CWD
CORE=./packages/noka
echo ------------------------------------------------------
echo PROJECT: $CORE
echo ------------------------------------------------------
rm -rf $CORE/dist/
tsc -p $CORE/tsconfig.json
copyfiles --up 3 $CORE/src/**/*.{json,yml,html,css,md} $CORE/dist/


# cli
cd $CWD
CLI=./packages/noka-cli
echo ------------------------------------------------------
echo PROJECT: $CLI
echo ------------------------------------------------------
rm -rf $CLI/dist/
tsc -p $CLI/tsconfig.json
copyfiles --up 3 $CLI/src/**/*.txt $CLI/dist/

# orm
cd $CWD
CORE=./packages/noka-orm
echo ------------------------------------------------------
echo PROJECT: $CORE
echo ------------------------------------------------------
rm -rf $CORE/dist/
rm -rf $CORE/types/
tsc -p $CORE/tsconfig.json


# app
cd $CWD
APP=./packages/noka-app
echo ------------------------------------------------------
echo PROJECT: $APP
echo ------------------------------------------------------
rm -rf $APP/dist/
cd $APP
nk build


# app-react
# cd $CWD
# APP=./packages/noka-app-react
# echo ------------------------------------------------------
# echo PROJECT: $APP
# echo ------------------------------------------------------
# rm -rf $APP/dist/
# cd $APP
# nk build