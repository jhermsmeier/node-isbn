function ISBN( value ) {
  
  if( !(this instanceof ISBN) )
    return new ISBN( value )
  
  this.groups = []
  
  if( value != null )
    this.parse( value )
  
}

ISBN.pattern = /(\d{3})?(\d)(\d{4})(\d{4})(\d)/
ISBN.prefixes = [ '978', '979' ]

ISBN.parse = function( value ) {
  return new ISBN( value )
}

ISBN.format = function( value, dashes ) {
  dashes = dashes != null ? dashes : true
  return new ISBN( value )
    .toString( dashes )
}

ISBN.prototype = {
  
  constructor: ISBN,
  
  get version() {
    switch( this.groups.length ) {
      case 5: return '13'
      case 4: return '10'
    }
  },
  
  get prefix() {
    return this.version === '13' ?
      this.groups[ 0 ] : void 0
  },
  
  get group() {
    return this.groups[ this.groups.length - 4 ]
  },
  
  get publisher() {
    return this.groups[ this.groups.length - 3 ]
  },
  
  get title() {
    return this.groups[ this.groups.length - 2 ]
  },
  
  get checksum() {
    return this.groups[ this.groups.length - 1 ]
  },
  
  isValid: function() {
    
    var isbn = this.toString()
      .split( '' )
      .map( function( digit ) {
        return digit !==  'X' ?
          parseInt( digit ) : 10
      })
    
    var version = this.version
    var checksum = isbn.pop()
    var sum = version != null ? 0 : NaN
    
    if( version === '13' ) {
      for( var i = 1; i < 13; i++ )
        sum += isbn[ i - 1 ] * (( i % 2 ) ? 1 : 3 )
      sum = 10 - sum % 10
    }
    else if( version === '10' ) {
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
    
    this.groups = match != null ?
      match.slice( 1 ) : []
    
    return this
    
  },
  
  toISBN10: function() {
    
    var isbn = new ISBN()
    
    isbn.groups = this.version === '13' ?
      isbn.groups = this.groups.slice( 1 ) :
      isbn.groups = this.groups.slice()
    
    return isbn
    
  },
  
  toISBN13: function( prefix ) {
    
    var isbn = new ISBN()
    
    isbn.groups = this.version === '13' ?
      isbn.groups = this.groups.slice() :
      isbn.groups = [ prefix || ISBN.prefixes[0] ]
        .concat( this.groups.slice() )
    
    return isbn
    
  },
  
  toString: function( dashes ) {
    return this.groups.join( dashes ? '-' : '' )
  }
  
}

module.exports = ISBN
