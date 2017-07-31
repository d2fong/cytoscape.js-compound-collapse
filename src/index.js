const impl = require('./collection');

// registers the extension on a cytoscape lib ref
let register = function( cytoscape ){
  if( !cytoscape ){ return; } // can't register if cytoscape unspecified

  cytoscape( 'collection', 'collapse', function () {
    const eles = this;
    impl.collapse(eles);

    return this;
  }); // register with cytoscape.js

  cytoscape( 'collection', 'expand', function () {
    const eles = this;
    impl.expand(eles);
    
    return this;
  });

  cytoscape( 'collection', 'isCollapsed', function () {
    const eles = this;
    const node = eles[0];

    return impl.isCollapsed(node);
  });

  cytoscape( 'collection', 'isExpanded', function () {
    const eles = this;
    const node = eles[0];

    return impl.isExpanded(node);
  });

  cytoscape( 'collection', 'metaEdges', function () {
    const eles = this;
  
    return eles.edges().filter(edge => impl.isMetaEdge(edge));
  });

};

if( typeof cytoscape !== 'undefined' ){ // expose to global cytoscape (i.e. window.cytoscape)
  register( cytoscape );
}

module.exports = register;
