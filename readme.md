RUTA.js
----


*Route*_Key_-Value Collection for Browser and Node.js


Mainly used for an application routing, but can be used for any other purpose

```javascript

var collection = new ruta.Collection();

collection.add('/user/:id', myObject);
collection.get('/user/10') // -> { key: '/user/:id', value: myObject, current: { id: 10 } } 

// Will match '/foo', '/foo/bar', ...
collection.add('/foo', x);

// Strict Pattern
collection.add('!/foo')
collection.add('!/foo?query=string')


// Conditional
collection.add('/user/?:id')


// Query String
collection.add('/users', X);
collection.get('/users?loc=DE', {key: '/users', value: X, current: {loc: 'DE'} });

```


----
_Atma.js Project_
