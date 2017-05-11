#!/bin/bash
set -e

# Usage:
# sh StrategoJS.sh
# Note: requires the Spoofax project to have been build.

LANGUGE_NAME="JS"

echo "Packing SDF for Stratego-$LANGUGE_NAME"

pack-sdf -i Stratego$LANGUGE_NAME.sdf -o Stratego$LANGUGE_NAME.def -Idef ../lib/StrategoMix.def --Include ../src-gen/syntax

echo "Creating parse table"

sdf2table -t -i Stratego$LANGUGE_NAME.def -m Stratego$LANGUGE_NAME -o Stratego$LANGUGE_NAME.tbl

echo "Finished"
