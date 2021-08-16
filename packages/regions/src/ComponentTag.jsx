/**
 * THIS IS NOT A REACT COMPONENT, just a function that returns an HTML string: a tag with a component path reference.
 * XP picks this up from the controller's returned response.body and inserts the inserted XP component with that path.
 * If you want to use this directly, this means two things:
 *      - In order to use this function in react4xp, the parent entry (or react component) must treat it as a pure-text function
 *          and insert the text with a 'dangerouslySetInnerHTML' prop.
 *      - The resulting react component MUST be server-side rendered (for now at least - this may change in later versions)!
 *
 * @param component (mandatory object): The component data object (e.g. an item in the array content.page.regions.main.components). Must
 *      have a 'path' string attribute.
 */
export default (component) => (component && component.path) ?
  `\t\t\t\t\t\t\n\t\t\t\t\t\t\t<!--# COMPONENT ${component.path} -->` :
  null;
