#!/bin/bash
PROJECTDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
echo $PROJECTDIR
cd $PROJECTDIR/packages/react4xp && npm link && echo "" && echo "--------------------------------------" && echo "" && echo ""
cd $PROJECTDIR/packages/build-components && npm link && echo "" && echo "--------------------------------------" && echo "" && echo ""
cd $PROJECTDIR/packages/buildconstants && npm link && echo "" && echo "--------------------------------------" && echo "" && echo ""
cd $PROJECTDIR/packages/regions && npm link && echo "" && echo "--------------------------------------" && echo "" && echo ""
cd $PROJECTDIR/packages/runtime-client && npm link && echo "" && echo "--------------------------------------" && echo "" && echo ""
cd $PROJECTDIR/packages/runtime-externals && npm link && echo "" && echo "--------------------------------------" && echo "" && echo ""
cd $PROJECTDIR/packages/runtime-nashornpolyfills && npm link && echo "" && echo "--------------------------------------" && echo "" && echo ""
