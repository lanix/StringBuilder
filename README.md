StringBuilder
=============

StringBuilder Exercise

Sometimes there is a need to concatenate a small or large amount of strings into a single one. This can be used to join words to build a paragraph, to format a date time, etc.

When it comes to web development it is pretty routine to create page sections on the fly.  There are several paths you can follow to do it.  One way is to build the DOM elements, applying style and content and then adding them to the container node.  It’s a good practice to set up the elements before adding to the document, to avoid unnecessary page refreshing.

Alternatively, you can use string concatenation to make the markup and then use the innerHTML property of the container node to append the newly created content to the document.

String concatenation is ugly, error prone and very inefficient, so we need to come up with an effective and elegant solution to do it.
Requirements

Create a reusable object that facilitates string concatenation.  It shall have methods that allows the user to add one or more strings at the time, adding them conditionally, and at the end return the resulting string.

The Stringbuilder object must support the cascade or chaining pattern (discussed on page 42 of the book “Javascript the Good Parts”)
Recommendations

Use an Array as internal buffer, push into the array each single string and at the end use the join method to return the resulting string.
Specification
How to code it

Use prototype to create the functionality.  We might need a lot of instances of this class and want to save a bit of memory.  Or we might need direct access to the methods to create magic and hard-to-understand behavior :-)
How to use it

The expected result is a constructor function that will be called like this,

var sb = new StringBuilder();

Where sb will be a new instance of a StringBuilder object with all the concatenation methods.
Methods

    cat(arg1, arg2,..., argN) method [required]

This will be the most frequently used method, it allows the addition of one or many strings to the buffer.

var sb = new StringBuilder();

sb.cat(‘hello’);

sb.cat(‘ Javascript’, ‘ crazy’, ‘ world’).cat( ‘!!!’);

Note that you can send one or more arguments to the cat method and that you can instantly call the cat method again, thanks to the cascade or chaining pattern that you wisely implemented.

        Function as parameters [Nice to have]

The parameters on the cat method shall accept function objects, this function objects references will be called by the cat method and its return value will be added to the buffer instead of the function itself. Don’t forget to bind the function to the StringBuilder, that way, the StringBuilder methods will be accessibles inside the function.

var sb = new StringBuilder();

sb.cat(‘this is the first’’,’ line’, ‘\n’)

   .cat(‘here is the second’)

   .cat(‘and then’, ‘the third’)

   .cat(‘now’, function(){ return ‘ we can make some calcs’; }, ‘ here’);

Note: If you are clever enough, you will use the cat method as the only one to access the buffer storage, that way you will avoid repeating yourself and immediately will add support for functions as parameters to the other methods of the API (rep, catIf, etc).

        Array as parameter [Nice to have]

At this time the cat method supports a list of arguments which are expected to be strings, functions (which will be called inside the cat method and the return value will be pushed to the buffer) and any other kind of object that will be evaluated using the toString() method.

Having said that, your API will have to support the following call:

var sb = new StringBuilder();

sb

 .cat(‘this’, [‘ is’, ‘ a’, ‘ string’], ‘ in the’)

 .cat(‘ array’, ‘ :-)’);

But, you would not have gotten to this point if you haven't already implemented the functions as parameters requirement. :-)

var sb = new StringBuilder();

sb

 .cat(‘this’, [‘ is’, function(){ return [‘ a’, ‘ function that’,

 ‘ returns an array’]; }], ‘ ;)’);

    rep(arg1, arg2,..., argN, howManyTimes) method [required]

This method concatenates the same string a given number of times.

var sb = new StringBuilder();

sb.cat(‘Mom, can you’).rep(‘ please’, 10).cat(‘ buy me an ice cream’);

As you can see this method can be very useful to annoy your mom.  It can also be combined with cat using the cascade or chaining pattern (remember it, because it’s the last time I say it).

    catIf(arg1, arg2,..., argN, flag) method [required]

It’s very common that you will need perform the string concatenation only if a constraint is satisfied.  The last argument of this method must be a boolean testable value that will indicate if the given strings shall be added or not.

var sb = new StringBuilder();

sb.cat(‘Hello’)

   .catIf(‘ pretty’, ‘ lady!’, sex === ‘f’)

   .catIf(‘ gentleman!’, sex === ‘m’)

   .catIf(‘ and’, ‘ good’, ‘bye!’, !sex);

As you can see this method is very useful if you are writing an application that discriminates people that have sex undefined. :-)

    string() method [required]

This method is, in the end, the major purpose of why we are writing this library.  It will return a concatenated string of all the parameters that we have given our object.

var sb = new StringBuilder();

sb.cat(‘hello’,’ world, ‘!’);

console.log(sb.string());

In this case, the method shall return the ‘hello world!’ string.

    wrap([prefix], [suffix]) method [nice to have].

Everything you add to StringBuilder after this method is called shall be surrounded by the prefix and suffix arguments. The prefix and suffix arguments would be any supported type (string, function to be called, any object that will be evaluated against toString() method) or an array containing a list of any supported type.

var sb = new StringBuilder();

sb.cat(‘<ul>’, ‘\n’)

   .wrap(‘<li>’, [‘</li>’, ‘\n’])

   .rep(‘list item’, 10)

   .cat(‘</ul>’);

If you have implemented the “1.a” requirement, then your API will support functions as parameters and you shall be able to write the following script,

var sb = new StringBuilder();

