function isActiveRoute(routes,currentRoute){
    return routes === currentRoute ? 'active' : '';
}

module.exports = {isActiveRoute};