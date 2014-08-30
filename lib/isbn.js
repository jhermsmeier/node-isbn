function ISBN() {
  
  if( !(this instanceof ISBN) )
    return new ISBN()
  
  this.groups = []
  
}

ISBN.pattern = /(\d{3})?(\d)(\d{4})(\d{4})(\d)/
ISBN.prefixes = [ '978', '979' ]

ISBN.prototype = {
  
  constructor: ISBN,
  
  get version() {
    switch( this.groups.length ) {
      case 5: return '13'
      case 4: return '10'
    }
  },
  
  get group() {
    return this.groups[
      this.groups.length - 4
    ]
  },
  
  get publisher() {
    return this.groups[
      this.groups.length - 3
    ]
  },
  
  get title() {
    return this.groups[
      this.groups.length - 2
    ]
  },
  
  get checksum() {
    return this.groups[
      this.groups.length - 1
    ]
  },
  
  isValid: function() {
    
    var version = this.version
    var sum = NaN
    
    var isbn = this.toString()
      .split( '' )
      .map( function( digit ) {
        return digit !==  'X' ?
          parseInt( digit ) : 10
      })
    
    var checksum = isbn.pop()
    
    if( version == null )
      return false
    
    if( version === '13' ) {
      sum = 0
      for( var i = 1; i < 13; i++ )
        sum += isbn[ i - 1 ] * (( i % 2 ) ? 1 : 3 )
      sum = 10 - sum % 10
    }
    else if( version === '10' ) {
      sum = 0
      for( var i = 1; i < 10; i++ )
        sum += isbn[i] * isbn[ i - 1 ]
      sum = sum % 11
    }
    
    return sum == checksum
    
  },
  
  parse: function( value ) {
    
    value = ( value + '' )
      .toUpperCase()
      .replace( /[^0-9X]/g, '' )
    
    var match = value.match( ISBN.pattern )
    
    if( match != null ) {
      this.groups = match.slice( 1 )
    } else {
      throw new Error( 'Invalid ISBN' )
    }
    
    return this
    
  },
  
  toString: function( format ) {
    return this.groups.join( format ? '-' : '' )
  }
  
}

module.exports = ISBN
