set -e

CWD=$PWD;


# util
cd $CWD
P=./packages/noka-util
echo ------------------------------------------------------
echo PROJECT: $P
echo ------------------------------------------------------
rm -rf $P/dist/
rm -rf $P/types/
tsc -p $P/tsconfig.json


# core
cd $CWD
P=./packages/noka
echo ------------------------------------------------------
echo PROJECT: $P
echo ------------------------------------------------------
rm -rf $P/dist/
tsc -p $P/tsconfig.json
copyfiles --up 3 $P/src/**/*.{json,yml,html,css,md} $P/dist/


# cli
cd $CWD
P=./packages/noka-cli
echo ------------------------------------------------------
echo PROJECT: $P
echo ------------------------------------------------------
rm -rf $P/dist/
tsc -p $P/tsconfig.json
copyfiles --up 3 $P/src/**/*.txt $P/dist/


# orm
cd $CWD
P=./packages/noka-orm
echo ------------------------------------------------------
echo PROJECT: $P
echo ------------------------------------------------------
rm -rf $P/dist/
rm -rf $P/types/
tsc -p $P/tsconfig.json


# site
cd $CWD
P=./packages/noka-tpl-site
echo ------------------------------------------------------
echo PROJECT: $P
echo ------------------------------------------------------
rm -rf $P/dist/
cd $P
nk build


# app
cd $CWD
P=./packages/noka-tpl-app
echo ------------------------------------------------------
echo PROJECT: $P
echo ------------------------------------------------------
rm -rf $P/dist/
cd $P
nk build