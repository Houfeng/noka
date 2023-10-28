set -e


# core
CORE=./packages/noka
echo ------------------------------------------------------
echo PROJECT: $CORE
echo ------------------------------------------------------
rm -rf $CORE/dist/
tsc -p $CORE/tsconfig.json
copyfiles --up 3 $CORE/src/**/*.{json,yml,html,css,md} $CORE/dist/


# cli
CLI=./packages/noka-cli
echo ------------------------------------------------------
echo PROJECT: $CLI
echo ------------------------------------------------------
rm -rf $CLI/dist/
tsc -p $CLI/tsconfig.json
copyfiles --up 3 $CLI/src/**/*.txt $CLI/dist/

# app
APP=./packages/noka-app
echo ------------------------------------------------------
echo PROJECT: $APP
echo ------------------------------------------------------
rm -rf $APP/dist/
cd $APP
nk build