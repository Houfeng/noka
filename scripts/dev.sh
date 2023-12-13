set -e

CWD=$PWD;


# site
# cd $CWD
# P=./packages/noka-tpl-site
# echo ------------------------------------------------------
# echo PROJECT: $P
# echo ------------------------------------------------------
# cd $P
# nk dev


# app
cd $CWD
P=./packages/noka-tpl-app
echo ------------------------------------------------------
echo PROJECT: $P
echo ------------------------------------------------------
cd $P
nk dev