sb

  .suffix('\n')

  .cat('<ul>')

  .wrap(['<li>', function(){ var count = 0;

        return function() { return count += 1; }}(), '.- '], '</li>')

  .rep('list item', 5)

  .end()

  .cat('</ul>')

Magic? Crazy? Hard to understand? Don’t say I did not warn you ;-)

In any case, if you did it the right way, you'll get this output,

<ul>

 <li>1.- list item</li>

 <li>2.- list item</li>

 <li>3.- list item</li>

 <li>4.- list item</li>

 <li>5.- list item</li>

</ul>

    end(deep) method [nice to have but required if you add wrap, prefix or suffix]

This method is intended to cancel the current or last “effect” or “decorator” that were added to the StringBuilder by calling any of the following methods: wrap, prefix and suffix.

The not required deep parameter will allow you to cancel more than one effect, they work as an stack, so it will just pop the last deep pushed effects or only the last one if deep is null or undefined.

See the example code on the wrap method and notice how we had to call the end() method just before the cat(‘</ul>’) to avoid the closing tag of ul HTML element get surrounded by the wrapper that builds up the <li>#.- list item</li>

    prefix(arg1, arg2,..., argN) method [nice to have].

As it happened with the wrap method, everything added after calling this method shall be prefixed with the specified arguments. If you want you can see this method as a shorthand for a wrapper that have no right parameter.

In other words, calling prefix must have the same result as calling wrap(‘left’, []).

var sb = new StringBuilder();

sb.cat(‘Todo list: \n’)

  .prefix(‘  - ‘)

  .cat(‘first thing to do\n’)

  .cat(‘second thing to do\n’)

  .cat(‘third thing to do\n’);

And you will get the following output,

Todo list:

    first thing to do

    second thing to do

    third thing to do

    suffix(arg1, arg2,..., argN) method [nice to have].

Really? Do I have to explain it?  It’s almost the same as prefix but it’s as if you were calling the wrap method like this, wrap([ ], ‘\n’).

Now we can change our todo list to avoid adding the ugly \n after each cat call.

var sb = new StringBuilder();

sb

  .suffix(‘\n’)

  .cat(‘Todo list:’)

  .prefix(‘  - ‘)

  .cat(‘first thing to do’)

  .cat(‘second’, ‘ thing’, ‘ to do’)

  .cat(‘third thing to do’);

    each([args], callback) method [nice to have]

This is a utility method that will allow the iteration over an array of values without breaking the cascade or chain. It shall to iterate over each value on the array and then call the callback function. The each method will call the callback setting the context (this) reference to the StringBuilder and will send three parameters value, index and the given args array itself.

var   sb = new StringBuilder(),

    people = [

        { name: 'pedro', sex: 'm', age: 30 },

        { name: 'leticia', sex: 'f', age: 21 },

        { name: 'pablo', sex: 'm', age: 20 }

    ];

sb

    .cat('<table>')

    .prefix('  ')

    .cat('<thead><tr><th>Name</th><th>Sex</th><th>Age</td></thead>')

    .cat('<tbody>')

    .prefix('  ')

    .each(people, function(value, index, thePeople){

        this

            .cat('<tr>')

            .prefix('  ')

            .cat('<td>', value.name, '</td>')

            .cat('<td>', value.sex, '</td>')

            .cat('<td>', value.age, '</td>')

            .end()

            .cat('</tr>');

    })

    .end()

    .cat('</tbody>')

    .end()

    .cat('</table>');

    suspend() method [nice to have]

The call to this method must “suspend” or “pause” the applied effects (prefix(), suffix() and wrap()) and it’s influence will finish with the call to end() method by restoring the previously added effects. This would be useful if you want to append a large amount of text and you want to temporarily turn off the effects you’ve already configured.

The following sample code assumes that you have implemented all the nice to have methods.

var sb = new StringBuilder(),

   sections = ['section 1', 'section 2', 'section 3'];

sb

    .suffix('\n')

    .cat('<body>')

    .prefix('  ')

    .wrap('<section>', '</section>')

    .each(sections, function(section, index){

        this

            .cat('<h1>', section, '</h1>', function(){

                this

                    .suspend()

                    .wrap('<p>', '</p>')

                    .cat('first paragraph')

                    .cat('second paragraph')

                    .end(2);

            })   

    })

    .end(2)

    .cat('</body>')

And if you did it well this is the output you must get,

<body>

 <section><h1>section 1</h1><p>first paragraph</p><p>second paragraph</p></section>

 <section><h1>section 2</h1><p>first paragraph</p><p>second paragraph</p></section>

 <section><h1>section 3</h1><p>first paragraph</p><p>second paragraph</p></section>

</body>

    when(expression, thenArgs, otherwiseArgs) method [nice to have]

This method must evaluate the expression and call the cat() method with the thenArgs or otherwiseArgs depending on the result of evaluation. If the expression is a function then if must be called and its result will be used to determine the path to choose.

var   sb = new StringBuilder(),

    people = [

        { name: 'pedro', sex: 'm', age: 30 },

        { name: 'leticia', sex: 'f', age: 21 },

        { name: 'pablo', sex: 'm', age: 20 }

    ];

sb

    .suffix('\n')

    .wrap('<p>', '</p>')

    .each(people, function(person){

        this.when(person.sex == 'm',

            function(){

                return person.name + ' is male';

            },

            [ person.name, ' is female' ]

        );

    });

The expected output will be,

<p>pedro is male</p>

<p>leticia is female</p>

<p>pablo is male</p>

    Summary



