set -e

CWD=$PWD;

# app
cd $CWD
P=./packages/noka-tpl-site
echo ------------------------------------------------------
echo PROJECT: $P
echo ------------------------------------------------------
cd $P
nk test