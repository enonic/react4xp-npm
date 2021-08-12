import React from 'react';
import PropTypes from 'prop-types';

import ComponentTag from 'react4xp-regions/ComponentTag';

/**
 * @param name (mandatory string): Region name, as defined in a part's/page's/layout's XML definition
 * @param regionData (mandatory object). data object for this specific region, from part or page or layout data
 *      (e.g. for the 'main' region in a page, regionData could be: content.page.regions.main)
 * @param tag (optional string): Sets the HTML tag for the region. If omitted, "div" is the default.
 * @param addClass (optional string): Adds an HTML class for the region, after "xp-region".
 * @returns A react4xp-representation (react component) of an XP region. Must be SERVER-SIDE-rendered by react4xp!
 */
const Region = ({name, regionData, tag, addClass}) => {
    if (!((name || '').trim())) {
        console.error(`<Region NO_NAME> name: ${JSON.stringify(name)}`);
        throw Error(`Can't render <Region> without a 'name' prop.`);
    }

    if (
        !regionData ||
        typeof regionData !== 'object' ||
        !Object.keys(regionData).length
    ) {
        console.error(`<Region "${name}"> regionData: ${JSON.stringify(regionData)}`);
        throw Error(`Can't render <Region "${name}"> without a 'regionData' prop.`);
    }

    const TAG = tag || "div";
    return <TAG
        data-portal-region={name}
        className={"xp-region" + (addClass ? ` ${addClass}` : '')}
        dangerouslySetInnerHTML={{
            __html: `\t\t\t\t\t${
                regionData.components && regionData.components.length > 0 ?
                    regionData.components
                        .map(component => ComponentTag(component))
                        .join('\n') :
                    ''
            }\t\t\t\t\t\n`,
        }}
    ></TAG>;
};
Region.propTypes = {
    name: PropTypes.string.isRequired,
    regionData: PropTypes.shape({
        components: PropTypes.arrayOf(PropTypes.shape({
            path: PropTypes.string.isRequired,
        })),
    }).isRequired,
    tag: PropTypes.string,
    addClass: PropTypes.string,
};

export default Region;
