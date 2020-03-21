#!/bin/bash
lerna run clean
PROJECTDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
echo $PROJECTDIR
echo "################################# --> <constants>"
cd $PROJECTDIR/packages/buildconstants && npm link && echo "" && echo "################################# </constants> --> <components>" && echo "" && echo ""
cd $PROJECTDIR/packages/build-components && npm link react4xp-buildconstants && npm link && echo "" && echo "################################# </components> --> <regions>" && echo "" && echo ""
cd $PROJECTDIR/packages/regions && npm link && echo "" && echo "################################# </regions> --> <client>" && echo "" && echo ""
cd $PROJECTDIR/packages/runtime-client && npm link && echo "" && echo "################################# </client> --> <externals>" && echo "" && echo ""
cd $PROJECTDIR/packages/runtime-externals && npm link && echo "" && echo "################################# </externals> --> <nashornpolyfills>" && echo "" && echo ""
cd $PROJECTDIR/packages/runtime-nashornpolyfills && npm link && echo "" && echo "################################# </nashornpolyfills> --> <react4xp>" && echo "" && echo ""
cd $PROJECTDIR/packages/react4xp && npm link && echo "" && echo "################################# </react4xp>" && echo "" && echo ""
cd $PROJECTDIR && lerna run local
