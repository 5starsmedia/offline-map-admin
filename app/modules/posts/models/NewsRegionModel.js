export default
  /*@ngInject*/
  function NewsRegionModel(ngNestedResource) {
    var resource = ngNestedResource('/api/regions/:_id/:method', { '_id': '@_id' }, {
      'getAsTree': {method: 'GET', params: { method: 'tree' }},
      'save': { method: 'PUT'},
      'delete': { method: 'DELETE'}
    }, {
      'nestedField': 'children'
    });
    return resource;
  }
