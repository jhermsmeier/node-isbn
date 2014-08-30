function ISBN() {
  
  if( !(this instanceof ISBN) )
    return new ISBN()
  
}

ISBN.prototype = {
  
}

module.exports = ISBN
