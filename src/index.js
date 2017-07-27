
// registers the extension on a cytoscape lib ref
let register = function( cytoscape ){
  if( !cytoscape ){ return; } // can't register if cytoscape unspecified
    const opts = {
      repositionNodesAfter: 'both' // reposition nodes on expand or reclaim space on collapse,
      // can be one of 'both', 'collapse', 'expand'
    };

    cytoscape( 'collection', 'compoundCollapse', function(){
      var eles = this;
      var cy = this.cy();

      // your extension impl...

      return this; // chainability
    } );





};

if( typeof cytoscape !== 'undefined' ){ // expose to global cytoscape (i.e. window.cytoscape)
  register( cytoscape );
}

module.exports = register;
