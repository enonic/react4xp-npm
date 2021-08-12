import React from 'react';
import PropTypes from 'prop-types';

import Region from 'react4xp-regions/Region';

/**
 * @param regionsData (mandatory object): regions data object (e.g. content.page.regions).
 *      Keys are region names, values are region data.
 * @param names (optional string or array of strings): selects to display only one, or some specific, of the available regions in the
 *      regions data. The array defines sequence, so this can also be used to display of all regions in a specific order.
 *      If omitted, all regions are displayed in the order of Object.keys(regionsData).
 * @param tags (optional string or object): HTML tag for the region elements.
 *      If string, all regions get that tag.
 *      If object: keys are region names and values are an HTML tag string for each region.
 * @param classes (optional boolean, string or object): HTML class for each region element, added after "xp-region".
 *      If boolean, and it's true: adds a class that is the same as the name of the region
 *      If string, all regions get that same class.
 *      If object: keys are region names, values are the class name string for that region.
 * @returns An array of <Region> elements.
 */
const Regions = ({regionsData, names, tags, classes}) => {
    if (
        !regionsData ||
        typeof regionsData !== 'object'
    ) {
        console.error('<Regions> regions: ' + JSON.stringify(regionsData));
        throw Error("Can't render <Regions> without a 'regionsData' prop.");
    }

    const selectedRegions =
        !names ? Object.keys(regionsData) :
            (typeof names === 'string') ? [names] :
                Array.isArray(names) ? names : null;

    if (!selectedRegions) {
        console.error('<Regions> names: ' + JSON.stringify(names));
        throw Error("Can't render <Regions>: 'names' prop must be a string, an array of strings or omitted/falsy.");
    }

    // TODO: sanitize tag and name: not all characters (or tags) are acceptable
    return selectedRegions.map(name =>
        <Region key={name}
                regionData={regionsData[name]}
                name={name}
                tag={typeof tags === 'string' ? tags : (tags || {})[name]}
                addClass={
                    classes === true ?
                        name :
                        typeof classes === 'string' ?
                            classes :
                            (classes || {})[name]
                }
        />
    );
};
Regions.propTypes = {
    regionsData: PropTypes.objectOf(
        PropTypes.shape({
            components: PropTypes.arrayOf(
                PropTypes.shape({
                    path: PropTypes.string.isRequired,
                })
            ),
        })
    ).isRequired,
    names: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(
            PropTypes.string
        ),
    ]),
    tags: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.objectOf(
            PropTypes.string
        ),
    ]),
    classes: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string,
        PropTypes.objectOf(
            PropTypes.string
        ),
    ]),
};

export default Regions;
